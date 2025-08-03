import { fetch } from 'undici';

/**
 * Google AI Studio API Client for Video Understanding
 * 
 * This client handles video URL processing using Google AI Studio API.
 */
export class GoogleAIClient {
  constructor() {
    this.apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com';
  }

  /**
   * Process a video from a public URL
   * @param {Object} options - Processing options
   * @param {string} options.videoUrl - The public video URL
   * @param {string} options.prompt - The instruction for Gemini
   * @param {string} options.model - The Gemini model to use
   * @param {string} options.mimeType - The MIME type of the video
   * @returns {Promise<Object>} Processing result
   */
  async processVideoUrl({ videoUrl, prompt, model = 'gemini-2.5-flash', mimeType = 'video/mp4' }) {
    if (!this.apiKey) {
      throw new Error('Google AI Studio API key is required');
    }

    const apiEndpoint = `${this.baseUrl}/v1beta/models/${model}:generateContent`;

    const requestBody = {
      contents: [{
        role: "user",
        parts: [
          { text: prompt },
          {
            file_data: {
              file_uri: videoUrl,
              mime_type: mimeType
            }
          }
        ]
      }]
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'x-goog-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google AI API error (${response.status}): ${errorData}`);
      }

      const data = await response.json();
      
      // Extract content from response
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return {
            content: candidate.content.parts[0].text,
            usage: data.usageMetadata,
            finishReason: candidate.finishReason
          };
        }
      }

      throw new Error('No valid response content from Google AI API');
    } catch (error) {
      if (error.message.includes('Google AI API error')) {
        throw error;
      }
      throw new Error(`Failed to process video URL: ${error.message}`);
    }
  }
}
