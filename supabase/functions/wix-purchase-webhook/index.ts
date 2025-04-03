
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Webhook received - Method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Request Headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log(`Rejecting ${req.method} request - only POST is allowed`);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Log Supabase credentials (without revealing actual values)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log(`Supabase URL available: ${!!supabaseUrl}`);
    console.log(`Supabase service role key available: ${!!supabaseKey}`);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing!");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the raw request body text for logging
    const clonedRequest = req.clone();
    const rawBody = await clonedRequest.text();
    console.log("Raw webhook payload:", rawBody);
    
    // Parse the incoming webhook payload
    let webhookData;
    try {
      webhookData = JSON.parse(rawBody);
      console.log("Parsed webhook data:", JSON.stringify(webhookData, null, 2));
    } catch (parseError) {
      console.error("Failed to parse JSON payload:", parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON payload',
        rawBody: rawBody.substring(0, 200) + (rawBody.length > 200 ? '...' : '')
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract email from the Wix webhook payload structure
    const purchaserEmail = webhookData?.data?.email?.trim();
    
    if (!purchaserEmail) {
      console.error('No email found in the webhook payload');
      return new Response(JSON.stringify({ 
        error: 'No email found in payload',
        payload: webhookData
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Attempting to insert email "${purchaserEmail}" into Users_DB_BirthPlanBuilder table`);
    
    // Insert the email into the Users_DB_BirthPlanBuilder table
    const { data, error } = await supabase
      .from('Users_DB_BirthPlanBuilder')
      .upsert({ 
        email: purchaserEmail 
      }, { 
        onConflict: 'email' 
      });

    if (error) {
      console.error('Error inserting user:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to process purchase',
        details: error.message,
        emailFound: purchaserEmail
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Purchase processed successfully for email:', purchaserEmail);
    return new Response(JSON.stringify({ 
      message: 'Purchase processed successfully',
      email: purchaserEmail
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
