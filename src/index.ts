import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {IMainMenu, JupyterLabMenu} from '@jupyterlab/mainmenu';

import {ICommandPalette} from '@jupyterlab/apputils';

import {Menu} from '@phosphor/widgets';

import '../style/index.css';

/**
 * Initialization data for the managementextension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'managementextension',
  autoStart: true,
  activate: (app: JupyterFrontEnd, mainMenu: IMainMenu) => {
    console.log('JupyterLab extension managementextension is activated!');
    const { commands } = app;
    let mgmtMenu = new JupyterLabMenu({ commands });
    mgmtMenu.menu.title.label = 'Management';

    let prepareMenu = new Menu({ commands }); // sub-menu
    prepareMenu.title.label = 'Prepare';

    let commitMenu = new Menu({ commands }); // sub-menu
    commitMenu.title.label = 'Commit';

    mgmtMenu.addGroup([
      { type: 'submenu' as Menu.ItemType, submenu: prepareMenu},
      { type: 'submenu' as Menu.ItemType, submenu: commitMenu},
    ], 0);
    mainMenu.addMenu(mgmtMenu.menu, { rank : 4 });
  },
  requires: [
    IMainMenu, ICommandPalette
  ]
};

export default extension;
