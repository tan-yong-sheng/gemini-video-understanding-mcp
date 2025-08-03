# Gemini Video Understanding MCP Server

A Model Context Protocol (MCP) server that provides video understanding capabilities using Google's Gemini models. This server supports video URL analysis for public video URLs (like YouTube).

## Features

- **Video URL Analysis**: Analyze videos from public URLs (YouTube, etc.) directly

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_AI_STUDIO_API_KEY` | Your Google AI Studio API key | Yes |

## Installation

### 1. Using with Claude Desktop 

Add the server config to your Claude Desktop configuration file:

Add the following configuration to the `mcpServers` object in your Claude configuration file:

#### For Local Installation (on Windows)

```json
"gemini-video-understanding-mcp": {
  "command": "cmd",
  "args": [
    "/k",
    "npx",
    "-y",
    "gemini-video-understanding-mcp"
  ],
  "env": {
    "GOOGLE_AI_STUDIO_API_KEY": "<YOUR_GOOGLE_AI_STUDIO_API_KEY>"
  }
}
```

#### For Local installation (on Linux/MacOS)

```json
"gemini-video-understanding-mcp": {
  "command": "npx",
  "args": [
    "-y",
    "gemini-video-understanding-mcp"
  ],
  "env": {
    "GOOGLE_AI_STUDIO_API_KEY": "<YOUR_GOOGLE_AI_STUDIO_API_KEY>"
  }
}
```

#### For Development (on Windows / Linux / MacOS)

```bash
cd /path/to/gemini-video-understanding-mcp
npm run build
```

```json
"gemini-video-understanding-mcp": {
  "command": "node",
  "args": [
    "/path/to/gemini-video-understanding-mcp/index.js"
  ],
  "env": {
    "MISTRAL_API_KEY": "GOOGLE_AI_STUDIO_API_KEY"
  }
}
```

Location of the configuration file:
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`
- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 2. Alternative Installation Methods

You can also run this server directly using `npx`:

```bash
npx gemini-video-understanding-mcp
```

Or set your API key as an environment variable:

```bash
export GOOGLE_AI_STUDIO_API_KEY="YOUR_GOOGLE_AI_STUDIO_API_KEY"
npx gemini-video-understanding-mcp
```

## Available Tools

### `process_video_url`

Analyzes video content from a public URL using Google's Gemini model.

**Parameters:**
- `video_url` (string, required): The public URL of the video (e.g., YouTube link)
- `prompt` (string, required): The instruction for the Gemini model
- `model` (string, optional): The Gemini model to use (default: "gemini-2.5-flash")
- `mime_type` (string, optional): The MIME type of the video (default: "video/mp4")

**Example:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=9hE5-98ZeCg",
  "prompt": "Please summarize this video in 3 sentences.",
  "model": "gemini-2.5-flash"
}
```

## Error Handling

The server provides detailed error messages for common issues:
- Missing API key
- Invalid video URLs
- File not found errors
- API rate limits
- Network connectivity issues
- Unsupported file formats


## Troubleshooting

### Common Issues

1. **"GOOGLE_AI_STUDIO_API_KEY environment variable is required"**
   - Make sure you've set the API key environment variable
   - Verify the API key is valid

2. **"File not found" errors**
   - Ensure the file path is absolute
   - Check file permissions
   - Verify the file exists

3. **"File does not appear to be a video" errors**
   - Check the file format is supported
   - Verify the file isn't corrupted

4. **API quota exceeded**
   - Check your Google AI Studio usage limits
   - Wait for quota reset or upgrade your plan

### Getting Help

- Check the [Google AI Studio documentation](https://ai.google.dev/docs)
- Review the [MCP specification](https://modelcontextprotocol.io)
- Open an issue on the GitHub repository

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
