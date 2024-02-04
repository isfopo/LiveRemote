from __future__ import with_statement
from http.server import HTTPServer
import threading

from _Framework import ControlSurface
from .RequestHandler import RequestHandler

PORT = 8000


class Server(threading.Thread):
    def __init__(self, control_surface: ControlSurface, port=PORT):
        super().__init__()
        self.port = port
        self.control_surface = control_surface

    def run(self):
        def handler(*args, **kwargs):
            return RequestHandler(*args, control_surface=self.control_surface, **kwargs)

        with HTTPServer(("0.0.0.0", self.port), handler) as httpd:
            httpd.serve_forever()
