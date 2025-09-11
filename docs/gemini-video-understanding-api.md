## Gemini Video Understanding Function Documentation

This document describes the core function for interacting with Gemini models for video understanding using Google AI Studio (Generative Language API): `process_video_url` for public web URLs like YouTube.

### Core Concepts and Environment Setup

Before using this function, you need to set up your environment for Google AI Studio.

**Google AI Studio Features:**
*   **Authentication:** Uses API Keys (`x-goog-api-key` header).
*   **URL Processing:** Direct processing of video URLs without file uploads.

---

#### Environment Variable Configuration

Set up your environment variables for Google AI Studio:

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY" # Get this from aistudio.google.com/app/apikey
# Optional: Configure base URL and model via environment
export GEMINI_BASE_URL="${GEMINI_BASE_URL:-https://generativelanguage.googleapis.com}"
export GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.5-flash}"
# API URL and Auth Header setup
API_ENDPOINT_URL="${GEMINI_BASE_URL}/v1beta/models/${GEMINI_MODEL}:generateContent"
AUTH_HEADER="-H \"x-goog-api-key: ${GEMINI_API_KEY}\""
echo "Configured for Google AI Studio."
```

---

### Function: `process_video_url`

**Purpose:** To analyze and generate content from a publicly accessible video URL (e.g., YouTube video) using a Gemini model.

**Description:** This function constructs a `curl` command that directly sends the video URL to the specified Gemini model.

**Usage:**
Ensure you have run the environment variable setup block above.

```bash
# --- process_video_url Function Call ---
echo "--- Performing YouTube Video Understanding ---"
REQUEST_BODY='{
  "contents": [{
    "role": "user",
    "parts":[
        {"text": "Please summarize the YouTube video in 3 sentences."},
        {
          "file_data": {
            "file_uri": "https://www.youtube.com/watch?v=9hE5-98ZeCg", # <--- IMPORTANT: Update with your video URL
            "mime_type": "video/mp4" # Recommended to specify for clarity
          }
        }
    ]
  }]
}'
# Execute the curl command using the dynamically set variables
eval curl -X POST \
    ${AUTH_HEADER} \
    -H 'Content-Type: application/json' \
    \"${API_ENDPOINT_URL}\" \
    -d \"${REQUEST_BODY}\"
```

**Parameters:**

*   `file_uri`: (String) The public URL of the video (e.g., a YouTube link).
*   `mime_type`: (String) The MIME type of the video (e.g., `video/mp4`, `video/quicktime`). While often optional for YouTube, it's good practice.
*   `text_prompt`: (String) The text instruction for the Gemini model (e.g., "Please summarize the YouTube video in 3 sentences.").

**Explanation of `curl` components:**

*   `API_ENDPOINT_URL`: The Google AI Studio API endpoint for the specified Gemini model.
*   `AUTH_HEADER`: The Google AI Studio authentication header using your API key.
*   `-H 'Content-Type: application/json'`: Specifies the content type of the request body.
*   `-X POST`: Indicates a POST request.
*   `-d "${REQUEST_BODY}"`: Passes the JSON request body containing the `text_prompt` and the video `file_data`.
*   `eval`: Essential for correctly expanding the `AUTH_HEADER` variable, which contains quotes, before `curl` is executed.