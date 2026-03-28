# Contributing to OpenClaw GUI

Thank you for your interest in contributing to OpenClaw GUI!

## Development Setup

1. Clone the repository
2. Navigate to the `gui` directory
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Run Electron: `npm run electron:dev`

## Project Structure

```
gui/
├── electron/           # Electron main process
│   ├── main.ts         # Main entry point
│   ├── preload/        # Preload scripts
│   └── ipc.ts         # IPC handlers
├── src/
│   ├── components/    # React components
│   │   ├── layout/    # Layout components
│   │   ├── ui/        # UI primitives
│   │   ├── dashboard/ # Dashboard view
│   │   ├── settings/  # Settings view
│   │   ├── operations/ # Operations view
│   │   └── history/   # History view
│   ├── services/      # Business logic
│   ├── stores/        # Zustand stores
│   ├── types/         # TypeScript types
│   └── lib/           # Utility functions
└── binaries/          # Platform-specific binaries
```

## Coding Standards

- Use TypeScript with strict mode
- Follow ESLint rules (run `npm run lint`)
- Use Prettier for formatting (run `npm run format`)
- Write tests for new features

## Running Tests

```bash
npm run test        # Run tests
npm run test:ui    # Run tests with UI
npm run test:coverage # Run with coverage
```

## Building

```bash
npm run electron:build  # Build the app
npm run build:app       # Package for distribution
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
