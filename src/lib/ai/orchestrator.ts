import {
    BusinessInput,
    generateHeroPrompt,
    generateAboutPrompt,
    generateServicesPrompt,
    generateFaqPrompt,
    generateTestimonialsPrompt,
    generateCtaPrompt,
} from "./prompts";
import {
    generateSection,
    HeroSchema,
    AboutSchema,
    ServicesSchema,
    FaqSchema,
    TestimonialsSchema,
    CtaSchema,
} from "./openai";

export interface GeneratedPageData {
    hero: z.infer<typeof HeroSchema>;
    about: z.infer<typeof AboutSchema>;
    services: z.infer<typeof ServicesSchema>;
    testimonials: z.infer<typeof TestimonialsSchema>;
    faq: z.infer<typeof FaqSchema>;
    cta: z.infer<typeof CtaSchema>;
}

import { z } from "zod";

/**
 * Orchestrates the generation of all sections for a single business input.
 * Runs calls in parallel for maximum speed.
 */
export async function generateFullPage(
    input: BusinessInput
): Promise<GeneratedPageData> {
    console.log(`Starting page generation for: ${input.businessName}`);

    // Run all OpenAI calls concurrently to reduce wait time from ~30s to ~5s
    const [hero, about, services, testimonials, faq, cta] = await Promise.all([
        generateSection(generateHeroPrompt(input), HeroSchema, "heroSection"),
        generateSection(generateAboutPrompt(input), AboutSchema, "aboutSection"),
        generateSection(
            generateServicesPrompt(input),
            ServicesSchema,
            "servicesSection"
        ),
        generateSection(
            generateTestimonialsPrompt(input),
            TestimonialsSchema,
            "testimonialsSection"
        ),
        generateSection(generateFaqPrompt(input), FaqSchema, "faqSection"),
        generateSection(generateCtaPrompt(input), CtaSchema, "ctaSection"),
    ]);

    console.log(`Finished generating all sections for: ${input.businessName}`);

    return {
        hero,
        about,
        services,
        testimonials,
        faq,
        cta,
    };
}
