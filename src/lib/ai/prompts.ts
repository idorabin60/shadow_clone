export interface BusinessInput {
    businessName: string;
    businessType: string;
    description: string;
    uniqueSellingProposition?: string;
    services: string[];
    targetAudience?: string;
    tone?: "professional" | "friendly" | "luxury" | "casual";
    contactInfo?: {
        phone?: string;
        email?: string;
        address?: string;
    };
}

const BASE_SYSTEM_PROMPT = `
You are an expert Israeli digital copywriter and landing page conversion specialist.
Your goal is to generate high-converting, native-sounding Hebrew copy for business landing pages.
The output MUST be in Hebrew ONLY. Do not use translated phrasing; it must sound completely natural to a native Israeli speaker.
Ensure the text matches the requested tone of the business. Do not use generic filler words. Be concrete, persuasive, and action-oriented.
Output ONLY the requested JSON format, and nothing else.
`;

export const getSystemPrompt = () => BASE_SYSTEM_PROMPT;

export const generateHeroPrompt = (input: BusinessInput) => `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Description: ${input.description}
Unique Selling Prop (Why choose us?): ${input.uniqueSellingProposition || "N/A"}
Tone: ${input.tone || "professional"}

Generate a "Hero" section (the top portion of the site).
We need a main headline (H1), a sub-headline, and the text for a primary Call to Action (CTA) button.

Rules:
1. Headline should be extremely catchy, clear, and highlight the main value proposition or unique advantage. Maximum 8 words.
2. Sub-headline should expand on the headline with a persuasive benefit. Maximum 20 words.
3. CTA button text should be action-oriented (e.g., "לקביעת פגישה", "התחל עכשיו", "דברו איתנו").

Return JSON exactly in this shape:
{
  "headline": string,
  "subHeadline": string,
  "ctaText": string
}
`;

export const generateAboutPrompt = (input: BusinessInput) => `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Description: ${input.description}
Unique Advantage: ${input.uniqueSellingProposition || "N/A"}
Tone: ${input.tone || "professional"}

Generate an "About Us" section.
Write a compelling, trustworthy "About" section that explains who the business is, why they are experts, and highlights their unique advantage.

Return JSON exactly in this shape:
{
  "title": string, // E.g., "מי אנחנו", "הסיפור שלנו"
  "paragraphs": string[] // 2 to 3 paragraphs of compelling text
}
`;

export const generateServicesPrompt = (input: BusinessInput) => `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Explicit Services Provided: ${input.services.join(", ") || "N/A"}
Tone: ${input.tone || "professional"}

Generate a "Services" section detailing what the business offers.
If Explicit Services are provided, detail exactly those services.
If the list is empty, infer 3-4 likely services based on the Business Type.
For each service, write a catchy title and a short 2-sentence description highlighting the benefit.

Return JSON exactly in this shape:
{
  "sectionTitle": string, // E.g., "השירותים המקצועיים שלנו", "מה אנחנו מציעים"
  "services": [
    {
      "title": string,
      "description": string
    }
  ]
}
`;

export const generateFaqPrompt = (input: BusinessInput) => `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Unique Advantage: ${input.uniqueSellingProposition || "N/A"}
Target Audience: ${input.targetAudience || "General public"}

Generate a Frequently Asked Questions (FAQ) section.
Think about the top 4-5 questions a typical Israeli customer would ask before engaging with this business type.
Write the questions from the customer's perspective and provide reassuring, helpful answers that softly weave in the unique advantage.

Return JSON exactly in this shape:
{
  "sectionTitle": string, // E.g., "שאלות נפוצות"
  "faqs": [
    {
      "question": string,
      "answer": string
    }
  ]
}
`;

export const generateTestimonialsPrompt = (input: BusinessInput) => `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Unique Advantage: ${input.uniqueSellingProposition || "N/A"}

Generate a "Testimonials" section containing quotes from satisfied Israeli customers.
Write 3 realistic-sounding reviews that highlight the specific unique advantages of this business.
Use common Israeli first names for the authors (e.g., "דוד", "מיכל", "רועי").

Return JSON exactly in this shape:
{
  "sectionTitle": string, // E.g., "לקוחות ממליצים", "מה אומרים עלינו"
  "testimonials": [
    {
      "authorName": string,
      "text": string
    }
  ]
}
`;

export const generateCtaPrompt = (input: BusinessInput) => `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Tone: ${input.tone || "professional"}

Generate a final "Call To Action" (CTA) section to place at the bottom of the page.
It needs a strong closing statement encouraging the user to reach out immediately, and a persuasive button text.

Return JSON exactly in this shape:
{
  "title": string, // E.g., "מוכנים לקחת את העסק שלכם לשלב הבא?"
  "subtitle": string, // Short sentence creating urgency or reassurance
  "buttonText": string
}
`;
