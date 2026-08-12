# Gemini AI Chatbot Wrapper

A minimal web interface wrapper for Google's Gemini AI API. Send prompts to Gemini models and receive generated responses.

**Features:**
- Configurable model selection (default: `gemini-2.5-flash-lite`)
- Live streaming responses (SSE / token-by-token)
- Proper markdown rendering (sanitized) for code, lists, tables, etc.
- Simple card-based chat UI
- API key managed via `.env`

**Technologies:** Node.js / Express, `@google/generative-ai` SDK, dotenv, vanilla JavaScript, marked + DOMPurify

## Running it locally

The chat needs the Gemini backend (Express + `.env`), so it **can't run on GitHub Pages** — the API request would return a 405 there. The page shows a toast with these steps whenever it detects a `github.io` host.

1. Open the `gemini-wrapper` folder
2. Install dependencies: `npm install`
3. Create a `.env` file with your key:

   ```
   GEMINI_API_KEY=your_key_here
   ```

4. Start the server: `npm start`
5. Open <http://localhost:3000>
