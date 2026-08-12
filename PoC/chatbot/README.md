# Gemini AI Chatbot Wrapper

A minimal web interface wrapper for Google's Gemini AI API. Send prompts to Gemini models and receive generated responses.

**Features:**
- Configurable model selection (default: `gemini-2.5-flash-lite`)
- Live streaming responses (SSE / token-by-token)
- Proper markdown rendering (sanitized) for code, lists, tables, etc.
- Simple card-based chat UI
- API key managed via `.env`

**Technologies:** Node.js / Express, `@google/generative-ai` SDK, dotenv, vanilla JavaScript, marked + DOMPurify
