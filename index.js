#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetch } from "undici";

/**
 * Gemini Video Understanding MCP Server
 * 
 * This server provides video understanding capabilities for public video URLs
 * (like YouTube) using Google's Gemini models through Google AI Studio.
 */

// Create MCP server instance
const server = new McpServer({
  name: "gemini-video-understanding-mcp",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    logging: {},
    progress: {}
  }
});

// Tool: Process Video URL
server.tool(
  "process_video_url",
  "Analyzes video content from a public URL (e.g., YouTube) using Google's Gemini model",
  {
    video_url: z.string().url().describe("The public URL of the video to analyze (e.g., YouTube link)"),
    prompt: z.string().describe("The instruction for the Gemini model (e.g., 'Summarize this video in 3 sentences')"),
    model: z.string().optional().default("gemini-2.5-flash").describe("The Gemini model to use (default: gemini-2.5-flash)"),
    mime_type: z.string().optional().default("video/mp4").describe("The MIME type of the video (default: video/mp4)")
  },
  async ({ video_url, prompt, model, mime_type }, { progressToken }) => {
    try {
      // Validate environment
      if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
        throw new Error("GOOGLE_AI_STUDIO_API_KEY environment variable is required");
      }

      // Send initial progress
      if (progressToken) {
        await server.notification({
          method: "notifications/progress",
          params: {
            progressToken,
            progress: 0,
            total: 100,
            message: "Starting video analysis..."
          }
        });
      }

      // Construct API endpoint
      const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      // Prepare request body
      const requestBody = {
        contents: [{
          role: "user",
          parts: [
            { text: prompt },
            {
              file_data: {
                file_uri: video_url,
                mime_type: mime_type
              }
            }
          ]
        }]
      };

      // Progress update: sending request
      if (progressToken) {
        await server.notification({
          method: "notifications/progress",
          params: {
            progressToken,
            progress: 25,
            total: 100,
            message: "Sending request to Gemini API..."
          }
        });
      }

      // Make HTTP request with longer timeout
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': process.env.GOOGLE_AI_STUDIO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Progress update: processing response
      if (progressToken) {
        await server.notification({
          method: "notifications/progress",
          params: {
            progressToken,
            progress: 75,
            total: 100,
            message: "Processing Gemini response..."
          }
        });
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google AI API error (${response.status}): ${errorData}`);
      }

      const data = await response.json();
      
      // Extract content from response
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          const content = candidate.content.parts[0].text;
          
          // Final progress update
          if (progressToken) {
            await server.notification({
              method: "notifications/progress",
              params: {
                progressToken,
                progress: 100,
                total: 100,
                message: "Video analysis complete!"
              }
            });
          }
          
          return {
            content: [
              {
                type: "text",
                text: `**Video Analysis Result:**\n\n${content}\n\n**Model Used:** ${model}\n**Video URL:** ${video_url}`
              }
            ]
          };
        }
      }

      throw new Error('No valid response content from Google AI API');

    } catch (error) {
      // Error progress update
      if (progressToken) {
        await server.notification({
          method: "notifications/progress",
          params: {
            progressToken,
            progress: 100,
            total: 100,
            message: `Error: ${error.message}`
          }
        });
      }
      
      return {
        content: [
          {
            type: "text",
            text: `Error processing video URL: ${error.message}`
          }
        ],
        isError: true
      };
    }
  }
);

// Main function to start the server
async function main() {
  try {
    // Create stdio transport
    const transport = new StdioServerTransport();
    
    // Connect server to transport
    await server.connect(transport);
    
    // Log server startup (to stderr so it doesn't interfere with MCP protocol)
    console.error("Gemini Video Understanding MCP Server running on stdio");
    console.error("Tool available: process_video_url");
    
    // Log environment check
    if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
      console.error("WARNING: GOOGLE_AI_STUDIO_API_KEY environment variable not set");
      console.error("Please set your Google AI Studio API key to use this server");
    }
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.error("Shutting down MCP server...");
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error("Shutting down MCP server...");
  await server.close();
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
