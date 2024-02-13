import json
from typing import List

from _Framework.ControlSurface import ControlSurface

from .ClientCodes import ClientCodes
from .helpers.host import get_hostname
from .helpers.lists import first
from .IncomingMessage import IncomingMessage
from .Listener import Listener
from .Method import Method
from .OutgoingMessage import OutgoingMessage
from .Server import Server
from .Status import Status


class Handler:
    """
    A class to handle incoming and outgoing messages to a LiveRemote client
    """

    def __init__(self, control_surface: ControlSurface, server: Server):
        self.control_surface = control_surface
        self.server: Server = server
        self.listeners: List[Listener] = []
        self.live = self.control_surface.application()
        self.song = self.control_surface.song()
        self.client_codes = ClientCodes()

    def __getitem__(self, key):
        return getattr(self, key)

    def on_connection(self, client_id: int):
        """
        Called for every client connecting (after handshake)
        """
        self.control_surface.log_message(
            "New client connected: {client}".format(client=client_id)
        )
        self.client_codes.new(client_id)

        self.server.send(
            client_id,
            OutgoingMessage(
                Status.SUCCESS,
                Method.AUTH,
                "/socket",
                "info",
                get_hostname(),
            ).to_dict(),
        )

    def on_disconnect(self, client_id: int):
        """
        Called for every client disconnecting
        """
        for listener in self.listeners:
            if listener.client == client_id:
                getattr(listener.target, f"remove_{listener.prop}_listener")(
                    listener.callback
                )

                self.listeners.remove(listener)

        self.client_codes.remove(client_id)

        self.control_surface.log_message(
            "Client({client}) disconnected".format(client=client_id)
        )

    def on_message(self, client_id: int, payload: str):
        message = IncomingMessage(client_id, payload)

        self.control_surface.log_message(
            "Client({client}) sent: {message}".format(client=client_id, message=message)
        )

        if message.method == Method.AUTH:
            if message.address == "/code" and message.prop == "show":
                self.control_surface.show_message(
                    f"Client secret is {self.client_codes.get(client_id)}"
                )
                return

            if message.address == "/code" and message.prop == "check":
                if self.client_codes.validate(client_id, message.code):
                    self.server.send(
                        client_id,
                        OutgoingMessage(
                            Status.SUCCESS,
                            message.method,
                            message.address,
                            message.prop,
                            message.code,
                        ).to_dict(),
                    )
                else:
                    self.server.send(
                        client_id,
                        OutgoingMessage(
                            Status.FAILURE,
                            message.method,
                            message.address,
                            message.prop,
                            "Incorrect code",
                        ).to_dict(),
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
                self.server.send(
                    client_id,
                    OutgoingMessage(
                        Status.SUCCESS,
                        message.method,
                        message.address,
                        message.prop,
                        value,
                    ).to_dict(),
                )
                return

        elif message.method == Method.LISTEN:
            if (
                len(
                    [
                        listener
                        for listener in self.listeners
                        if listener.client == client_id
                        and listener.prop == message.prop
                    ]
                )
                == 0
            ):

                def callback():
                    result = getattr(self.locate(message.address), message.prop)

                    if result is not None:
                        try:
                            self.server.send(
                                client_id,
                                (
                                    OutgoingMessage(
                                        Status.SUCCESS,
                                        message.method,
                                        message.address,
                                        message.prop,
                                        result,
                                    )
                                ).to_dict(),
                            )
                        except BrokenPipeError:
                            self.server.send(
                                client_id,
                                (
                                    OutgoingMessage(
                                        Status.SUCCESS,
                                        message.method,
                                        message.address,
                                        message.prop,
                                        result,
                                    )
                                ).to_dict(),
                            )
                        return

                try:
                    target = self.locate(message.address)

                    getattr(target, f"add_{message.prop}_listener")(callback)

                    self.listeners.append(
                        Listener(client_id, target, message.prop, callback)
                    )

                    callback()

                except Exception as error:
                    self.server.send(
                        client_id,
                        (
                            OutgoingMessage(
                                Status.FAILURE,
                                message.method,
                                message.address,
                                message.prop,
                                str(error),
                            )
                        ).to_dict(),
                    )
                    return
            else:
                self.server.send(
                    client_id,
                    (
                        OutgoingMessage(
                            Status.FAILURE,
                            message.method,
                            message.address,
                            message.prop,
                            "listener already exists",
                        )
                    ).to_dict(),
                )
                return

        elif message.method == Method.UNLISTEN:
            listener = first(
                [
                    listener
                    for listener in self.listeners
                    if listener.client == client_id and listener.prop == message.prop
                ]
            )

            if listener is not None:
                getattr(listener.target, f"remove_{listener.prop}_listener")(
                    listener.callback
                )

                self.listeners.remove(listener)
            self.server.send(
                client_id,
                (
                    OutgoingMessage(
                        Status.SUCCESS,
                        message.method,
                        message.address,
                        message.prop,
                    )
                ).to_dict(),
            )
            return

        if (
            self.control_surface.preferences.get("requireCode") is True
            and self.client_codes.validate(client_id, message.code) is False
        ):
            self.server.send(
                client_id,
                OutgoingMessage(
                    Status.FAILURE,
                    message.method,
                    message.address,
                    message.prop,
                    "Not authorized",
                ).to_dict(),
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

                self.server.send(
                    client_id,
                    OutgoingMessage(
                        Status.SUCCESS,
                        message.method,
                        message.address,
                        message.prop,
                        result,
                    ).to_dict(),
                )
            except Exception as error:
                self.server.send(
                    client_id,
                    OutgoingMessage(
                        Status.FAILURE,
                        message.method,
                        message.address,
                        message.prop,
                        str(error),
                    ).to_dict(),
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
                            self.locate(message.address),
                            message.prop,
                            message.value,
                        )

                    self.server.send(
                        client_id,
                        OutgoingMessage(
                            Status.SUCCESS,
                            message.method,
                            message.address,
                            message.prop,
                            message.value,
                        ).to_dict(),
                    )
                    return

                except Exception as error:
                    self.server.send(
                        client_id,
                        OutgoingMessage(
                            Status.FAILURE,
                            message.method,
                            message.address,
                            message.prop,
                            str(error),
                        ).to_dict(),
                    )
                    return

            else:
                self.server.send(
                    client_id,
                    OutgoingMessage(
                        Status.FAILURE,
                        message.method,
                        message.address,
                        message.prop,
                        "No value was given",
                    ).to_dict(),
                )
                return

    def locate(self, address: str):
        location = self
        split = address.split("/")[1:]

        for attr in split:
            try:
                location = location[int(attr)]
            except ValueError:
                try:
                    location = getattr(location, attr)
                except AttributeError:
                    pass

        return location
