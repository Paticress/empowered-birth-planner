
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
  
  try {
    // Get and log the raw request body
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
        rawPayload: rawBody.substring(0, 200) + (rawBody.length > 200 ? '...' : '')
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract email from the Wix webhook payload structure
    let purchaserEmail = null;
    
    // IMPORTANT: The format is confirmed to be {"data": {"email": "example@email.com"}}
    if (webhookData?.data?.email) {
      purchaserEmail = webhookData.data.email.trim();
      console.log(`📣 Found email in data.email: "${purchaserEmail}"`);
    } else {
      console.error('❌ Email not found in expected format. Payload structure:', JSON.stringify(webhookData));
      return new Response(JSON.stringify({ 
        error: 'Email not found in payload',
        payload: webhookData
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log Supabase credentials availability (without revealing values)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log(`📣 Supabase URL available: ${!!supabaseUrl}`);
    console.log(`📣 Supabase key available: ${!!supabaseKey}`);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Supabase credentials missing!");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    console.log(`📣 Initializing Supabase client`);
    const supabase = createClient(supabaseUrl, supabaseKey);

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
      console.error('❌ Database error:', error.message);
      console.error('❌ Error details:', error.code, error.hint || 'No hint available');
      return new Response(JSON.stringify({ 
        error: 'Failed to process purchase',
        details: error.message,
        code: error.code,
        hint: error.hint
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Check if user account exists in auth system
    const { data: userData, error: userError } = await supabase
      .auth
      .admin
      .getUserByEmail(purchaserEmail);
      
    console.log(`📣 Checking if user already exists: ${!!userData}`);
    
    // If user doesn't exist, create one with a temporary password
    if (!userData && !userError) {
      // Generate a secure random password (user will never need to know this)
      const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);
      
      console.log(`📣 Creating new Supabase auth account for: ${purchaserEmail}`);
      
      // Create a new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: purchaserEmail,
        password: tempPassword,
        email_confirm: true // Automatically confirm email
      });
      
      if (createError) {
        console.error('❌ Error creating user account:', createError.message);
        // Continue without failing - the user can still sign up manually
      } else {
        console.log('✅ User account created successfully:', newUser);
      }
    }

    console.log('✅ Purchase processed successfully for email:', purchaserEmail);
    return new Response(JSON.stringify({ 
      success: true,
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
