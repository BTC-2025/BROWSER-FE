// Domain Interface: IDomInspector (Read-Only)
// Interface Segregation: separate observation from action permissions.
// Used by AI Copilot for page analysis without mutation rights.

export interface IDomInspector {
    /** Get the page title */
    getTitle(tabId: string): Promise<string>;

    /** Get the page URL */
    getUrl(tabId: string): Promise<string>;

    /** Extract the visible text content from the page */
    getPageText(tabId: string): Promise<string>;

    /** Get page metadata (description, keywords, etc.) */
    getPageMetadata(tabId: string): Promise<Record<string, string>>;

    /** Execute a read-only JavaScript snippet and return the result */
    evaluateReadOnly(tabId: string, script: string): Promise<unknown>;

    /** Take a screenshot of the current page */
    captureScreenshot(tabId: string): Promise<Buffer>;
}
