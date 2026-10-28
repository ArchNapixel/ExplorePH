import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "./auth/actions";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">MaPHo</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Collect the Philippines, one stamp at a time.
        </p>
      </div>
      {/* Reads the session cookie, so it streams in; the fixed height avoids a jump */}
      <Suspense fallback={<div className="h-12" />}>
        <Account />
      </Suspense>
    </main>
  );
}

async function Account() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex h-12 items-center justify-center rounded-lg bg-foreground font-medium text-background"
      >
        Sign in
      </Link>
    );
  }
  return (
    <div className="flex h-12 items-center justify-between gap-4">
      <p className="truncate text-sm">Signed in as {user.email}</p>
      <form action={signOut}>
        <button className="h-10 rounded-lg border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-700">
          Sign out
        </button>
      </form>
    </div>
  );
}
