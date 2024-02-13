from typing import Any, Union

from .Method import Method


class IncomingMessage:
    """
    A class to represent an incoming message from a LiveRemote server.

    Attributes:
        client: the client that sent the message.
        method (Method): action to take.
            Options:
                CALL: calls a method on object.
                GET: request for the value of a given property.
                SET: changes value of given property.
                LISTEN: creates listener for given property.
                UNLISTEN: removes lister for given property.
        address (str): location of property or method.
        prop (str): property or method.
        value (any): value to be passed to method or property
        type (str): type of value
    """

    client_id: int
    payload: Union[Any, None]
    method: Method
    address: str
    prop: str
    type: str
    code: Union[int, None]

    def __init__(self, client_id: int, payload: Union[Any, None]):
        self.client_id = client_id
        self.payload = payload
        if self.payload is not None:
            self.method = Method(self.payload["method"])
            self.address = self.payload["address"]
            self.prop = self.payload["prop"]
            try:
                self.type = self.payload["type"]
            except KeyError:
                self.type = "null"
            try:
                if self.payload["code"] is not None:
                    self.code = int(self.payload["code"])
            except (ValueError, KeyError):
                self.code = None

    @property
    def value(self):
        try:
            if self.payload is not None:
                if self.type == "boolean":
                    return bool(self.payload["value"])
                elif self.type == "int":
                    return int(self.payload["value"])
                elif self.type == "float":
                    return float(self.payload["value"])
                elif self.type == "string":
                    return str(self.payload["value"])
                else:
                    return None
            else:
                return None
        except KeyError:
            return None
