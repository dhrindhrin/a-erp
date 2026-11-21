import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal";

const primary =
  "rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900";
const secondary = "rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">a-erp</h1>
      <p className="max-w-md text-zinc-500">
        Next.js skeleton with username &amp; password authentication.
      </p>
      <div className="flex h-10 gap-3">
        <Suspense fallback={null}>
          <AuthButtons />
        </Suspense>
      </div>
    </main>
  );
}

async function AuthButtons() {
  const user = await getCurrentUser();
  if (user) {
    return (
      <Link href="/dashboard" className={primary}>
        Go to dashboard
      </Link>
    );
  }
  return (
    <>
      <Link href="/login" className={primary}>Sign in</Link>
      <Link href="/signup" className={secondary}>Create account</Link>
    </>
  );
}
