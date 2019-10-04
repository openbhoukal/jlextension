import os
import subprocess



class Docker:
    """
    A class containing docker method
    """

    def __init__(self, root_dir, *args, **kwargs):
        super().__init__(*args, **kwargs)
       

    def build(self, current_path):
        """
        Create docker image from dockerfile
        """
        my_output = subprocess.check_output(["docker", "build"], cwd=current_path)
        return my_output
