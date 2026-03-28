import { app, BrowserWindow, shell, Menu, dialog, Tray, nativeImage } from 'electron';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
require('./ipc.cjs');

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

const isDev = !app.isPackaged;

interface WindowBounds {
  x?: number;
  y?: number;
  width: number;
  height: number;
  isMaximized?: boolean;
}

function getConfigPath(): string {
  const configDir = app.getPath('userData');
  return join(configDir, 'window-state.json');
}

function loadWindowState(): WindowBounds {
  try {
    const configPath = getConfigPath();
    if (existsSync(configPath)) {
      const data = readFileSync(configPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load window state:', error);
  }
  return { width: 1200, height: 800 };
}

function saveWindowState(): void {
  if (!mainWindow) return;

  try {
    const bounds = mainWindow.getBounds();
    const state: WindowBounds = {
      ...bounds,
      isMaximized: mainWindow.isMaximized(),
    };
    const configPath = getConfigPath();
    const configDir = app.getPath('userData');
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }
    writeFileSync(configPath, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('Failed to save window state:', error);
  }
}

function createMenu(): void {
  const macosTemplate: Electron.MenuItemConstructorOptions[] = [
    { label: app.getName(), submenu: [
      { role: 'about' as const },
      { type: 'separator' as const },
      { role: 'services' as const },
      { type: 'separator' as const },
      { role: 'hide' as const },
      { role: 'hideOthers' as const },
      { role: 'unhide' as const },
      { type: 'separator' as const },
      { role: 'quit' as const },
    ]},
  ];

  const template: Electron.MenuItemConstructorOptions[] = process.platform === 'darwin' ? macosTemplate.concat([
    {
      label: 'File',
      submenu: [
        { role: 'quit' as const },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'pasteAndMatchStyle' as const },
        { role: 'delete' as const },
        { type: 'separator' as const },
        { role: 'selectAll' as const },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow?.webContents.send('open-settings');
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About OpenClaw',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'About OpenClaw GUI',
              message: 'OpenClaw GUI',
              detail: `Version: ${app.getVersion()}\n\nA graphical interface for OpenClaw.\n\nOpenClaw is a command-line tool for various development tasks.`,
              buttons: ['OK'],
            });
          },
        },
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/mogoweb/mojoclaw');
          },
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/mogoweb/mojoclaw/issues');
          },
        },
      ],
    },
  ]) : [
    {
      label: 'File',
      submenu: [
        { role: 'quit' as const },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { type: 'separator' as const },
        { role: 'selectAll' as const },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow?.webContents.send('open-settings');
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About OpenClaw',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'About OpenClaw GUI',
              message: 'OpenClaw GUI',
              detail: `Version: ${app.getVersion()}\n\nA graphical interface for OpenClaw.\n\nOpenClaw is a command-line tool for various development tasks.`,
              buttons: ['OK'],
            });
          },
        },
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/mogoweb/mojoclaw');
          },
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/mogoweb/mojoclaw/issues');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow(): void {
  const windowState = loadWindowState();

  mainWindow = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 800,
    minHeight: 600,
    show: false,
    title: 'OpenClaw GUI',
    webPreferences: {
      preload: join(__dirname, 'preload/index.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // Save window state on resize/move
  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);
  mainWindow.on('maximize', saveWindowState);
  mainWindow.on('unmaximize', saveWindowState);

  // Check for running operations before close
  mainWindow.on('close', async (event) => {
    if (!isQuitting && process.platform !== 'darwin') {
      event.preventDefault();
      mainWindow?.webContents.send('check-running-operations');
    }
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
}

let tray: Tray | null = null;

function createTray(): void {
  // Create a simple tray icon (16x16 transparent)
  const icon = nativeImage.createEmpty();
  
  tray = new Tray(icon);
  tray.setToolTip('OpenClaw GUI');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show OpenClaw',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: 'Quick Scan',
      click: () => {
        mainWindow?.show();
        mainWindow?.webContents.send('navigate', 'quick-scan');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow?.show();
  });
}

// Handle protocol for macOS
app.on('open-url', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});

app.whenReady().then(() => {
  createMenu();
  createWindow();
  createTray();

  app.on('activate', () => {
    // On macOS it's common to re-create a window
    // when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

export { mainWindow, isDev };
