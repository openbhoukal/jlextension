import json

from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import APIHandler


class GitHandler(APIHandler):
    """
    Top-level parent class.
    """

    @property
    def git(self):
        return self.settings["git"]

class GitCommitHandler(GitHandler):
    """
    Handler for 'git commit -m <message>'. Commits files.
    """

    def post(self):
        """
        POST request handler, commits files.
        """
        data = self.get_json_body()
        top_repo_path = data["top_repo_path"]
        commit_msg = data["commit_msg"]
        my_output = self.git.commit(commit_msg, top_repo_path)
        self.finish(my_output)


class GitAddHandler(GitHandler):
    """
    Handler for git add <filename>'.
    Adds one or all files into to the staging area.
    """

    def get(self):
        """
        GET request handler, adds files in the staging area.
        """
        self.finish(
            json.dumps(
                {"add_all": "check", "filename": "filename", "top_repo_path": "path"}
            )
        )

    def post(self):
        """
        POST request handler, adds one or all files into the staging area.
        """
        data = self.get_json_body()
        top_repo_path = data["top_repo_path"]
        if data["add_all"]:
            my_output = self.git.add_all(top_repo_path)
        else:
            filename = data["filename"]
            my_output = self.git.add(filename, top_repo_path)
        self.finish(my_output)


class DockerHandler:
    
    @property
    def docker(self):
        return self.settings["docker"]

    
class DockerBuildHandler(DockerHandler):
    """
    Handle for docker build . or <Dockerfile>
    Build image from Dockerfile
    """
    
    def post(self):
        data = self.get_json_body()
        top_repo_path = data["top_repo_path"]
        output = self.docker.build(top_repo_path)
        self.finish(output)
        
