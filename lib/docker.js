import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';
// import { JSONObject } from '@phosphor/coreutils';
/** Makes a HTTP request, sending a docker command to the backend */
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
export class Docker {
    constructor() { }
    /**
     * Make request for docker build API
     */
    async build(path) {
        try {
            let response = await httpGitRequest('/docker/build', 'POST', {
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
}
