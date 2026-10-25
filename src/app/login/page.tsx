import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to ExplorePH
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Your stamps stay private unless you choose to share them.
        </p>
      </div>
      {/* useSearchParams reads the request, so it streams in behind a boundary */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
