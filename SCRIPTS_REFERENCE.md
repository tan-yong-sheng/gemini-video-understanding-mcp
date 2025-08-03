# NPM Scripts Reference

## Available Commands

### 🚀 **Core Commands**

```bash
npm start              # Start the MCP server
npm run dev            # Start with debugging enabled
npm run build          # Build script (no-op for this pure JS project)
npm test               # Run validation tests
npm run validate       # Same as test - validates MCP protocol compliance
```

### 🛠️ **Development Commands**

```bash
npm run clean          # Clean build artifacts (no-op for this project)
npm run lint           # Code linting (not configured for this pure JS project)
npm run prepare        # Preparation script (runs automatically on install)
```

### 🎯 **Why No Real Build Process?**

This MCP server is written in **pure JavaScript (ES modules)** and doesn't require compilation:

- ✅ **No TypeScript**: Direct JavaScript implementation
- ✅ **No Bundling**: Node.js modules work directly
- ✅ **No Transpilation**: Modern ES modules supported natively
- ✅ **No Minification**: Server-side code doesn't need minification

### 🔧 **What the Build Script Does**

The `npm run build` command:
1. Confirms this is a pure JavaScript project
2. Exits successfully (required for CI/CD pipelines)
3. Indicates no build artifacts are generated

### 📦 **Dependency Management**

- **Updated to `undici`**: Replaced `node-fetch` to avoid deprecation warnings
- **No `node-domexception` warning**: Modern dependencies eliminate the warning
- **Optimized dependencies**: Only essential packages included

### 🚨 **Previous Warning Resolved**

**Before**: `npm warn deprecated node-domexception@1.0.0`
**After**: ✅ No deprecation warnings - using modern `undici` instead of `node-fetch`

### 🎉 **Ready for Production**

All scripts work correctly:
- ✅ `npm run build` - completes successfully
- ✅ `npm start` - starts the MCP server
- ✅ `npm test` - validates MCP protocol compliance
- ✅ `npm run validate` - confirms server functionality
