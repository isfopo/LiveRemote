import socket


def get_hostname() -> str:
    hostname = socket.gethostname()
    return hostname.split(".")[0] if list else ""
