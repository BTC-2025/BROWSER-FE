// Application Layer: CloseTabUseCase

import { IBrowserEngine } from '../../domain/interfaces/IBrowserEngine';

export class CloseTabUseCase {
    constructor(private engine: IBrowserEngine) { }

    async execute(tabId: string): Promise<void> {
        return this.engine.closeTab(tabId);
    }
}
