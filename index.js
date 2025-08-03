#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { GoogleAIClient } from "./lib/google-ai-client.js";

/**
 * Gemini Video Understanding MCP Server
 * 
 * This server provides video understanding capabilities for public video URLs
 * (like YouTube) using Google's Gemini models through Google AI Studio.
 */

// Initialize the Google AI client
const googleAI = new GoogleAIClient();

// Create MCP server instance
const server = new McpServer({
  name: "gemini-video-understanding-mcp",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    logging: {}
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
  async ({ video_url, prompt, model, mime_type }) => {
    try {
      // Validate environment
      if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
        throw new Error("GOOGLE_AI_STUDIO_API_KEY environment variable is required");
      }

      // Process the video URL
      const result = await googleAI.processVideoUrl({
        videoUrl: video_url,
        prompt: prompt,
        model: model,
        mimeType: mime_type
      });

      return {
        content: [
          {
            type: "text",
            text: `**Video Analysis Result:**\n\n${result.content}\n\n**Model Used:** ${model}\n**Video URL:** ${video_url}`
          }
        ]
      };
    } catch (error) {
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
