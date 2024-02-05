from enum import Enum


class Method(Enum):
    AUTH = "AUTH"
    CALL = "CALL"
    GET = "GET"
    SET = "SET"
    LISTEN = "LISTEN"
    UNLISTEN = "UNLISTEN"
