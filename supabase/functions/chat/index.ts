import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { openai } from "npm:@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "npm:ai";
import { Pica } from "npm:@picahq/ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// Fallback API keys - these will be used if not available from environment or database
const FALLBACK_OPENAI_KEY = "test::openai::default::cff665cc8b6147dc8c5717cc1bf51581";
const FALLBACK_PICA_KEY = "sk_test_1_7bqpw-Le3NzxtzZGVboO1ExBItLycW2iS9bRUxE5R4Q5adWZ2vI730TpuecEevGA5vYsiXcMD5eiqs7tfvIiShaEbVKGoZyDkdNxNO_zvTUOIlUMVhakA8udwIajYvCbdfHHhR5PpouKxhDdJGCiulIDio74aV8lxDfAgKt91nenvxIAIu7_exU47DYuu6UfOjkP-Ega6ewkJ8kf6aFUoTfohHYrlM6BEV8BmgJ92g";

async function getApiKeys() {
  let openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  let picaSecretKey = Deno.env.get("PICA_SECRET_KEY");

  // If keys are not in environment, try to fetch from database
  if (!openaiApiKey || !picaSecretKey) {
    try {
      // You could implement database fetching logic here if needed
      // For now, we'll use the fallback keys
      console.log("Using fallback API keys");
    } catch (error) {
      console.warn("Could not fetch keys from database, using fallbacks:", error);
    }
  }

  // Use fallback keys if still not available
  if (!openaiApiKey) {
    openaiApiKey = FALLBACK_OPENAI_KEY;
    console.log("Using fallback OpenAI API key");
  }

  if (!picaSecretKey) {
    picaSecretKey = FALLBACK_PICA_KEY;
    console.log("Using fallback Pica secret key");
  }

  return { openaiApiKey, picaSecretKey };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { openaiApiKey, picaSecretKey } = await getApiKeys();

    if (!openaiApiKey) {
      throw new Error("OpenAI API key is not available");
    }

    if (!picaSecretKey) {
      throw new Error("Pica secret key is not available");
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is required");
    }

    console.log("Processing chat request with", messages.length, "messages");

    // Initialize Pica with the secret key
    const pica = new Pica(picaSecretKey, {
      connectors: [
        "*"
      ],
      identity: "user_123", // Replace with dynamic identity if available
      identityType: "user"
    });

    // Generate system prompt using Pica
    const systemPrompt = await pica.generateSystemPrompt();

    console.log("Generated system prompt with Pica");

    const result = streamText({
      model: openai("gpt-4", {
        apiKey: openaiApiKey,
      }),
      system: systemPrompt,
      tools: { ...pica.oneTool },
      messages: convertToCoreMessages(messages),
      maxSteps: 10,
      maxTokens: 1000,
      temperature: 0.7,
    });

    return result.toDataStreamResponse({ headers: corsHeaders });

  } catch (error) {
    console.error("Chat function error:", error);
    
    // Fallback to basic OpenAI without Pica if there's an error
    try {
      const { openaiApiKey } = await getApiKeys();
      
      if (!openaiApiKey) {
        throw new Error("No OpenAI API key available for fallback");
      }

      const { messages } = await req.json();
      
      const basicSystemPrompt = `You are a helpful AI financial advisor for Argent, a modern financial management platform. 

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

      console.log("Falling back to basic OpenAI chat");

      const result = streamText({
        model: openai("gpt-4", {
          apiKey: openaiApiKey,
        }),
        system: basicSystemPrompt,
        messages: convertToCoreMessages(messages),
        maxTokens: 1000,
        temperature: 0.7,
      });

      return result.toDataStreamResponse({ headers: corsHeaders });

    } catch (fallbackError) {
      console.error("Fallback chat error:", fallbackError);
      return new Response(JSON.stringify({
        error: "AI chat service is temporarily unavailable. Please try again later."
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
});