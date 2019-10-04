"""
Initialize the backend server extension
"""
from managementextension.handlers import setup_handlers
from managementextension.git import Git
from managementextension.docker import Docker


def _jupyter_server_extension_paths():
    """
    Declare the Jupyter server extension paths.
    """
    return [{"module": "managementextension"}]


def _jupyter_nbextension_paths():
    """
    Declare the Jupyter notebook extension paths.
    """
    return [{"section": "notebook", "dest": "managementextension"}]


def load_jupyter_server_extension(nbapp):
    """
    Load the Jupyter server extension.
    """
    git = Git(nbapp.web_app.settings.get('server_root_dir'))
    nbapp.web_app.settings["git"] = git
    setup_handlers(nbapp.web_app)
