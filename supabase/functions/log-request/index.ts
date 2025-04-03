
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Log timestamp and URL
  console.log(`\n\n=== REQUEST LOGGER ${new Date().toISOString()} ===`);
  console.log(`URL: ${req.url}`);
  console.log(`Method: ${req.method}`);
  
  // Log headers
  console.log("\n=== HEADERS ===");
  const headers = Object.fromEntries(req.headers.entries());
  console.log(JSON.stringify(headers, null, 2));
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get and log body if present
  let body = null;
  try {
    // Clone request to avoid consuming the body for follow-up operations
    const clonedReq = req.clone();
    const bodyText = await clonedReq.text();
    
    console.log("\n=== RAW BODY ===");
    console.log(bodyText);
    
    // Try to parse as JSON, but don't worry if it fails
    try {
      body = JSON.parse(bodyText);
      console.log("\n=== PARSED BODY ===");
      console.log(JSON.stringify(body, null, 2));
    } catch (e) {
      console.log("Body is not valid JSON or is empty");
    }
  } catch (e) {
    console.error("Error reading request body:", e);
  }
  
  // Return success response
  return new Response(JSON.stringify({
    message: "Request logged successfully",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
