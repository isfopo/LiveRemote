from typing import Dict
import Live


class ClientCodes:
    """
    A class to store client codes
    """

    _map: Dict[int, int] = {}

    def new(self, clientId):
        self._map[clientId] = Live.Application.get_random_int(  # type: ignore
            100000, 999999
        )

    def remove(self, clientId: str):
        del self._map[clientId]

    def validate(self, clientId: str, code: int):
        if self._map[clientId] == code:
            return True
        else:
            return False

    def get(self, clientId: str):
        return self._map[clientId]
