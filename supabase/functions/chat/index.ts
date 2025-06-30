import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { openai } from "npm:@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "npm:ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not set");
      throw new Error("OpenAI API key is not configured");
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is required");
    }

    console.log("Processing chat request with", messages.length, "messages");

    const systemPrompt = `You are a helpful AI financial advisor for Argent, a modern financial management platform. 

You help users with:
- Personal finance management and budgeting advice
- Investment strategies and portfolio analysis
- Spending pattern analysis and optimization
- Financial goal setting and planning
- General financial education and literacy

Keep your responses:
- Helpful and actionable
- Professional but friendly
- Focused on practical financial advice
- Appropriate for the user's experience level

Always remind users that your advice is for educational purposes and they should consult with qualified financial professionals for personalized advice.`;

    const result = streamText({
      model: openai("gpt-4"),
      system: systemPrompt,
      messages: convertToCoreMessages(messages),
      maxTokens: 1000,
      temperature: 0.7,
    });

    return result.toDataStreamResponse({ headers: corsHeaders });

  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({
      error: error.message || "Internal Server Error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});