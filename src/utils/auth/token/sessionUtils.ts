
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Ensures the authenticated user exists in the database
 */
export async function ensureUserInDatabase(user: User): Promise<void> {
  if (!user.email) {
    console.error("ensureUserInDatabase: No email found for user");
    return;
  }
  
  console.log("SessionUtils: Ensuring user exists in database:", user.email);
  
  try {
    // Check if the user is already in the database
    const { data: existingUser, error: queryError } = await supabase
      .from('users_db_birthplanbuilder')
      .select('email')
      .eq('email', user.email)
      .maybeSingle();
      
    if (queryError) {
      console.error("SessionUtils: Error checking user existence:", queryError);
      return;
    }
    
    // If user doesn't exist, add them
    if (!existingUser) {
      console.log("SessionUtils: User not found in database, adding:", user.email);
      
      const { error: insertError } = await supabase
        .from('users_db_birthplanbuilder')
        .insert({ email: user.email });
        
      if (insertError) {
        console.error("SessionUtils: Error adding user to database:", insertError);
      } else {
        console.log("SessionUtils: Successfully added user to database");
      }
    } else {
      console.log("SessionUtils: User already exists in database");
    }
  } catch (error) {
    console.error("SessionUtils: Error in ensureUserInDatabase:", error);
  }
}
