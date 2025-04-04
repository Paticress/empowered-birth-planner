
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds/updates user in the database after successful authentication
 */
export async function ensureUserInDatabase(user: { email?: string | null }): Promise<void> {
  try {
    if (user?.email) {
      const email = user.email;
      
      // Add/update user in database
      const { error: insertError } = await supabase
        .from('users_db_birthplanbuilder')
        .upsert({ email }, { onConflict: 'email' });
        
      if (insertError) {
        console.error("TokenUtils: Error adding user to database:", insertError);
        // Continue anyway - this shouldn't block login
      } else {
        console.log("TokenUtils: User added/updated in the database");
      }
    }
  } catch (dbError) {
    console.error("TokenUtils: Database error:", dbError);
    // Continue anyway - database error shouldn't block login
  }
}
