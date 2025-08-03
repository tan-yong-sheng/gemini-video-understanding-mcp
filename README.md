# Gemini Video Understanding MCP Server

A Model Context Protocol (MCP) server that provides video understanding capabilities using Google's Gemini models. This server supports video URL analysis for public video URLs (like YouTube).

## Features

- **Video URL Analysis**: Analyze videos from public URLs (YouTube, etc.) directly
- **Google AI Studio Integration**: Uses the Generative Language API for video understanding
- **MCP Protocol Compliance**: Full compatibility with MCP clients like Claude Desktop
- **Error Handling**: Comprehensive error handling and validation
- **npx Support**: Can be run directly with npx

## Installation

### Using npx (Recommended)

You can run the server directly without installation:

```bash
npx gemini-video-understanding-mcp
```

### Local Installation

```bash
git clone https://github.com/your-username/gemini-video-understanding-mcp.git
cd gemini-video-understanding-mcp
npm install
```

## Setup

### 1. Get Google AI Studio API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the API key for the next step

### 2. Set Environment Variables

Create a `.env` file or set the environment variable:

```bash
export GOOGLE_AI_STUDIO_API_KEY="your_api_key_here"
```

For Windows:
```cmd
set GOOGLE_AI_STUDIO_API_KEY=your_api_key_here
```

## Usage

### With Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gemini-video-understanding": {
      "command": "npx",
      "args": ["gemini-video-understanding-mcp"],
      "env": {
        "GOOGLE_AI_STUDIO_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Direct Usage

```bash
# Set your API key
export GOOGLE_AI_STUDIO_API_KEY="your_api_key_here"

# Run the server
npm start
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

## Supported Video Formats

The server supports various video formats for URL analysis including:
- MP4 (.mp4)
- MOV (.mov)
- AVI (.avi)
- MKV (.mkv)
- WebM (.webm)
- And other formats supported by Google AI Studio

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_AI_STUDIO_API_KEY` | Your Google AI Studio API key | Yes |

## Error Handling

The server provides detailed error messages for common issues:
- Missing API key
- Invalid video URLs
- File not found errors
- API rate limits
- Network connectivity issues
- Unsupported file formats

## Examples

### YouTube Video Analysis

```bash
# In Claude Desktop or another MCP client:
# Use the process_video_url tool with:
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "prompt": "What is the main theme of this video?"
}
```

## Development

### Running in Development Mode

```bash
npm run dev
```

### Testing

```bash
# Test with a sample request
echo '{"method": "tools/list"}' | npm start
```

## API Reference

This server implements the Model Context Protocol (MCP) specification. For more information about MCP, visit [https://modelcontextprotocol.io](https://modelcontextprotocol.io).

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
