// Infrastructure: MemoryManager
// The 8GB RAM Defense — monitors memory usage and suspends inactive tabs
// to prevent Electron + React + LLM from consuming all unified memory.

import { IBrowserEngine } from '../domain/interfaces/IBrowserEngine';

export interface MemoryManagerConfig {
    /** How often to check memory usage (ms). Default: 30s */
    checkIntervalMs: number;
    /** Time after which an inactive tab gets suspended (ms). Default: 5min */
    tabInactivityThresholdMs: number;
    /** Memory usage percentage that triggers aggressive suspension. Default: 75% */
    memoryPressureThreshold: number;
    /** Minimum number of tabs to keep alive (never suspend all). Default: 1 */
    minAliveTabs: number;
}

const DEFAULT_CONFIG: MemoryManagerConfig = {
    checkIntervalMs: 30_000,
    tabInactivityThresholdMs: 5 * 60_000,
    memoryPressureThreshold: 0.75,
    minAliveTabs: 1,
};

export class MemoryManager {
    private engine: IBrowserEngine | null = null;
    private config: MemoryManagerConfig;
    private checkInterval: NodeJS.Timeout | null = null;
    private tabLastActiveTime: Map<string, number> = new Map();

    constructor(config?: Partial<MemoryManagerConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /** Attach to the browser engine and start monitoring */
    start(engine: IBrowserEngine): void {
        this.engine = engine;

        // Track tab activity
        engine.onStateChange((state) => {
            if (state.activeTabId) {
                this.tabLastActiveTime.set(state.activeTabId, Date.now());
            }
        });

        // Start periodic check
        this.checkInterval = setInterval(() => {
            this.performMemoryCheck();
        }, this.config.checkIntervalMs);
    }

    /** Record that a tab was just activated */
    touch(tabId: string): void {
        this.tabLastActiveTime.set(tabId, Date.now());
    }

    /** Remove tracking for a closed tab */
    forget(tabId: string): void {
        this.tabLastActiveTime.delete(tabId);
    }

    private async performMemoryCheck(): Promise<void> {
        if (!this.engine) return;

        const memUsage = process.memoryUsage();
        const heapUsedRatio = memUsage.heapUsed / memUsage.heapTotal;
        const now = Date.now();

        const tabs = this.engine.getAllTabs();
        const activeTabId = this.engine.getActiveTabId();

        // Sort tabs by last active time (oldest first) for suspension priority
        const suspendCandidates = tabs
            .filter((tab) => {
                // Never suspend the active tab
                if (tab.id === activeTabId) return false;
                // Never suspend already-suspended tabs
                if (this.engine!.isTabSuspended(tab.id)) return false;
                // Check inactivity threshold
                const lastActive = this.tabLastActiveTime.get(tab.id) || tab.createdAt;
                const inactiveMs = now - lastActive;

                // Under memory pressure: suspend anything inactive > 1 minute
                if (heapUsedRatio > this.config.memoryPressureThreshold) {
                    return inactiveMs > 60_000;
                }

                // Normal: suspend after configured threshold
                return inactiveMs > this.config.tabInactivityThresholdMs;
            })
            .sort((a, b) => {
                const aTime = this.tabLastActiveTime.get(a.id) || a.createdAt;
                const bTime = this.tabLastActiveTime.get(b.id) || b.createdAt;
                return aTime - bTime; // Oldest first
            });

        // Count alive (non-suspended) tabs
        const aliveTabs = tabs.filter((t) => !this.engine!.isTabSuspended(t.id));
        const maxToSuspend = Math.max(0, aliveTabs.length - this.config.minAliveTabs);

        for (let i = 0; i < Math.min(suspendCandidates.length, maxToSuspend); i++) {
            try {
                await this.engine.unloadTab(suspendCandidates[i].id);
                console.log(`[MemoryManager] Suspended tab: ${suspendCandidates[i].title}`);
            } catch (err) {
                console.error(`[MemoryManager] Failed to suspend tab ${suspendCandidates[i].id}:`, err);
            }
        }

        // Force garbage collection if available (Electron can be launched with --expose-gc)
        if (typeof global.gc === 'function') {
            global.gc();
        }
    }

    /** Stop monitoring and cleanup */
    destroy(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        this.engine = null;
        this.tabLastActiveTime.clear();
    }
}
