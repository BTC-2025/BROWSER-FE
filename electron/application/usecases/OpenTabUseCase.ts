// Application Layer: OpenTabUseCase
// Single-responsibility use case for opening a new browser tab.

import { IBrowserEngine } from '../../domain/interfaces/IBrowserEngine';
import { TabState } from '../../domain/entities/TabState';

export class OpenTabUseCase {
    constructor(private engine: IBrowserEngine) { }

    async execute(url?: string): Promise<TabState> {
        return this.engine.createTab(url);
    }
}
