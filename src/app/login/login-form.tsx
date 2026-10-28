"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import {
  signInWithEmail,
  signInWithGoogle,
  type EmailSignInState,
} from "../auth/actions";

const callbackErrors: Record<string, string> = {
  link: "That sign-in link expired or was already used. Send a new one.",
  google: "Google sign-in didn't start. Try again or use your email.",
};

export function LoginForm() {
  const callbackError = callbackErrors[useSearchParams().get("error") ?? ""];
  const [state, emailAction, sending] = useActionState<
    EmailSignInState,
    FormData
  >(signInWithEmail, {});

  if (state.sentTo) {
    return (
      <p className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        Check <strong>{state.sentTo}</strong> for your sign-in link. Open it on
        this device.
      </p>
    );
  }

  const error = state.error ?? callbackError;
  return (
    <div className="flex flex-col gap-6">
      <form action={signInWithGoogle}>
        <button className="h-12 w-full rounded-lg border border-zinc-300 font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
          Continue with Google
        </button>
      </form>

      <form action={emailAction} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-12 rounded-lg border border-zinc-300 bg-transparent px-3 dark:border-zinc-700"
        />
        <button
          disabled={sending}
          className="h-12 rounded-lg bg-foreground font-medium text-background disabled:opacity-60"
        >
          {sending ? "Sending link…" : "Send sign-in link"}
        </button>
        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
