import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { getSystemPrompt } from "./prompts";

// Initialize OpenAI client
// Will throw if OPENAI_API_KEY is not set in environment or .env.local
const openai = new OpenAI();

// Setup Zod Schemas matching our expected JSON shapes
export const HeroSchema = z.object({
    headline: z.string(),
    subHeadline: z.string(),
    ctaText: z.string(),
});

export const AboutSchema = z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
});

export const ServicesSchema = z.object({
    sectionTitle: z.string(),
    services: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
        })
    ),
});

export const FaqSchema = z.object({
    sectionTitle: z.string(),
    faqs: z.array(
        z.object({
            question: z.string(),
            answer: z.string(),
        })
    ),
});

export const TestimonialsSchema = z.object({
    sectionTitle: z.string(),
    testimonials: z.array(
        z.object({
            authorName: z.string(),
            text: z.string(),
        })
    ),
});

export const CtaSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    buttonText: z.string(),
});

/**
 * Generic function to call OpenAI with a specific prompt and strictly enforce the output JSON schema.
 */
export async function generateSection<T>(
    prompt: string,
    schema: z.ZodType<T>,
    schemaName: string
): Promise<T> {
    const response = await openai.chat.completions.create({
        // We default to gpt-4o-mini as it is much cheaper and highly capable for JSON parsing
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: getSystemPrompt() },
            { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(schema, schemaName),
        temperature: 0.7, // Add slight creativity but keep formatting strict
    });

    const content = response.choices[0].message.content;

    if (!content) {
        throw new Error(`Failed to generate content for schema: ${schemaName}`);
    }

    // With zodResponseFormat, OpenAI guarantees the output matches the schema,
    // so we can safely parse it.
    return JSON.parse(content) as T;
}
