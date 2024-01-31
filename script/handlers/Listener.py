from typing import Callable


class Listener():
    def __init__(self, client, target, prop: str, callback: Callable[[], None]):
        self.client = client
        self.target = target
        self.prop = prop
        self.callback = callback
