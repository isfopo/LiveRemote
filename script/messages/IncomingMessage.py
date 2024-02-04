import json
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

    def __init__(self, client, obj):
        self.client = client
        self.obj = obj
        try:
            self.code: int = int(self.obj["code"])
        except:
            self.code = 0
        self.method: Method = Method(self.obj["method"])
        self.address: str = self.obj["address"]
        self.prop: str = self.obj["prop"]
        self.type: str = self.obj["type"]

    @property
    def value(self):
        try:
            if self.type == "boolean":
                return bool(self.obj["value"])
            elif self.type == "int":
                return int(self.obj["value"])
            elif self.type == "float":
                return float(self.obj["value"])
            elif self.type == "string":
                return str(self.obj["value"])
            else:
                return None
        except:
            return None
