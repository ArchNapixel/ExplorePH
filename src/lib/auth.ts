import { db } from "@/lib/db";
import { createSupabase } from "@/lib/supabase";

export type CurrentUser = { id: string; email: string | null };

// The signed-in player, or null. Their User row is created on first sight;
// the email stays in Supabase and is never copied into our database.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabase();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const user = await db.user.upsert({
    where: { supabaseId: claims.sub },
    update: {},
    create: { supabaseId: claims.sub },
    select: { id: true },
  });
  return { id: user.id, email: claims.email ?? null };
}
