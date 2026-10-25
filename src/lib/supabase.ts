import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// One client per request: it reads and writes the Supabase auth cookies.
export async function createSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components can't set cookies; src/proxy.ts refreshes the session instead.
          }
        },
      },
    },
  );
}
