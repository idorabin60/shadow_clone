import { ChatAnthropic } from "@langchain/anthropic";
import { SystemMessage, HumanMessage, ToolMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const applyPatchsetTool = tool(
    async ({ operations }) => "Success",
    {
        name: "apply_patchset",
        description: "CRITICAL BATCH TOOL",
        schema: z.object({
            operations: z.array(z.object({
                type: z.enum(["write", "edit", "delete"]),
                path: z.string(),
                content: z.string().optional(),
                find: z.string().optional(),
                replace: z.string().optional()
            }))
        })
    }
);

const readFileTool = tool(
    async ({ relativeFilePath }) => "Content",
    {
        name: "read_file",
        description: "Reads a file",
        schema: z.object({ relativeFilePath: z.string() })
    }
);

async function runTest() {
    const model = new ChatAnthropic({
        modelName: "claude-opus-4-6",
        temperature: 0,
        maxRetries: 0
    });

    const modelWithTools = model.bindTools([applyPatchsetTool, readFileTool]);

    const devPrompt = `CRITICAL WORKFLOW (PLAN -> PATCH -> VERIFY): You must batch operations.`;

    const msgs = [
        new SystemMessage(devPrompt),
        new HumanMessage("Begin constructing the application."),
        new AIMessage({
            content: "",
            tool_calls: [{ name: "read_file", args: { relativeFilePath: "spec.md" }, id: "call_1" }]
        }),
        new ToolMessage({ tool_call_id: "call_1", content: "Error: spec.md already read." })
    ];

    try {
        console.log("Invoking model...");
        const response = await modelWithTools.invoke(msgs);
        console.log("RESPONSE TYPE:", response.constructor.name);
        console.log("RESPONSE KEYS:", Object.keys(response));
        console.log("TOOL CALLS LEN:", response.tool_calls?.length);
        console.log("TOOL CALLS:", JSON.stringify(response.tool_calls, null, 2));
        console.log("INVALID TOOL CALLS:", JSON.stringify(response.invalid_tool_calls, null, 2));

        if (!response.tool_calls || response.tool_calls.length === 0) {
            console.log("WOULD BREAK");
        } else {
            console.log("WOULD LOOP");
            for (const t of response.tool_calls) {
                console.log(`TOOL: ${t.name}`);
            }
        }
    } catch (e: any) {
        console.error("ERROR:", e.message);
    }
}

runTest();
