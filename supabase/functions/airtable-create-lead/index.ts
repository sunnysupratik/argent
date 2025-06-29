import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { picaSecretKey, picaAirtableConnectionKey, record } = await req.json();

    if (!picaSecretKey || !picaAirtableConnectionKey) {
      throw new Error("Missing required Pica credentials");
    }

    if (!record) {
      throw new Error("Missing record data");
    }

    // Default database and table IDs - these should be configured in environment variables
    // in a production environment
    const DATABASE_ID = Deno.env.get("AIRTABLE_DATABASE_ID") || "appXXXXXXXXXXXXXX";
    const TABLE_ID = Deno.env.get("AIRTABLE_TABLE_ID") || "tblXXXXXXXXXXXXXX";

    console.log("Creating Airtable record via Pica...");

    // Make the request to Pica API to create a record in Airtable
    const response = await fetch(`https://api.picaos.com/v1/passthrough/${DATABASE_ID}/${TABLE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-pica-secret": picaSecretKey,
        "x-pica-connection-key": picaAirtableConnectionKey,
        "x-pica-action-id": "conn_mod_def::F--Ywa8nfKA::WsZ0tL8uSD-23rubqhbfPQ"
      },
      body: JSON.stringify({
        records: [{ fields: record }],
        returnFieldsByFieldId: false,
        typecast: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Pica API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error creating Airtable record:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});