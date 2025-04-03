
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const url = new URL(req.url);
  console.log("📣 Webhook received - Path:", url.pathname);
  console.log("📣 Request method:", req.method);
  
  // Add a health check endpoint
  if (url.pathname.endsWith('/health') || url.searchParams.has('health')) {
    console.log("📣 Health check requested");
    return new Response(JSON.stringify({ 
      status: 'online',
      timestamp: new Date().toISOString(),
      message: 'Wix webhook function is deployed and running'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("📣 Handling OPTIONS request (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests for the main webhook endpoint
  if (req.method !== 'POST') {
    console.log(`❌ Rejecting ${req.method} request - only POST is allowed`);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log("📣 Request URL:", req.url);
  console.log("📣 Request headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));

  try {
    // Log Supabase credentials (without revealing actual values)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log(`📣 Supabase URL available: ${!!supabaseUrl}`);
    console.log(`📣 Supabase service role key available: ${!!supabaseKey}`);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Supabase credentials missing!");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the raw request body text for logging
    const clonedRequest = req.clone();
    const rawBody = await clonedRequest.text();
    console.log("📣 Raw webhook payload:", rawBody);
    
    // Parse the incoming webhook payload
    let webhookData;
    try {
      webhookData = JSON.parse(rawBody);
      console.log("📣 Parsed webhook data:", JSON.stringify(webhookData, null, 2));
    } catch (parseError) {
      console.error("❌ Failed to parse JSON payload:", parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON payload',
        rawBody: rawBody.substring(0, 200) + (rawBody.length > 200 ? '...' : '')
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract email from the Wix webhook payload structure with thorough logging
    let purchaserEmail = null;
    
    // Check for email in data.email as confirmed by your test
    if (webhookData?.data?.email) {
      purchaserEmail = webhookData.data.email.trim();
      console.log(`📣 Found email in data.email: "${purchaserEmail}"`);
    }
    
    // Fallback for other possible structures just in case
    if (!purchaserEmail && webhookData?.email) {
      purchaserEmail = webhookData.email.trim();
      console.log(`📣 Found email directly in payload: "${purchaserEmail}"`);
    }
    
    if (!purchaserEmail) {
      console.error('❌ No email found in the webhook payload');
      return new Response(JSON.stringify({ 
        error: 'No email found in payload',
        payload: webhookData
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`📣 Attempting to insert email "${purchaserEmail}" into users_db_birthplanbuilder table`);
    
    // Insert the email into the users_db_birthplanbuilder table
    const { data, error } = await supabase
      .from('users_db_birthplanbuilder')
      .upsert({ 
        email: purchaserEmail 
      }, { 
        onConflict: 'email' 
      });

    if (error) {
      console.error('❌ Error inserting user:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to process purchase',
        details: error.message,
        emailFound: purchaserEmail
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Purchase processed successfully for email:', purchaserEmail);
    return new Response(JSON.stringify({ 
      message: 'Purchase processed successfully',
      email: purchaserEmail
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
