// Browser Tooling Adapter
// Provides safe, atomic browser actions that the agent can use.
// Each tool is categorized and has an approval requirement flag.

import { AgentTool, ToolResult, ToolParameter } from '../domain/interfaces/IAgentRuntime';

function param(name: string, type: 'string' | 'number' | 'boolean', description: string, required = true): ToolParameter {
    return { name, type, description, required };
}

function success(data?: unknown): ToolResult {
    return { success: true, data };
}

function fail(error: string): ToolResult {
    return { success: false, error };
}

// ─── Navigation Tools ─────────────────────────────────────────

const navigateToUrl: AgentTool = {
    name: 'navigate_to_url',
    description: 'Navigate the browser to a specific URL',
    category: 'navigation',
    requiresApproval: false,
    parameters: [param('url', 'string', 'The URL to navigate to')],
    execute: async (params) => {
        const url = params.url as string;
        if (!url) return fail('URL is required');
        // In production: window.browserAPI.navigateToUrl(activeTabId, url)
        return success({ navigatedTo: url });
    },
};

const goBack: AgentTool = {
    name: 'go_back',
    description: 'Navigate back in browser history',
    category: 'navigation',
    requiresApproval: false,
    parameters: [],
    execute: async () => {
        return success({ action: 'navigated_back' });
    },
};

const goForward: AgentTool = {
    name: 'go_forward',
    description: 'Navigate forward in browser history',
    category: 'navigation',
    requiresApproval: false,
    parameters: [],
    execute: async () => {
        return success({ action: 'navigated_forward' });
    },
};

const reloadPage: AgentTool = {
    name: 'reload_page',
    description: 'Reload the current page',
    category: 'navigation',
    requiresApproval: false,
    parameters: [],
    execute: async () => {
        return success({ action: 'page_reloaded' });
    },
};

const openNewTab: AgentTool = {
    name: 'open_new_tab',
    description: 'Open a new browser tab, optionally with a URL',
    category: 'navigation',
    requiresApproval: false,
    parameters: [param('url', 'string', 'Optional URL to open', false)],
    execute: async (params) => {
        const url = (params.url as string) || 'dive://newtab';
        return success({ tabOpened: url });
    },
};

// ─── Extraction Tools ─────────────────────────────────────────

const getPageContent: AgentTool = {
    name: 'get_page_content',
    description: 'Extract the text content of the current page',
    category: 'extraction',
    requiresApproval: false,
    parameters: [],
    execute: async () => {
        // In production: use webContents.executeJavaScript to get document.body.innerText
        return success({ content: 'Page content would be extracted here in production mode.' });
    },
};

const getPageTitle: AgentTool = {
    name: 'get_page_title',
    description: 'Get the title of the current page',
    category: 'extraction',
    requiresApproval: false,
    parameters: [],
    execute: async () => {
        // In production: use webContents.executeJavaScript('document.title')
        return success({ title: 'Dive Browser' });
    },
};

const getPageUrl: AgentTool = {
    name: 'get_page_url',
    description: 'Get the URL of the current page',
    category: 'extraction',
    requiresApproval: false,
    parameters: [],
    execute: async () => {
        // In production: use webContents.getURL()
        return success({ url: 'dive://newtab' });
    },
};

const querySelectorAll: AgentTool = {
    name: 'query_selector_all',
    description: 'Find elements matching a CSS selector and return their text content',
    category: 'extraction',
    requiresApproval: false,
    parameters: [param('selector', 'string', 'CSS selector to query')],
    execute: async (params) => {
        const selector = params.selector as string;
        if (!selector) return fail('Selector is required');
        // In production: use webContents.executeJavaScript
        return success({
            elements: [],
            message: `Would query "${selector}" on the page in production mode`,
        });
    },
};

const takeScreenshot: AgentTool = {
    name: 'take_screenshot',
    description: 'Capture a screenshot of the current page',
    category: 'extraction',
    requiresApproval: false,
    parameters: [],
    execute: async () => {
        // In production: use webContents.capturePage()
        return success({ screenshot: 'base64_screenshot_data_here' });
    },
};

// ─── Interaction Tools ─────────────────────────────────────────

const clickElement: AgentTool = {
    name: 'click_element',
    description: 'Click on an element identified by CSS selector',
    category: 'interaction',
    requiresApproval: true,
    parameters: [param('selector', 'string', 'CSS selector of element to click')],
    execute: async (params) => {
        const selector = params.selector as string;
        if (!selector) return fail('Selector is required');
        return success({ clicked: selector });
    },
};

const typeText: AgentTool = {
    name: 'type_text',
    description: 'Type text into an input field identified by CSS selector',
    category: 'interaction',
    requiresApproval: true,
    parameters: [
        param('selector', 'string', 'CSS selector of the input field'),
        param('text', 'string', 'Text to type'),
    ],
    execute: async (params) => {
        const selector = params.selector as string;
        const text = params.text as string;
        if (!selector || !text) return fail('Selector and text are required');
        return success({ typed: text, into: selector });
    },
};

const scrollPage: AgentTool = {
    name: 'scroll_page',
    description: 'Scroll the page up or down by a specified amount',
    category: 'interaction',
    requiresApproval: false,
    parameters: [
        param('direction', 'string', 'Scroll direction: "up" or "down"'),
        param('amount', 'number', 'Pixels to scroll', false),
    ],
    execute: async (params) => {
        const direction = params.direction as string;
        const amount = (params.amount as number) || 500;
        return success({ scrolled: direction, pixels: amount });
    },
};

// ─── Mutation Tools (require approval) ─────────────────────────

const fillForm: AgentTool = {
    name: 'fill_form',
    description: 'Fill out a form with provided field values',
    category: 'mutation',
    requiresApproval: true,
    parameters: [
        param('formSelector', 'string', 'CSS selector of the form'),
        param('fields', 'string', 'JSON string of field name-value pairs'),
    ],
    execute: async (params) => {
        const formSelector = params.formSelector as string;
        if (!formSelector) return fail('Form selector is required');
        return success({ formFilled: formSelector });
    },
};

const submitForm: AgentTool = {
    name: 'submit_form',
    description: 'Submit a form by clicking its submit button',
    category: 'mutation',
    requiresApproval: true,
    parameters: [param('formSelector', 'string', 'CSS selector of the form to submit')],
    execute: async (params) => {
        const formSelector = params.formSelector as string;
        if (!formSelector) return fail('Form selector is required');
        return success({ formSubmitted: formSelector });
    },
};

// ─── Tool Registry ─────────────────────────────────────────────

export const BROWSER_TOOLS: AgentTool[] = [
    // Navigation
    navigateToUrl,
    goBack,
    goForward,
    reloadPage,
    openNewTab,
    // Extraction
    getPageContent,
    getPageTitle,
    getPageUrl,
    querySelectorAll,
    takeScreenshot,
    // Interaction
    clickElement,
    typeText,
    scrollPage,
    // Mutation
    fillForm,
    submitForm,
];

export function getToolByName(name: string): AgentTool | undefined {
    return BROWSER_TOOLS.find((t) => t.name === name);
}
