import { JupyterFrontEndPlugin } from '@jupyterlab/application';
/**
 * The command IDs used by the plugin.
 */
export declare namespace CommandIDs {
    const prepare: string;
    const commit: string;
    const gitAdd: string;
    const gitCommit: string;
}
/**
 * Initialization data for the jupyterlab_hub extension.
 */
declare const extension: JupyterFrontEndPlugin<void>;
export default extension;
