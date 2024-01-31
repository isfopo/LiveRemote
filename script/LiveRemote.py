from __future__ import with_statement

import os
from _Framework.ControlSurface import ControlSurface
from .handlers import Handler
from .websocket_server import WebsocketServer
from .helpers.network import get_ip
from .Preferences import Preferences


class LiveRemote(ControlSurface):
    # running on 3.7.0 checked 11.2
    __module__ = __name__
    __doc__ = "Remote script to start an instance of the LiveRemote server"

    def __init__(self, c_instance):
        ControlSurface.__init__(self, c_instance)
        with self.component_guard():
            self.server = WebsocketServer(host=get_ip(), port=9001)
            self.handler = Handler(self)

            self.server.set_fn_message_received(self.handler.incoming_message)
            self.server.set_fn_new_client(self.handler.on_connection)
            self.server.set_fn_client_left(self.handler.on_disconnect)

            self.preferences = Preferences(os.path.dirname(os.path.realpath(__file__))
                                           )

            self.server.run(threaded=True)

    def disconnect(self):
        """clean up on disconnect"""
        self.server.shutdown_gracefully()
        ControlSurface.disconnect(self)
        return None
