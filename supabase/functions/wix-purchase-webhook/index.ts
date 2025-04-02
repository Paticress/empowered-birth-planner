
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Webhook received - Method:", req.method);
  
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
      console.log("Parsed webhook data:", JSON.stringify(webhookData));
    } catch (parseError) {
      console.error("Failed to parse JSON payload:", parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try multiple ways to extract email based on Wix webhook structure
    // We're checking multiple possible paths since we don't know the exact format
    let purchaserEmail = null;
    
    // Direct email property
    if (webhookData.email) {
      purchaserEmail = webhookData.email;
      console.log("Found email directly in payload:", purchaserEmail);
    } 
    // Check in data.email
    else if (webhookData.data && webhookData.data.email) {
      purchaserEmail = webhookData.data.email;
      console.log("Found email in data.email:", purchaserEmail);
    }
    // Check in order info
    else if (webhookData.order && webhookData.order.buyerInfo && webhookData.order.buyerInfo.email) {
      purchaserEmail = webhookData.order.buyerInfo.email;
      console.log("Found email in order.buyerInfo.email:", purchaserEmail);
    }
    // Check in contact info
    else if (webhookData.contactInfo && webhookData.contactInfo.email) {
      purchaserEmail = webhookData.contactInfo.email;
      console.log("Found email in contactInfo.email:", purchaserEmail);
    }
    // Check in customer
    else if (webhookData.customer && webhookData.customer.email) {
      purchaserEmail = webhookData.customer.email;
      console.log("Found email in customer.email:", purchaserEmail);
    }
    
    // If we still don't have an email, look through all properties recursively
    if (!purchaserEmail) {
      console.log("Searching for email field recursively in payload...");
      const findEmail = (obj: any, path = ""): string | null => {
        if (!obj || typeof obj !== 'object') return null;
        
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          
          // If this property is called email and has a string value
          if (key.toLowerCase() === 'email' && typeof value === 'string' && value.includes('@')) {
            console.log(`Found email at path ${currentPath}:`, value);
            return value;
          }
          
          // If this is an object or array, search recursively
          if (typeof value === 'object' && value !== null) {
            const result = findEmail(value, currentPath);
            if (result) return result;
          }
        }
        
        return null;
      };
      
      purchaserEmail = findEmail(webhookData);
    }

    if (!purchaserEmail) {
      console.error('No email found in the webhook payload');
      return new Response(JSON.stringify({ 
        error: 'No email found in payload',
        payloadStructure: JSON.stringify(webhookData, null, 2)
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
        details: error.message
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
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
