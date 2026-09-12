# World's first AI portfolio 🤖✨

**Static portfolios are dead.**

Instead of making you scroll endlessly, my portfolio adapts to *you*.
Ask a question — my AI avatar replies instantly.

## 👇 What can you ask?

- 🧠 **Tech recruiter?** Ask about my stack & results
- 💻 **Dev?** Dive into my code & mindset
- 🧑‍🤝‍🧑 **Friend or family?** See what I’ve been working on

---

This is not a portfolio.
It’s a **conversation tailored to your curiosity**.

## 🚀 How to run

Want to run this project locally? Here's what you need:

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** package manager
- An **API key for one AI provider** (for AI chat functionality): Google Generative AI, OpenAI, or OpenRouter

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/baotran152/portfolio.git
   cd portfolio
   ```
2. **Install dependencies**

   ```bash
   pnpm install
   ```
3. **Environment variables**
   Copy the example file and edit it:

   ```bash
   cp .env.example .env
   ```

   Pick a provider with `AI_PROVIDER` (`google`, `openai` or `openrouter`) and set
   only that provider's key. Leaving `AI_PROVIDER` empty auto-detects the first
   provider that has a key, checked in the order google, openai, openrouter.

   ```env
   AI_PROVIDER=google
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
   ```

   `AI_MODEL` optionally overrides the model. The defaults are `gemini-2.5-flash`
   for google, `gpt-4o-mini` for openai and `openrouter/free` for openrouter.

   `OPEN_TO_WORK` controls the availability banner on the homepage: `true` shows
   "I am OPEN for new opportunity", `false` shows "Currently NOT open". It is read
   on the server per request, so it never reaches the browser and changing it needs
   no code change.
4. **Run the development server**

   ```bash
   pnpm dev
   ```
5. **Open your browser**
   Navigate to `http://localhost:3000`

6. **Build the production**

   ```bash
   pnpm build
   pnpm start
   ```
### Getting your **tokens**

- **GOOGLE_GENERATIVE_AI_API_KEY**: Generate one at https://aistudio.google.com/apikey
- **OPENAI_API_KEY**: Generate one at https://platform.openai.com/api-keys
- **OPENROUTER_API_KEY**: Generate one at https://openrouter.ai/keys
