"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabase } from "@/lib/supabase";

export type EmailSignInState = { sentTo?: string; error?: string };

async function callbackUrl() {
  const origin = (await headers()).get("origin");
  return `${origin}/auth/callback`;
}

export async function signInWithEmail(
  _prev: EmailSignInState,
  formData: FormData,
): Promise<EmailSignInState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email to get a sign-in link." };

  const supabase = await createSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: await callbackUrl() },
  });
  if (error) {
    console.error(error);
    return { error: "The link didn't send. Check the address and try again." };
  }
  return { sentTo: email };
}

export async function signInWithGoogle() {
  const supabase = await createSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await callbackUrl() },
  });
  if (error || !data.url) {
    console.error(error);
    redirect("/login?error=google");
  }
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabase();
  await supabase.auth.signOut();
  redirect("/");
}
