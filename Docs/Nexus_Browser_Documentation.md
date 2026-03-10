# Nexus Browser Documentation

## 1. Project Overview

Nexus Browser is an AI-native web browser built with a robust Hexagonal Architecture. It embeds a real Chromium engine (via Electron) to serve as a fast and modern browser, while integrating a rich UI built with Next.js, React, and Tailwind CSS.

### Key Technologies
- **Electron**: Handles the main process, chromium web views, native window controls, and OS-level operations.
- **Next.js & React**: Powers the browser UI (chrome, tabs, address bar, settings).
- **TypeScript**: Ensures type safety across the entire application spanning both UI and backend.
- **Zustand**: Manages global UI state (tabs, active panels, history, AI interactions).
- **Tailwind CSS**: Simplifies styling for modern user interfaces.
- **Google GenAI SDK**: Integrates intelligent agent behaviors to interact with pages.

---

## 2. Architecture: Hexagonal Design

The application is structured using Hexagonal Architecture (Ports and Adapters) to decouple core business logic from infrastructure and external dependencies (like React or Electron specific APIs).

### Directory Structure

```text
/
├── electron/               # Main Process (Backend)
│   ├── main.ts             # Entry point
│   ├── preload.ts          # IPC Security Bridge
│   ├── domain/             # Core Entities and Interfaces (Ports)
│   ├── application/        # Use Cases (Business Logic)
│   ├── infrastructure/     # Implementations (Adapters)
│   ├── di/                 # Dependency Injection Container
│   └── ipc/                # Inter-Process Communication Handlers
├── src/                    # Renderer Process (Frontend UI)
│   ├── app/                # Next.js App Router
│   ├── components/         # React UI Components (Header, Settings, Tabs, etc.)
│   ├── stores/             # Zustand State Management
│   └── types/              # Frontend TypeScript Interfaces
└── package.json            # Project Metadata and Scripts
```

### 2.1 Domain Layer (Core Entities & Interfaces)
Located at `electron/domain/`, this layer defines what the browser *is* and *does* agnostically of the framework.
- **Entities**: Data structures like `TabState`, `HistoryEntry`, `UserSettings`, etc.
- **Interfaces (Ports)**: Contracts like `IBrowserEngine`, `IAIGateway`, `IMemoryManager`.

### 2.2 Application Layer (Use Cases)
Located at `electron/application/usecases/`. Contains the specific actions the user or system takes.
- E.g., `OpenTabUseCase.ts`, `CloseTabUseCase.ts`, `NavigateUseCase.ts`, `AskAgentUseCase.ts`.
- These classes depend *only* on the Domain interfaces, never on Electron or Next.js directly.

### 2.3 Infrastructure Layer (Adapters)
Located at `electron/infrastructure/`. Implements the Domain interfaces using concrete technologies.
- **`ElectronBrowserEngine.ts`**: Communicates directly with Electron's `WebContentsView` to manage real browser tabs.
- **`MockAIGateway.ts` / `GoogleAIGateway.ts`**: Implements AI APIs for summarization and agent tasks.
- **`VectorStore.ts`**: Manages embeddings and storage for semantic search.

### 2.4 Dependencies and IPC
- **Composition Root (`electron/di/`)**: Initializes concrete Infrastructure adapters and provides them to the Application Use Cases.
- **IPC Handlers (`electron/ipc/`)**: Maps frontend events (from `preload.ts`) to backend Use Cases.
- **Preload (`electron/preload.ts`)**: Securely exposes isolated `ipcRenderer.invoke` callbacks to the Next.js `window.browserAPI` object.

---

## 3. Setup and Usage Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- Optional: A Google API Key (`GEMINI_API_KEY`) to enable AI gateway functionalities.

### 3.1 Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository_url>
   cd Browser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   GEMINI_API_KEY=your_google_api_key
   # If required, add other environment variables like:
   NEXT_PUBLIC_APP_ENV=development
   ```

### 3.2 Running the Application

To run the application in a development environment, open two separate terminal instances (or use the built-in concurrently script).

**Option A: Simplified `dev` script**
```bash
npm run dev
```
*(This uses `concurrently` to run both the Next.js server and the Electron wrapper simultaneously.)*

**Option B: Manual start**
1. Start the Next.js frontend server:
   ```bash
   npm run dev:next
   ```
2. Start the Electron application wrapper (waits for port 3000):
   ```bash
   npm run dev:electron
   ```

### 3.3 Building for Production

To create a packaged executable for your operating system:

1. Build both web assets and the Electron backend:
   ```bash
   npm run build
   ```
   *Next.js builds to the `out/` directory, and Electron scripts are transpiled to `dist-electron/`.*

2. Package the app (uses `electron-builder` internally based on `package.json` configurations):
   *(Note: Add standard electron-builder commands in `package.json` scripts if not already present, e.g. `"pack": "electron-builder --dir"`, or `"dist": "electron-builder"`)*

---

## 4. Key Component Deep Dive

### ElectronBrowserEngine (Infrastructure)
Handles real tabs ( Chromium WebViews). When a user clicks a tab in the React UI, the frontend calls `browserAPI.setActiveTab(id)`. The IPC handler forwards this to the Application Layer, which calls the `IBrowserEngine.setActiveTab` interface, finally executing the Electron `WebContentsView.setBounds()` trick in `ElectronBrowserEngine`.

### Preload Context Bridge
```typescript
contextBridge.exposeInMainWorld('browserAPI', {
    openTab: (url?: string) => ipcRenderer.invoke('core:openTab', url),
    navigateToUrl: (tabId: string, url: string) => ipcRenderer.invoke('core:navigateToUrl', tabId, url),
    // ... window controls and AI intents
})
```
This is the only way the untrusted UI accesses the powerful main process. It defines a strongly-typed `browserAPI` globally in the browser's Javascript runtime.

### UI Zustand Stores (`src/stores/`)
- `browserStore.ts`: Manages `tabs` list, `activeTabId`, routing states, loading indicators. Listens to IPC events emitted from the main process when a web page finishes loading to synchronize UI state.
- `agentRuntimeStore.ts`: Tracks active AI missions, generated observations, and logs. Inherits real-time state broadcasts from the main process AI engine.
