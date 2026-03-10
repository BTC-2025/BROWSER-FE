// Domain Interface: IDomMutator (Actions)
// Interface Segregation: separate action permissions from observation.
// Used by Agent Runtime for browser automation with user approval.

export interface IDomMutator {
    /** Click on an element identified by a CSS selector */
    click(tabId: string, selector: string): Promise<void>;

    /** Fill a form field with text */
    fillForm(tabId: string, selector: string, value: string): Promise<void>;

    /** Select an option in a dropdown */
    selectOption(tabId: string, selector: string, value: string): Promise<void>;

    /** Scroll the page by a specified amount */
    scroll(tabId: string, deltaX: number, deltaY: number): Promise<void>;

    /** Type text with keyboard simulation */
    typeText(tabId: string, text: string): Promise<void>;

    /** Press a specific key */
    pressKey(tabId: string, key: string): Promise<void>;

    /** Execute a JavaScript snippet that may mutate the DOM */
    evaluateMutating(tabId: string, script: string): Promise<unknown>;
}
