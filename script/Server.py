from __future__ import with_statement
from http.server import HTTPServer
import threading
from . import RequestHandler

PORT = 8000


class Server(threading.Thread):
    def __init__(self, handler: RequestHandler, port=PORT):
        super().__init__()
        self.port = port
        self.handler = handler

    def run(self):
        with HTTPServer(("localhost", self.port), self.handler) as httpd:
            httpd.serve_forever()
