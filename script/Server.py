import socket
import threading
import json
import base64
import hashlib
import struct
from _Framework import ControlSurface

PORT = 8000


class Server(threading.Thread):
    def __init__(
        self,
        control_surface: ControlSurface,
        port=PORT,
        on_connect=None,
        on_message=None,
        on_disconnect=None,
    ):
        super().__init__()
        self.port = port
        self.control_surface = control_surface
        self.on_connect = on_connect
        self.on_message = on_message
        self.on_disconnect = on_disconnect
        self._is_running = True

    def run(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(("0.0.0.0", self.port))
        sock.listen(1)

        while True:
            self.conn, self.addr = sock.accept()
            print("Connected by", self.addr)

            if self.on_connect:
                self.on_connect(self.addr)

            data = self.conn.recv(1024)
            headers = self.parse_headers(data)

            # Perform WebSocket handshake
            key = headers["Sec-WebSocket-Key"]
            resp_key = self.calculate_response_key(key)
            handshake_response = self.create_handshake_response(resp_key)

            self.conn.sendall(handshake_response.encode())

            # Handle WebSocket frames
            while self._is_running:
                frame = self.conn.recv(2)
                if not frame:
                    break

                first_byte, second_byte = struct.unpack("!BB", frame)

                fin = (first_byte & 0b10000000) >> 7
                opcode = first_byte & 0b00001111
                rsv1 = (first_byte & 0b01000000) >> 6
                rsv2 = (first_byte & 0b00100000) >> 5
                rsv3 = (first_byte & 0b00010000) >> 4
                mask = (second_byte & 0b10000000) >> 7
                payload_length = second_byte & 0b01111111

                if rsv2 or rsv3:
                    raise ValueError(
                        "Invalid WebSocket frame: RSV2 and RSV3 must be clear"
                    )

                if mask:
                    masking_key = self.conn.recv(4)

                if payload_length == 126:
                    payload_length = struct.unpack("!H", self.conn.recv(2))[0]
                elif payload_length == 127:
                    payload_length = struct.unpack("!Q", self.conn.recv(8))[0]

                payload_data = self.conn.recv(payload_length)

                if mask:
                    unmasked_data = bytearray()
                    for i in range(len(payload_data)):
                        unmasked_data.append(payload_data[i] ^ masking_key[i % 4])
                    payload_data = unmasked_data

                # Parse payload_data to object
                payload = self.parse_payload_to_object(payload_data)

                if self.on_message:
                    self.on_message(payload)

            if self.on_disconnect:
                self.on_disconnect(self.addr)

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

    def send(self, payload: dict) -> None:
        # Convert the payload object to a JSON string
        payload_json = json.dumps(payload)

        # Send the header and payload through the socket connection
        self.conn.sendall(self.create_websocket_header(payload_json.encode("utf-8")))

    def create_websocket_header(self, payload):
        header = bytearray()

        # Set the FIN bit to 1 and opcode to 1 for a text message
        header.append(0b10000001)

        # Set the mask bit to 0 (masking is not required for server-to-client messages)
        payload_length = len(payload)
        if payload_length < 126:
            header.append(payload_length)
        elif payload_length < 65536:
            header.append(126)
            header.extend(struct.pack("!H", payload_length))
        else:
            header.append(127)
            header.extend(struct.pack("!Q", payload_length))

        return header + payload

    def shutdown(self):
        self._is_running = False
        self.conn.close()
