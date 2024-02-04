from __future__ import with_statement
from _Framework.ControlSurface import ControlSurface
from .Handler import Handler
from .Server import Server


class LiveRemote(ControlSurface):
    __module__ = __name__
    __doc__ = "Remote script to start an instance of the LiveRemote server"

    def __init__(self, c_instance):
        ControlSurface.__init__(self, c_instance)
        with self.component_guard():
            self.server = Server(c_instance)
            self.handler = Handler(c_instance, server=self.server)

            self.server.on_connect = self.handler.on_connection
            self.server.on_message = self.handler.on_message
            self.server.on_disconnect = self.handler.on_disconnect

            self.server.start()

    def disconnect(self):
        """clean up on disconnect"""
        self.server.shutdown()
        ControlSurface.disconnect(self)
        return None
