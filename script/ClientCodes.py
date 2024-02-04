from typing import Dict
import Live


class ClientCodes:
    """
    A class to store client codes
    """

    _map: Dict[int, int] = {}

    def new(self, client_id):
        self._map[client_id] = Live.Application.get_random_int(  # type: ignore
            100000, 999999
        )

    def remove(self, client_id: str):
        del self._map[client_id]

    def validate(self, client_id: str, code: int):
        if self._map[client_id] == code:
            return True
        else:
            return False

    def get(self, client_id: str):
        return self._map[client_id]
