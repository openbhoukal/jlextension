import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';
import { JSONObject } from '@phosphor/coreutils';

/** Function type for diffing a file's revisions */
export type IDiffCallback = (
  filename: string,
  revisionA: string,
  revisionB: string
) => void;

/** Interface for GitShowPrefix request result,
 * has the prefix path of a directory in a repository,
 * with respect to the root directory.
 */
export interface IGitCheckoutResult {
  code: number;
  message?: string;
}

/** Interface for GitBranch request result,
 * has the result of changing the current working branch
 */
export interface IGitBranchResult {
  code: number;
  branches?: Array<{
    is_current_branch: boolean;
    is_remote_branch: boolean;
    name: string;
    upstream: string;
    top_commit: string;
    tag: string;
  }>;
}

/** Interface for GitStatus request result,
 * has the status of each changed file
 */
export interface IGitStatusFileResult {
  x: string;
  y: string;
  to: string;
  from: string;
}

/** Interface for GitStatus request result,
 * has the status of the entire repo
 */
export interface IGitStatusResult {
  code: number;
  files?: [IGitStatusFileResult];
}

/** Interface for GitLog request result,
 * has the info of a single past commit
 */
export interface ISingleCommitInfo {
  commit: string;
  author: string;
  date: string;
  commit_msg: string;
  pre_commit: string;
}

/** Interface for GitCommit request result,
 * has the info of a committed file
 */
export interface ICommitModifiedFile {
  modified_file_path: string;
  modified_file_name: string;
  insertion: string;
  deletion: string;
}

 

/** Interface for GitLog request result,
 * has the info of all past commits
 */
export interface IGitLogResult {
  code: number;
  commits?: [ISingleCommitInfo];
}

export interface IIdentity {
  name: string;
  email: string;
}

/** Makes a HTTP request, sending a git command to the backend */
export function httpGitRequest(
  url: string,
  method: string,
  request: Object | null
): Promise<Response> {
  let fullRequest;
  if (request === null) {
    fullRequest = {
      method: method
    };
  } else {
    fullRequest = {
      method: method,
      body: JSON.stringify(request)
    };
  }

  let setting = ServerConnection.makeSettings();
  let fullUrl = URLExt.join(setting.baseUrl, url);
  return ServerConnection.makeRequest(fullUrl, fullRequest, setting);
}

 

/**
 * Structure for the result of the Git Push & Pull API.
 */
export interface IGitPushPullResult {
  code: number;
  message?: string;
}

/** Parent class for all API requests */
export class Git {
  constructor() {}

  /** Make request for the Git Pull API. */
  async pull(path: string): Promise<IGitPushPullResult> {
    try {
      let response = await httpGitRequest('/git/pull', 'POST', {
        current_path: path
      });
      if (response.status !== 200) {
        const data = await response.json();
        throw new ServerConnection.ResponseError(response, data.message);
      }
      return response.json();
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }

  /** Make request for the Git Push API. */
  async push(path: string): Promise<IGitPushPullResult> {
    try {
      let response = await httpGitRequest('/git/push', 'POST', {
        current_path: path
      });
      if (response.status !== 200) {
        const data = await response.json();
        throw new ServerConnection.ResponseError(response, data.message);
      }
      return response.json();
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }
 

  /** Make request for git status of repository 'path' */
  async status(path: string): Promise<IGitStatusResult> {
    try {
      let response = await httpGitRequest('/git/status', 'POST', {
        current_path: path
      });
      if (response.status !== 200) {
        const data = await response.json();
        throw new ServerConnection.ResponseError(response, data.message);
      }
      return response.json();
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }

  /** Make request for git commit logs of repository 'path' */
  async log(path: string): Promise<IGitLogResult> {
    try {
      let response = await httpGitRequest('/git/log', 'POST', {
        current_path: path
      });
      if (response.status !== 200) {
        const data = await response.json();
        throw new ServerConnection.ResponseError(response, data.message);
      }
      return response.json();
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }


  /** Make request for a list of all git branches in repository 'path' */
  async branch(path: string): Promise<IGitBranchResult> {
    try {
      let response = await httpGitRequest('/git/branch', 'POST', {
        current_path: path
      });
      if (response.status !== 200) {
        const data = await response.json();
        throw new ServerConnection.ResponseError(response, data.message);
      }
      return response.json();
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }

  /** Make request to add one or all files into
   * the staging area in repository 'path'
   */
  async add(check: boolean, filename: string, path: string): Promise<Response> {
    return httpGitRequest('/git/add', 'POST', {
      add_all: check,
      filename: filename,
      top_repo_path: path
    });
  }

  /** Make request to add all untracked files into
   * the staging area in repository 'path'
   */
  async addAllUntracked(path: string): Promise<Response> {
    try {
      let response = await httpGitRequest('/git/add_all_untracked', 'POST', {
        top_repo_path: path
      });
      if (response.status !== 200) {
        const data = await response.json();
        throw new ServerConnection.ResponseError(response, data.message);
      }
      return response.json();
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }

  /** Make request to commit all staged files in repository 'path' */
  async commit(message: string, path: string): Promise<Response> {
    try {
      let response = await httpGitRequest('/git/commit', 'POST', {
        commit_msg: message,
        top_repo_path: path
      });
      if (response.status !== 200) {
        return response.json().then((data: any) => {
          throw new ServerConnection.ResponseError(response, data.message);
        });
      }
      return response;
    } catch (err) {
      throw ServerConnection.NetworkError;
    }
  }

  /**
   * Get or set Git configuration options
   *
   * @param path Top repository path
   * @param options Configuration options to set (undefined to get)
   */
  async config(path: string, options?: JSONObject): Promise<Response> {
    try {
      let method = 'POST';
      let body = { path, options };

      let response = await httpGitRequest('/git/config', method, body);

      if (!response.ok) {
        const jsonData = await response.json();
        throw new ServerConnection.ResponseError(response, jsonData.message);
      }

      return response;
    } catch (err) {
      throw new ServerConnection.NetworkError(err);
    }
  }

}

