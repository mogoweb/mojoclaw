# OpenClaw Desktop GUI

A cross-platform desktop application providing a graphical interface for OpenClaw.

## Features

- Cross-platform support (Windows, macOS, Linux)
- Intuitive GUI for OpenClaw operations
- Real-time command execution with progress tracking
- Operation history and logging
- Settings management
- Built with Electron + React + TypeScript

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
cd gui && npm install

# Development mode
npm run dev              # Start Vite dev server
npm run electron:dev     # Start Electron with hot reload

# Build renderer and Electron
npm run electron:build   # Build for production

# Package application
npm run build:app        # Create installable packages
```

### Scripts

- `npm run dev` - Start Vite dev server
- `npm run electron:dev` - Start Electron with hot reload
- `npm run build` - Build renderer for production
- `npm run lint` / `npm run lint:fix` - Run/fix ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## Project Structure

```
gui/
├── electron/           # Electron main process and IPC
│   ├── main.ts        # Main process entry
│   ├── preload/       # Preload scripts
│   └── ipc.ts         # IPC handlers for CLI execution
├── src/
│   ├── components/    # React components
│   │   ├── layout/   # Layout (sidebar, main)
│   │   ├── dashboard/
│   │   ├── settings/ # Settings and About views
│   │   ├── operations/ # Operation dialogs
│   │   └── ui/       # shadcn/ui components
│   ├── services/      # Services (CLI service)
│   └── types/         # TypeScript types
└── binaries/          # Bundled OpenClaw binaries
```

## Technology Stack

- **Framework:** Electron 34.x
- **Frontend:** React 19.x with TypeScript
- **Build:** Vite 8.x + electron-builder
- **UI:** Tailwind CSS + shadcn/ui (Radix UI)
- **State:** Zustand

## OpenClaw Integration

The GUI uses OpenClaw binaries bundled in the `binaries/` directory. Configure the path in Settings or let the app auto-detect from system PATH.

## License

MIT
