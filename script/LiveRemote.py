from __future__ import with_statement
from _Framework.ControlSurface import ControlSurface
from . import Server
from . import RequestHandler


class LiveRemote(ControlSurface):
    __module__ = __name__
    __doc__ = "Remote script to start an instance of the LiveRemote server"

    def __init__(self, c_instance):
        ControlSurface.__init__(self, c_instance)
        with self.component_guard():
            self.server = Server.Server(RequestHandler.RequestHandler)
            self.log_message("Server init")
            self.server.start()

    def disconnect(self):
        """clean up on disconnect"""
        ControlSurface.disconnect(self)
        return None
