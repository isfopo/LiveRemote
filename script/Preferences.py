import os
import shelve

DEFAULTS = {
    "requireCode": True
}


class Preferences():
    def __init__(self, dir: str) -> None:
        self._d = shelve.open(os.path.join(dir, ".preferences"), 'c')

    def get(self, key: str):
        try:
            return self._d[key]
        except KeyError:
            self.set(key, DEFAULTS[key])
            return DEFAULTS[key]

    def set(self, key: str, value):
        self._d[key] = value

    def getAll(self):
        prefs = {}
        for key in DEFAULTS:
            prefs[key] = self.get(key)
        return prefs

    def close(self):
        self._d.close()
