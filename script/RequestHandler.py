from http.server import BaseHTTPRequestHandler
import json

from _Framework import ControlSurface


class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, control_surface: ControlSurface, **kwargs):
        self.control_surface = control_surface
        super().__init__(*args, **kwargs)

    def do_GET(self):
        self.control_surface.log_message("hi from handler")
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            data = {"key": "value"}
            self.wfile.write(json.dumps(data).encode())

    def do_POST(self):
        if self.path == "/":
            # content_length = int(self.headers["Content-Length"])
            # post_data = self.rfile.read(content_length)
            # data = json.loads(post_data)
            # Process the data...
            self.send_response(200)
            self.wfile.write(json.dumps({"status": "success"}).encode())
