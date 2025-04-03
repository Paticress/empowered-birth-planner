
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Log basic request information
  console.log("TEST FUNCTION: Request received at:", new Date().toISOString());
  console.log("TEST FUNCTION: Request method:", req.method);
  console.log("TEST FUNCTION: Request URL:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("TEST FUNCTION: Handling OPTIONS request");
    return new Response(null, { 
      headers: corsHeaders 
    });
  }

  // For GET requests, return a simple status page
  if (req.method === 'GET') {
    console.log("TEST FUNCTION: Handling GET request");
    return new Response(JSON.stringify({
      status: 'online',
      timestamp: new Date().toISOString(),
      message: 'Test function is working'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // For POST requests, try to connect to the database
  if (req.method === 'POST') {
    console.log("TEST FUNCTION: Handling POST request");
    
    try {
      // Try to get request body if present
      const hasBody = req.headers.get('content-length') && parseInt(req.headers.get('content-length') || '0') > 0;
      let requestBody = null;
      
      if (hasBody) {
        try {
          const bodyText = await req.text();
          console.log("TEST FUNCTION: Raw request body:", bodyText);
          requestBody = JSON.parse(bodyText);
          console.log("TEST FUNCTION: Parsed request body:", JSON.stringify(requestBody, null, 2));
        } catch (e) {
          console.log("TEST FUNCTION: Error parsing request body:", e);
        }
      }
      
      // Log Supabase credentials availability
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      console.log(`TEST FUNCTION: Supabase URL available: ${!!supabaseUrl}`);
      console.log(`TEST FUNCTION: Supabase service role key available: ${!!supabaseKey}`);
      
      if (!supabaseUrl || !supabaseKey) {
        console.error("TEST FUNCTION: Supabase credentials missing!");
        return new Response(JSON.stringify({ 
          error: 'Supabase configuration error - credentials missing'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // Initialize Supabase client
      console.log("TEST FUNCTION: Initializing Supabase client");
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test email to use (either from request or default)
      const testEmail = (requestBody && requestBody.email) 
        ? requestBody.email 
        : "test-function@example.com";
      
      console.log(`TEST FUNCTION: Attempting database operation with email: ${testEmail}`);
      
      // Try a simple database operation
      const { data, error } = await supabase
        .from('users_db_birthplanbuilder')
        .upsert({ 
          email: testEmail 
        }, { 
          onConflict: 'email' 
        });
      
      if (error) {
        console.error("TEST FUNCTION: Database error:", error);
        return new Response(JSON.stringify({ 
          error: 'Database operation failed',
          details: error.message,
          code: error.code,
          hint: error.hint
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log("TEST FUNCTION: Database operation successful");
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Database operation completed successfully',
        email: testEmail,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (error) {
      console.error("TEST FUNCTION: Unexpected error:", error);
      return new Response(JSON.stringify({ 
        error: 'Test function failed',
        details: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
  
  // Handle other HTTP methods
  return new Response(JSON.stringify({ 
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST', 'OPTIONS']
  }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
