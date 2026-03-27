# Binaries Directory

Place OpenClaw CLI binaries for each platform in this directory.

## File Naming Convention

Use platform-specific subdirectories:

```
binaries/
├── windows/
│   └── openclaw.exe
├── macos/
│   └── openclaw (or openclaw-arm64 for Apple Silicon)
└── linux/
    └── openclaw
```

## Download Instructions

1. OpenClaw binaries should be built or downloaded for each platform
2. Place them in the appropriate subdirectory
3. Ensure the binary is executable (chmod +x on Unix-like systems)
4. Update the path in settings or use automatic detection

## Development

For development, you can either:
- Use a locally installed OpenClaw binary (add it to PATH)
- Set the path in application settings
- The app will fallback to searching in this directory

## Build Process

During the Electron build, these binaries will be bundled with the application.
The IPC handler will look for binaries in:
1. User-specified path from settings
2. This bundled binaries directory
3. System PATH
