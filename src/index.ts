import {
  Menu
} from '@phosphor/widgets';

import {
  ICommandPalette
} from '@jupyterlab/apputils';

import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

// import {
//  PageConfig, URLExt
// } from '@jupyterlab/coreutils';

import {
  IMainMenu
} from '@jupyterlab/mainmenu';


import { Git } from './git';
import { Docker } from './docker';

/**
 * The command IDs used by the plugin.
 */
export
namespace CommandIDs {
  export
    const prepare: string = 'management:prepare';

  export
    const commit: string = 'management:commit';
  export const gitAdd: string = '';
  export const gitCommit: string = '';
};


/**
 * Activate the jupyterlab managementextension.
 */
function activateManagementExtension(app: JupyterFrontEnd, palette: ICommandPalette, mainMenu: IMainMenu): void {

  const category = 'Management';
  const { commands } = app;
  let gitApi = new Git();
  let dockerApi = new Docker();

  function findCurrentFileBrowserPath(): string {
    try {
      let leftSidebarItems = app.shell.widgets('left');
      let fileBrowser = leftSidebarItems.next();
      while (fileBrowser.id !== 'filebrowser') {
        fileBrowser = leftSidebarItems.next();
      }
      return (fileBrowser as any).model.path;
    } catch (err) {}
  }

  commands.addCommand(CommandIDs.prepare, {
    label: 'Prepare',
    caption: 'Create and build dockerfile using all the files in workspace.',
    execute: () => {
      // const {Image} = require('container-image-builder');
      //const { exec } = require('child_process');
      //exec('sudo docker build .', (err, stdout, stderr) => {
      // your callback
      //});
      let currentFileBrowserPath = findCurrentFileBrowserPath();
      dockerApi.build(currentFileBrowserPath);
      
    }
  });

  commands.addCommand(CommandIDs.commit, {
    label: 'Commit',
    caption: 'Commit files in workspace to local git repo.',
    execute: () => {
      let currentFileBrowserPath = findCurrentFileBrowserPath();
      gitApi.addAllUntracked(currentFileBrowserPath);
      gitApi.commit("A new commit", currentFileBrowserPath);
    }
  });

  // Add commands and menu itmes.
  let menu = new Menu({ commands });
  menu.title.label = category;
  [
    CommandIDs.prepare,
    CommandIDs.commit,
  ].forEach(command => {
    palette.addItem({ command, category });
    menu.addItem({ command });
  });
  mainMenu.addMenu(menu, { rank: 100 });
}


/**
 * Initialization data for the jupyterlab management extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  activate: activateManagementExtension,
  id: 'managementextension',
  requires: [
    ICommandPalette,
    IMainMenu,
  ],
  autoStart: true,
};

export default extension;
