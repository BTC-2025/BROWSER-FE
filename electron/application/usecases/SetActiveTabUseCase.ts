// Application Layer: SetActiveTabUseCase

import { IBrowserEngine } from '../../domain/interfaces/IBrowserEngine';
import { BrowserUIState } from '../../domain/entities/BrowserUIState';

export class SetActiveTabUseCase {
    constructor(private engine: IBrowserEngine) { }

    execute(tabId: string): BrowserUIState {
        this.engine.setActiveTab(tabId);
        return this.engine.getUIState();
    }
}
