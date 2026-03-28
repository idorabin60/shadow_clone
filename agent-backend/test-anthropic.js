const { ChatAnthropic } = require("@langchain/anthropic");
require('dotenv').config();

async function test() {
    try {
        const model = new ChatAnthropic({
            modelName: "claude-opus-4-6",
            anthropicApiKey: process.env.ANTHROPIC_API_KEY
        });
        await model.invoke("Hello");
        console.log("Success with claude-opus-4-6");
    } catch (e) {
        console.error("Error with claude-opus-4-6:", e.status, e.message);
    }
}
test();
