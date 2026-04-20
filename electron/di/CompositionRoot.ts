// DI: CompositionRoot
// Hexagonal Architecture dependency injection container.
// Resolves interfaces to concrete implementations.

import { BaseWindow } from 'electron';
import { IBrowserEngine } from '../domain/interfaces/IBrowserEngine';
import { ElectronBrowserEngine } from '../infrastructure/ElectronBrowserEngine';
import { MemoryManager } from '../infrastructure/MemoryManager';
import { OpenTabUseCase } from '../application/usecases/OpenTabUseCase';
import { CloseTabUseCase } from '../application/usecases/CloseTabUseCase';
import { NavigateToUrlUseCase } from '../application/usecases/NavigateToUrlUseCase';
import { SetActiveTabUseCase } from '../application/usecases/SetActiveTabUseCase';

export class CompositionRoot {
    private engine: IBrowserEngine;
    private memoryManager: MemoryManager;

    // Use Cases
    public openTab: OpenTabUseCase;
    public closeTab: CloseTabUseCase;
    public navigateToUrl: NavigateToUrlUseCase;
    public setActiveTab: SetActiveTabUseCase;

    constructor(window: BaseWindow, chromeView?: any) {
        // Infrastructure
        this.engine = new ElectronBrowserEngine(window, chromeView);
        this.memoryManager = new MemoryManager({
            tabInactivityThresholdMs: 5 * 60_000, // 5 minutes
            checkIntervalMs: 30_000, // Check every 30s
            memoryPressureThreshold: 0.75,
        });
        this.memoryManager.start(this.engine);

        // Application Use Cases
        this.openTab = new OpenTabUseCase(this.engine);
        this.closeTab = new CloseTabUseCase(this.engine);
        this.navigateToUrl = new NavigateToUrlUseCase(this.engine);
        this.setActiveTab = new SetActiveTabUseCase(this.engine);
    }

    getEngine(): IBrowserEngine {
        return this.engine;
    }

    getMemoryManager(): MemoryManager {
        return this.memoryManager;
    }

    destroy(): void {
        this.memoryManager.destroy();
        this.engine.destroy();
    }
}
