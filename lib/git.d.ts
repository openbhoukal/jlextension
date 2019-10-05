import { JSONObject } from '@phosphor/coreutils';
/** Function type for diffing a file's revisions */
export declare type IDiffCallback = (filename: string, revisionA: string, revisionB: string) => void;
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
export declare function httpGitRequest(url: string, method: string, request: Object | null): Promise<Response>;
/**
 * Structure for the result of the Git Push & Pull API.
 */
export interface IGitPushPullResult {
    code: number;
    message?: string;
}
/** Parent class for all API requests */
export declare class Git {
    constructor();
    /** Make request for the Git Pull API. */
    pull(path: string): Promise<IGitPushPullResult>;
    /** Make request for the Git Push API. */
    push(path: string): Promise<IGitPushPullResult>;
    /** Make request for git status of repository 'path' */
    status(path: string): Promise<IGitStatusResult>;
    /** Make request for git commit logs of repository 'path' */
    log(path: string): Promise<IGitLogResult>;
    /** Make request for a list of all git branches in repository 'path' */
    branch(path: string): Promise<IGitBranchResult>;
    /** Make request to add one or all files into
     * the staging area in repository 'path'
     */
    add(check: boolean, filename: string, path: string): Promise<Response>;
    /** Make request to add all untracked files into
     * the staging area in repository 'path'
     */
    addAllUntracked(path: string): Promise<Response>;
    /** Make request to commit all staged files in repository 'path' */
    commit(message: string, path: string): Promise<Response>;
    /**
     * Get or set Git configuration options
     *
     * @param path Top repository path
     * @param options Configuration options to set (undefined to get)
     */
    config(path: string, options?: JSONObject): Promise<Response>;
}
