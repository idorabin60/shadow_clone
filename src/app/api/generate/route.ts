import { NextRequest, NextResponse } from "next/server";
import { generateFullPage } from "@/lib/ai/orchestrator";
import { BusinessInput } from "@/lib/ai/prompts";

export const maxDuration = 60; // Allow Vercel up to 60 seconds since AI generation can be slow

export async function POST(req: NextRequest) {
    try {
        const body: BusinessInput = await req.json();

        // Basic Validation
        if (!body.businessName || !body.businessType || !body.description) {
            return NextResponse.json(
                { error: "Missing required business information." },
                { status: 400 }
            );
        }

        // Since we're defaulting services to empty array if missing
        if (!body.services) {
            body.services = [];
        }

        // Call the AI Orchestrator
        const generatedPage = await generateFullPage(body);

        // Return the completed JSON payload
        return NextResponse.json(generatedPage);
    } catch (error: any) {
        console.error("Error generating page content:", error);

        // Provide a graceful fallback error message
        return NextResponse.json(
            {
                error: "Failed to generate landing page content.",
                details: error.message
            },
            { status: 500 }
        );
    }
}
