"""
Module for executing git commands, sending results back to the handlers
"""
import os
import subprocess
from subprocess import Popen, PIPE, CalledProcessError
from urllib.parse import unquote

from tornado.web import HTTPError


ALLOWED_OPTIONS = ['user.name', 'user.email']


class Git:
    """
    A single parent class containing all of the individual git methods in it.
    """

    def __init__(self, root_dir, *args, **kwargs):
        super(Git, self).__init__(*args, **kwargs)
        self.root_dir = os.path.realpath(os.path.expanduser(root_dir))

    def config(self, top_repo_path, **kwargs):
        """Get or set Git options.
        
        If no kwargs, all options are returned. Otherwise kwargs are set.
        """
        response = {"code": 1}

        if len(kwargs):
            output = []
            for k, v in filter(lambda t: True if t[0] in ALLOWED_OPTIONS else False, kwargs.items()):
                cmd = ["git", "config", "--add", k, v]
                p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=top_repo_path)
                out, err = p.communicate()
                output.append(out.decode("utf-8").strip())
                response["code"] = p.returncode
                if p.returncode != 0:
                    response["command"] = " ".join(cmd)
                    response["message"] = err.decode("utf-8").strip()
                    return response

            response["message"] = "\n".join(output).strip()
        else:
            cmd = ["git", "config", "--list"]
            p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=top_repo_path)
            output, error = p.communicate()

            response = {"code": p.returncode}

            if p.returncode != 0:
                response["command"] = " ".join(cmd)
                response["message"] = error.decode("utf-8").strip()
            else:
                raw = output.decode("utf-8").strip()
                response["options"] = dict()
                for l in raw.split("\n"):
                    k, v = l.split("=", maxsplit=1)
                    if k in ALLOWED_OPTIONS:
                        response["options"][k] = v

        return response


    def add(self, filename, top_repo_path):
        """
        Execute git add<filename> command & return the result.
        """
        my_output = subprocess.check_output(["git", "add", filename], cwd=top_repo_path)
        return my_output

    def add_all(self, top_repo_path):
        """
        Execute git add all command & return the result.
        """
        my_output = subprocess.check_output(["git", "add", "-A"], cwd=top_repo_path)
        return my_output

    def add_all_untracked(self, top_repo_path):
        """
        Execute git add_all_untracked command & return the result.
        """
        e = 'echo "a\n*\nq\n" | git add -i'
        my_output = subprocess.call(e, shell=True, cwd=top_repo_path)
        return {"result": my_output}


    def commit(self, commit_msg, top_repo_path):
        """
        Execute git commit <filename> command & return the result.
        """
        my_output = subprocess.check_output(
            ["git", "commit", "-m", commit_msg], cwd=top_repo_path
        )
        return my_output
