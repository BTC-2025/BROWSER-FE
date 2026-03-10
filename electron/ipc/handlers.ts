// IPC Handlers
// Routes IPC intents from the renderer to the correct Application Layer use case.
// This is the "Adapter" in hexagonal architecture that connects the UI port to the core.

import { ipcMain, BaseWindow, WebContentsView } from 'electron';
import { CompositionRoot } from '../di/CompositionRoot';

export function registerIpcHandlers(container: CompositionRoot, mainWindow: BaseWindow, chromeView: WebContentsView): void {
    const engine = container.getEngine();

    // --- Browser Core ---
    ipcMain.handle('core:openTab', async (_event, url?: string) => {
        const tab = await container.openTab.execute(url);
        return tab;
    });

    ipcMain.handle('core:closeTab', async (_event, tabId: string) => {
        await container.closeTab.execute(tabId);
        return engine.getUIState();
    });

    ipcMain.handle('core:navigateToUrl', async (_event, tabId: string, url: string) => {
        await container.navigateToUrl.execute(tabId, url);
        return engine.getUIState();
    });

    ipcMain.handle('core:setActiveTab', async (_event, tabId: string) => {
        return container.setActiveTab.execute(tabId);
    });

    ipcMain.handle('core:goBack', async (_event, tabId: string) => {
        await engine.goBack(tabId);
        return engine.getUIState();
    });

    ipcMain.handle('core:goForward', async (_event, tabId: string) => {
        await engine.goForward(tabId);
        return engine.getUIState();
    });

    ipcMain.handle('core:reload', async (_event, tabId: string) => {
        await engine.reload(tabId);
        return engine.getUIState();
    });

    ipcMain.handle('core:getUIState', async () => {
        return engine.getUIState();
    });

    ipcMain.handle('core:updateBounds', async (_event, bounds: { x: number; y: number; width: number; height: number }) => {
        engine.updateBounds(bounds);
    });

    // --- State Change Broadcasting ---
    // Forward engine state changes to the chrome UI view via IPC events
    engine.onStateChange((state) => {
        try {
            if (chromeView && !chromeView.webContents.isDestroyed()) {
                chromeView.webContents.send('ui:tabStateUpdated', state);
            }
        } catch (err) {
            // Chrome view may be closing
        }
    });
}
