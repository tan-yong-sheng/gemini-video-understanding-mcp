#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetch } from "undici";

type ProgressParams = {
  progressToken?: string | number
}

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

server.tool(
  "process_video_url",
  {
    video_url: z.string().url().describe("The public URL of the video to analyze (e.g., YouTube link)"),
    prompt: z.string().describe("The instruction for the Gemini model (e.g., 'Summarize this video in 3 sentences')"),
    mime_type: z.string().optional().default("video/mp4").describe("The MIME type of the video (default: video/mp4)")
  },
  async ({ video_url, prompt, mime_type }) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }

      const baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com';
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const apiEndpoint = `${baseUrl}/v1beta/models/${model}:generateContent`;

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
      } as const;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY as string,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google AI API error (${response.status}): ${errorData}`);
      }

      const data: any = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          const content = candidate.content.parts[0].text as string;

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

    } catch (error: any) {
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

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Gemini Video Understanding MCP Server running on stdio");
    console.error("Tool available: process_video_url");
    if (!process.env.GEMINI_API_KEY) {
      console.error("WARNING: GEMINI_API_KEY environment variable not set");
      console.error("Please set your Google AI Studio API key to use this server");
    }
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

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

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
