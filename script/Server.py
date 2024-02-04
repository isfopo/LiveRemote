import socket
import threading
import json
from _Framework import ControlSurface
import base64
import hashlib
import struct

PORT = 8000


class Server(threading.Thread):
    def __init__(self, control_surface: ControlSurface, port=PORT):
        super().__init__()
        self.port = port
        self.control_surface = control_surface

    def run(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(("0.0.0.0", self.port))
        sock.listen(1)

        while True:
            conn, addr = sock.accept()
            print("Connected by", addr)

            data = conn.recv(1024)
            headers = self.parse_headers(data)

            # Perform WebSocket handshake
            key = headers["Sec-WebSocket-Key"]
            resp_key = self.calculate_response_key(key)
            handshake_response = self.create_handshake_response(resp_key)

            conn.sendall(handshake_response.encode())

            # Handle WebSocket frames
            while True:
                frame = conn.recv(2)
                if not frame:
                    break

                first_byte, second_byte = struct.unpack("!BB", frame)
                fin = (first_byte & 0b10000000) >> 7
                opcode = first_byte & 0b00001111
                mask = (second_byte & 0b10000000) >> 7
                payload_length = second_byte & 0b01111111

                if mask:
                    masking_key = conn.recv(4)

                if payload_length == 126:
                    payload_length = struct.unpack("!H", conn.recv(2))[0]
                elif payload_length == 127:
                    payload_length = struct.unpack("!Q", conn.recv(8))[0]

                payload_data = conn.recv(payload_length)

                if mask:
                    unmasked_data = bytearray()
                    for i in range(len(payload_data)):
                        unmasked_data.append(payload_data[i] ^ masking_key[i % 4])
                    payload_data = unmasked_data

                # Parse payload_data to object
                payload = self.parse_payload_to_object(payload_data)

                self.control_surface.log_message(payload["hi"])

    def parse_headers(self, data):
        headers = {}
        lines = data.split(b"\r\n")

        for line in lines[1:-2]:
            key, value = line.split(b": ")
            headers[key.decode()] = value.decode()

        return headers

    def calculate_response_key(self, key):
        GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        hash = hashlib.sha1((key + GUID).encode()).digest()
        return base64.b64encode(hash).decode()

    def create_handshake_response(self, key):
        return (
            "HTTP/1.1 101 Switching Protocols\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            "Sec-WebSocket-Accept: {}\r\n\r\n"
        ).format(key)

    def parse_payload_to_object(self, payload_data):
        try:
            return json.loads(payload_data.decode())
        except json.JSONDecodeError:
            return None
