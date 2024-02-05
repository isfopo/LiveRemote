import json
from typing import Union

from .Status import Status
from .Method import Method


class OutgoingMessage:
    """
    A class to represent an outgoing message from a LiveRemote server.

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
        result (str, int, float, bool, None): product of call
    """

    def __init__(
        self,
        status: Status,
        method: Method,
        address: str,
        prop: str,
        result: Union[str, int, float, bool, None] = None,
    ) -> None:
        self.status = status
        self.method = method
        self.address = address
        self.prop = prop
        self.result = result

    @property
    def data(self):
        return json.dumps(
            {
                "status": self.status.value,
                "method": self.method.value,
                "address": self.address,
                "prop": self.prop,
                "result": self.result,
            }
        )
