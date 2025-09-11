# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick commands
- Install deps: npm ci
- Build (also typechecks): npm run build
- Dev (watch): npm run dev
- Start built server: npm start
- Clean: npm run clean
- Tests: npm test (currently prints "No tests configured")

Environment
- Required: GEMINI_API_KEY
- Optional: GEMINI_BASE_URL (default https://generativelanguage.googleapis.com)
- Optional: GEMINI_MODEL (default gemini-2.5-flash; env-only, not via tool params)

## Project architecture
- TypeScript source in src/, built artifacts in dist/ (tsconfig outDir). ESM with NodeNext resolution.
- Entry: src/index.ts
  - Initializes MCP server and registers a single tool process_video_url that analyzes a public video URL via Google Generative Language API.
  - Tool schema defined inline with zod (video_url, prompt, optional mime_type). Model is read from GEMINI_MODEL env.
  - Sends POST ${GEMINI_BASE_URL}/v1beta/models/${GEMINI_MODEL}:generateContent; api key header x-goog-api-key uses GEMINI_API_KEY.
  - generationConfig.maxOutputTokens defaults to 8192 (override with GEMINI_MAX_OUTPUT_TOKENS).
  - Logs startup/warnings to stderr; exits on fatal errors.
  - Key references:
    - Tool registration and handler: src/index.ts:23-76
    - API key check: src/index.ts:33-35
    - Request headers/body and fetch: src/index.ts:42-61
    - Startup and env warning: src/index.ts:104-111
- OpenAPI specification: openapi.yaml documents the generateContent endpoint, request/response schemas, and API key auth.
- Additional docs: docs/gemini-video-understanding-api.md shows environment setup and example curl usage for the same endpoint.
- Output declarations: dist/index.d.ts is empty by design because the server exports no public API. If public types/exports are added, the declaration will include them; otherwise consider setting declaration:false in tsconfig if not publishing types.

## Typical workflows for Claude Code
- Build and run locally
  - Ensure GEMINI_API_KEY is set in the environment
  - npm run typececk
  - npm run build
  - npm start
- Iterate during development
  - npm run dev (tsc -w) in one terminal
  - Use your MCP client (e.g., Claude Desktop) to launch the server binary specified in package.json bin (dist/index.js)

## Notes for changes
- The server communicates over stdio via @modelcontextprotocol/sdk (StdioServerTransport) and should avoid printing to stdout; logging is to stderr only.
- Strict TypeScript is enabled; prefer editing existing patterns and zod schemas when adding tool parameters.
