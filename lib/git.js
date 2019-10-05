import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';
/** Makes a HTTP request, sending a git command to the backend */
export function httpGitRequest(url, method, request) {
    let fullRequest;
    if (request === null) {
        fullRequest = {
            method: method
        };
    }
    else {
        fullRequest = {
            method: method,
            body: JSON.stringify(request)
        };
    }
    let setting = ServerConnection.makeSettings();
    let fullUrl = URLExt.join(setting.baseUrl, url);
    return ServerConnection.makeRequest(fullUrl, fullRequest, setting);
}
/** Parent class for all API requests */
export class Git {
    constructor() { }
    /** Make request for the Git Pull API. */
    async pull(path) {
        try {
            let response = await httpGitRequest('/git/pull', 'POST', {
                current_path: path
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        }
        catch (err) {
            throw ServerConnection.NetworkError;
        }
    }
    /** Make request for the Git Push API. */
    async push(path) {
        try {
            let response = await httpGitRequest('/git/push', 'POST', {
                current_path: path
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        }
        catch (err) {
            throw ServerConnection.NetworkError;
        }
    }
    /** Make request for git status of repository 'path' */
    async status(path) {
        try {
            let response = await httpGitRequest('/git/status', 'POST', {
                current_path: path
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        }
        catch (err) {
            throw ServerConnection.NetworkError;
        }
    }
    /** Make request for git commit logs of repository 'path' */
    async log(path) {
        try {
            let response = await httpGitRequest('/git/log', 'POST', {
                current_path: path
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        }
        catch (err) {
            throw ServerConnection.NetworkError;
        }
    }
    /** Make request for a list of all git branches in repository 'path' */
    async branch(path) {
        try {
            let response = await httpGitRequest('/git/branch', 'POST', {
                current_path: path
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        }
        catch (err) {
            throw ServerConnection.NetworkError;
        }
    }
    /** Make request to add one or all files into
     * the staging area in repository 'path'
     */
    async add(check, filename, path) {
        return httpGitRequest('/git/add', 'POST', {
            add_all: check,
            filename: filename,
            top_repo_path: path
        });
    }
    /** Make request to add all untracked files into
     * the staging area in repository 'path'
     */
    async addAllUntracked(path) {
        try {
            let response = await httpGitRequest('/git/add_all_untracked', 'POST', {
                top_repo_path: path
            });
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        }
        catch (err) {
            throw ServerConnection.NetworkError;
        }
    }
    /** Make request to commit all staged files in repository 'path' */
    async commit(message, path) {
        try {
            let response = await httpGitRequest('/git/commit', 'POST', {
                commit_msg: message,
                top_repo_path: path
            });
            if (response.status !== 200) {
                return response.json().then((data) => {
                    throw new ServerConnection.ResponseError(response, data.message);
                });
            }
            return response;
        }
        catch (err) {
            throw ServerConnection.NetworkError;
        }
    }
    /**
     * Get or set Git configuration options
     *
     * @param path Top repository path
     * @param options Configuration options to set (undefined to get)
     */
    async config(path, options) {
        try {
            let method = 'POST';
            let body = { path, options };
            let response = await httpGitRequest('/git/config', method, body);
            if (!response.ok) {
                const jsonData = await response.json();
                throw new ServerConnection.ResponseError(response, jsonData.message);
            }
            return response;
        }
        catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }
}
