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
    let cellMenu = new JupyterLabMenu({ commands });
    cellMenu.menu.title.label = 'Cell';

    let cellTypeMenu = new Menu({ commands }); // sub-menu for published projects
    cellTypeMenu.title.label = 'Cell Type';
    cellTypeMenu.addItem({ command: 'notebook:change-cell-to-raw' });
    cellTypeMenu.addItem({ command: 'notebook:change-cell-to-markdown' });
    cellTypeMenu.addItem({ command: 'notebook:change-cell-to-code' });

    let currentOutputMenu = new Menu({ commands }); // sub-menu for published projects
    currentOutputMenu.title.label = 'Current Output';
    currentOutputMenu.addItem({ command: 'notebook:hide-cell-outputs' });
    currentOutputMenu.addItem({ command: 'notebook:show-cell-outputs' });
    currentOutputMenu.addItem({ command: 'notebook:clear-cell-output' });

    let allOutputMenu = new Menu({ commands }); // sub-menu for published projects
    allOutputMenu.title.label = 'All Output';
    allOutputMenu.addItem({ command: 'notebook:hide-all-cell-outputs' });
    allOutputMenu.addItem({ command: 'notebook:show-all-cell-outputs' });
    allOutputMenu.addItem({ command: 'notebook:enable-output-scrolling' });
    allOutputMenu.addItem({ command: 'notebook:disable-output-scrolling' });
    allOutputMenu.addItem({ command: 'notebook:clear-all-cell-outputs' });

    // rank -1 can be used to move a new submenu to the left-most position
    cellMenu.addGroup([
      { command: 'runmenu:run' },
      { command: 'notebook:run-cell' },
      { command: 'notebook:run-cell-and-insert-below' },
      { command: 'notebook:run-all-above' },
      { command: 'notebook:run-all-below' },
      { command: 'runmenu:run-all' }
    ], 0);

    cellMenu.addGroup([
      { type: 'submenu' as Menu.ItemType, submenu: cellTypeMenu}
    ], 1);
    cellMenu.addGroup([
      { type: 'submenu' as Menu.ItemType, submenu: currentOutputMenu},
      { type: 'submenu' as Menu.ItemType, submenu: allOutputMenu}
    ], 2);
    mainMenu.addMenu(cellMenu.menu, { rank : 3 });
  },
  requires: [
    IMainMenu, ICommandPalette
  ]
};

export default extension;
