// Electron Main Process Entry Point
// Creates a BaseWindow with a chromeView (React UI) and tab WebContentsViews
// managed by ElectronBrowserEngine. This is a real Chromium-based browser.

import { app, BaseWindow, WebContentsView, screen, ipcMain } from 'electron';
import * as path from 'path';
import { CompositionRoot } from './di/CompositionRoot';
import { registerIpcHandlers } from './ipc/handlers';

// Height of the browser chrome (tabs + navigation bar) in pixels
const CHROME_HEIGHT = 82;

let mainWindow: BaseWindow | null = null;
let chromeView: WebContentsView | null = null;
let container: CompositionRoot | null = null;

// Disable hardware acceleration if memory is tight (helps on 8GB machines)
// app.disableHardwareAcceleration();

function createWindow(): void {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BaseWindow({
        width: Math.min(1400, width),
        height: Math.min(900, height),
        minWidth: 800,
        minHeight: 600,
        titleBarStyle: 'hidden',
        titleBarOverlay: false,
        backgroundColor: '#101622',
        show: false, // Show after ready to prevent white flash
    });

    // Create the Chrome UI view (React/Next.js)
    chromeView = new WebContentsView({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false, // Preload needs node APIs
            webviewTag: false,
        },
    });

    // Add chromeView as the first child — it covers the full window
    mainWindow.contentView.addChildView(chromeView);

    // Load the Next.js UI into the chrome view
    const isDev = !app.isPackaged;
    if (isDev) {
        chromeView.webContents.loadURL('http://localhost:3000');
        // Uncomment to open DevTools for the chrome UI:
        // chromeView.webContents.openDevTools({ mode: 'detach' });
    } else {
        chromeView.webContents.loadFile(path.join(__dirname, '../out/index.html'));
    }

    // Initialize Hexagonal Architecture with BaseWindow
    container = new CompositionRoot(mainWindow);
    registerIpcHandlers(container, mainWindow, chromeView);

    // Register window control IPC handlers
    ipcMain.handle('window:minimize', () => {
        mainWindow?.minimize();
    });

    ipcMain.handle('window:maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow?.maximize();
        }
    });

    ipcMain.handle('window:close', () => {
        mainWindow?.close();
    });

    // Set initial bounds once chrome view is ready
    chromeView.webContents.once('did-finish-load', () => {
        if (mainWindow && chromeView) {
            const [winWidth, winHeight] = mainWindow.getContentSize();

            // Chrome UI covers the full window
            chromeView.setBounds({ x: 0, y: 0, width: winWidth, height: winHeight });

            // Tell the engine where to place web content views (below the chrome)
            container?.getEngine().updateBounds({
                x: 0,
                y: CHROME_HEIGHT,
                width: winWidth,
                height: winHeight - CHROME_HEIGHT,
            });
        }
    });

    // Show window once chrome view content is rendered
    chromeView.webContents.once('did-finish-load', () => {
        if (mainWindow) {
            mainWindow.show();

            // Create the initial tab
            container?.getEngine().createTab();
        }
    });

    // Update bounds when window resizes
    mainWindow.on('resize', () => {
        if (mainWindow && chromeView && container) {
            const [winWidth, winHeight] = mainWindow.getContentSize();

            // Chrome UI always covers full window
            chromeView.setBounds({ x: 0, y: 0, width: winWidth, height: winHeight });

            // Update web content view bounds
            container.getEngine().updateBounds({
                x: 0,
                y: CHROME_HEIGHT,
                width: winWidth,
                height: winHeight - CHROME_HEIGHT,
            });
        }
    });

    mainWindow.on('closed', () => {
        container?.destroy();
        container = null;
        chromeView = null;
        mainWindow = null;
    });
}

// App lifecycle
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BaseWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Security: Prevent new webview creation globally
app.on('web-contents-created', (_event, contents) => {
    contents.setWindowOpenHandler(() => {
        return { action: 'deny' };
    });
});
