/** Makes a HTTP request, sending a docker command to the backend */
export declare function httpGitRequest(url: string, method: string, request: Object | null): Promise<Response>;
export declare class Docker {
    constructor();
    /**
     * Make request for docker build API
     */
    build(path: string): Promise<Response>;
}
