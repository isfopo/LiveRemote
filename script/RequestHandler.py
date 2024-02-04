from http.server import BaseHTTPRequestHandler
import json


class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
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
