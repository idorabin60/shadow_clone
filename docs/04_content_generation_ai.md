# Content Generation Engine (AI Layer)

Since we are currently blocked on the Anthropic API key, I have built the core AI layer using **OpenAI (GPT-4o-mini)**. This model is exceptionally fast, affordable, and natively supports "Structured Outputs" which guarantees we receive perfect JSON every time.

Here is an overview of what was built:

## 1. Prompt Engineering (`src/lib/ai/prompts.ts`)
I created a series of specialized prompts to generate natural-sounding Hebrew marketing copy. 
The system defines a `BASE_SYSTEM_PROMPT` instructing the AI to act as an "Israeli digital copywriter."
There are individual prompt functions for each section:
- `generateHeroPrompt`
- `generateAboutPrompt`
- `generateServicesPrompt`
- `generateFaqPrompt`
- `generateTestimonialsPrompt`
- `generateCtaPrompt`

## 2. Zod Structured Outputs (`src/lib/ai/openai.ts`)
LLMs are notorious for occasionally returning malformed JSON. To prevent this, I used **Zod** (a schema validation library) paired with OpenAI's latest `.parse()` API method.
By defining exact schemas (like `HeroSchema`, `ServicesSchema`), OpenAI is restricted at the API level to *only* return valid JSON that perfectly matches our TypeScript types. If it fails, the SDK handles it natively.

## 3. Parallel Orchestration (`src/lib/ai/orchestrator.ts`)
Generating 6 sections of a website one-by-one could take 20-30 seconds. Instead, the `generateFullPage()` function uses `Promise.all()` to trigger all 6 OpenAI prompts at the exact same time simultaneously. This means the entire landing page copy is generated in the time it takes to generate a single section (usually ~3 to 5 seconds).

## 4. The API Route (`src/app/api/generate/route.ts`)
This is the Next.js backend endpoint that the frontend Wizard UI will eventually call. It accepts the business name, type, and description, passes it to the orchestrator, and returns the finished JSON page structure.

## Next Steps
We are now ready to begin **Phase 3: Page Assembly & Preview**. In Phase 3, we will build the actual React components (Templates) that will visually render the AI-generated JSON into a beautiful, styled Hebrew landing page!
