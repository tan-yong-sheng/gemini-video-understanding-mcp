#!/usr/bin/env node

/**
 * Test script to validate the MCP server implementation
 * This script checks if the server can start and respond to basic MCP requests
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test the MCP server
async function testMCPServer() {
  console.log('🧪 Testing Gemini Video Understanding MCP Server...\n');

  try {
    // Start the MCP server process
    const serverProcess = spawn('node', [join(__dirname, 'index.js')], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        GOOGLE_AI_STUDIO_API_KEY: 'test_key_for_validation' // Test key for validation
      }
    });

    let serverOutput = '';
    let serverError = '';

    serverProcess.stdout.on('data', (data) => {
      serverOutput += data.toString();
    });

    serverProcess.stderr.on('data', (data) => {
      serverError += data.toString();
    });

    // Send initialization request
    const initRequest = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "test-client",
          version: "1.0.0"
        }
      }
    });

    console.log('📤 Sending initialization request...');
    serverProcess.stdin.write(initRequest + '\n');

    // Send tools list request
    const toolsRequest = JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    });

    setTimeout(() => {
      console.log('📤 Sending tools list request...');
      serverProcess.stdin.write(toolsRequest + '\n');
    }, 100);

    // Wait for responses
    setTimeout(() => {
      serverProcess.kill();
      
      console.log('\n📋 Server Output:');
      if (serverOutput) {
        console.log(serverOutput);
        
        // Check if responses contain expected MCP structure
        if (serverOutput.includes('"jsonrpc":"2.0"') || serverOutput.includes('"jsonrpc": "2.0"')) {
          console.log('✅ Server responds with valid JSON-RPC format');
        }
        
        if (serverOutput.includes('process_video_url')) {
          console.log('✅ Server exposes expected tool');
        }
      }
      
      console.log('\n📋 Server Errors:');
      if (serverError) {
        console.log(serverError);
        
        if (serverError.includes('MCP Server running')) {
          console.log('✅ Server started successfully');
        }
        
        if (serverError.includes('process_video_url')) {
          console.log('✅ Tool is available');
        }
      }
      
      console.log('\n🎉 MCP Server validation completed!');
      console.log('\n📖 Next steps:');
      console.log('1. Set your GOOGLE_AI_STUDIO_API_KEY environment variable');
      console.log('2. Test with: npx gemini-video-understanding-mcp');
      console.log('3. Configure in Claude Desktop with the provided configuration');
    }, 1000);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testMCPServer();
