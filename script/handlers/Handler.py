from typing import List
from _Framework.ControlSurface import ControlSurface
from ..helpers.host import get_hostname
from .ClientCodes import ClientCodes
from ..messages.Status import Status
from ..helpers.lists import first
from .Listener import Listener
from ..messages.OutgoingMessage import OutgoingMessage

from ..messages.IncomingMessage import IncomingMessage
from ..messages.Method import Method
import json


class Handler:
    """
    A class to handle incoming and outgoing messages to a LiveRemote client
    """

    def __init__(self, control_surface: ControlSurface):
        self.control_surface = control_surface
        self.listeners: List[Listener] = []
        self.live = self.control_surface.application()
        self.song = self.control_surface.song()
        self.client_codes = ClientCodes()

    def __getitem__(self, key):
        return getattr(self, key)

    def on_connection(self, client, server):
        """
        Called for every client connecting (after handshake)
        """
        self.control_surface.log_message(
            "New client connected and was given id %d" % client["id"]
        )
        self.client_codes.new(client["id"])

        server.send_message(
            client,
            OutgoingMessage(
                Status.SUCCESS,
                Method.AUTH,
                "/socket",
                "info",
                get_hostname(),
            ).data,
        )

    def on_disconnect(self, client, server):
        """
        Called for every client disconnecting
        """
        for listener in self.listeners:
            if listener.client["id"] == client["id"]:
                getattr(listener.target, f"remove_{listener.prop}_listener")(
                    listener.callback
                )

                self.listeners.remove(listener)

        self.client_codes.remove(client["id"])

        self.control_surface.log_message("Client(%d) disconnected" % client["id"])

    def incoming_message(self, client, server, data: str):
        message = IncomingMessage(client, data)
        self.control_surface.log_message(message.data)

        if message.method == Method.AUTH:
            if message.address == "/code" and message.prop == "show":
                self.control_surface.show_message(
                    f"Client secret is {self.client_codes.get(client['id'])}"
                )
                return

            if message.address == "/code" and message.prop == "check":
                if self.client_codes.validate(client["id"], message.code):
                    server.send_message(
                        client,
                        OutgoingMessage(
                            Status.SUCCESS,
                            message.method,
                            message.address,
                            message.prop,
                            message.code,
                        ).data,
                    )
                else:
                    server.send_message(
                        client,
                        OutgoingMessage(
                            Status.FAILURE,
                            message.method,
                            message.address,
                            message.prop,
                            "Incorrect code",
                        ).data,
                    )
                return

        elif message.method == Method.GET:
            if message.address == "/pref":
                if message.prop == "all":
                    value = json.dumps(self.control_surface.preferences.getAll())
                else:
                    value = self.control_surface.preferences.get(message.prop)
            else:
                value = getattr(self.locate(message.address), message.prop)

            if value is not None:
                server.send_message(
                    client,
                    OutgoingMessage(
                        Status.SUCCESS,
                        message.method,
                        message.address,
                        message.prop,
                        value,
                    ).data,
                )
                return

        elif message.method == Method.LISTEN:
            if (
                len(
                    [
                        listener
                        for listener in self.listeners
                        if listener.client["id"] == client["id"]
                        and listener.prop == message.prop
                    ]
                )
                == 0
            ):

                def callback():
                    result = getattr(self.locate(message.address), message.prop)

                    if result is not None:
                        try:
                            server.send_message(
                                client,
                                (
                                    OutgoingMessage(
                                        Status.SUCCESS,
                                        message.method,
                                        message.address,
                                        message.prop,
                                        result,
                                    )
                                ).data,
                            )
                        except BrokenPipeError:
                            server.send_message(
                                client,
                                (
                                    OutgoingMessage(
                                        Status.SUCCESS,
                                        message.method,
                                        message.address,
                                        message.prop,
                                        result,
                                    )
                                ).data,
                            )
                        return

                try:
                    target = self.locate(message.address)

                    getattr(target, f"add_{message.prop}_listener")(callback)

                    self.listeners.append(
                        Listener(client, target, message.prop, callback)
                    )

                    callback()

                except Exception as error:
                    server.send_message(
                        client,
                        (
                            OutgoingMessage(
                                Status.FAILURE,
                                message.method,
                                message.address,
                                message.prop,
                                str(error),
                            )
                        ).data,
                    )
                    return
            else:
                server.send_message(
                    client,
                    (
                        OutgoingMessage(
                            Status.FAILURE,
                            message.method,
                            message.address,
                            message.prop,
                            "listener already exists",
                        )
                    ).data,
                )
                return

        elif message.method == Method.UNLISTEN:
            listener = first(
                [
                    listener
                    for listener in self.listeners
                    if listener.client["id"] == client["id"]
                    and listener.prop == message.prop
                ]
            )

            if listener is not None:
                getattr(listener.target, f"remove_{listener.prop}_listener")(
                    listener.callback
                )

                self.listeners.remove(listener)
            server.send_message(
                client,
                (
                    OutgoingMessage(
                        Status.SUCCESS, message.method, message.address, message.prop
                    )
                ).data,
            )
            return

        if (
            self.control_surface.preferences.get("requireCode") is True
            and self.client_codes.validate(client["id"], message.code) is False
        ):
            server.send_message(
                client,
                OutgoingMessage(
                    Status.FAILURE,
                    message.method,
                    message.address,
                    message.prop,
                    "Not authorized",
                ).data,
            )
            return

        if message.method == Method.CALL:
            try:
                if message.value is not None:
                    result = getattr(self.locate(message.address), message.prop)(
                        message.value
                    )
                else:
                    result = getattr(self.locate(message.address), message.prop)()

                server.send_message(
                    client,
                    OutgoingMessage(
                        Status.SUCCESS,
                        message.method,
                        message.address,
                        message.prop,
                        result,
                    ).data,
                )
            except Exception as error:
                server.send_message(
                    client,
                    OutgoingMessage(
                        Status.FAILURE,
                        message.method,
                        message.address,
                        message.prop,
                        str(error),
                    ).data,
                )
                return

        elif message.method == Method.SET:
            if message.value is not None:
                try:
                    if message.address == "/pref":
                        self.control_surface.preferences.set(
                            message.prop, message.value
                        )
                    else:
                        setattr(
                            self.locate(message.address), message.prop, message.value
                        )

                    server.send_message(
                        client,
                        OutgoingMessage(
                            Status.SUCCESS,
                            message.method,
                            message.address,
                            message.prop,
                            message.value,
                        ).data,
                    )
                    return

                except Exception as error:
                    server.send_message(
                        client,
                        OutgoingMessage(
                            Status.FAILURE,
                            message.method,
                            message.address,
                            message.prop,
                            str(error),
                        ).data,
                    )
                    return

            else:
                server.send_message(
                    client,
                    OutgoingMessage(
                        Status.FAILURE,
                        message.method,
                        message.address,
                        message.prop,
                        "No value was given",
                    ).data,
                )
                return

    def locate(self, address: str):
        location = self
        split = address.split("/")[1:]

        for attr in split:
            try:
                location = location[int(attr)]
            except:
                location = getattr(location, attr)

        return location
