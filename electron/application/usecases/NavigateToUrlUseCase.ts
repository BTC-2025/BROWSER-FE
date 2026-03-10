// Application Layer: NavigateToUrlUseCase

import { IBrowserEngine } from '../../domain/interfaces/IBrowserEngine';

export class NavigateToUrlUseCase {
    constructor(private engine: IBrowserEngine) { }

    async execute(tabId: string, url: string): Promise<void> {
        return this.engine.navigateTo(tabId, url);
    }
}
