import { Suspense } from "react";
import { requireUser } from "@/lib/dal";
import { logout } from "@/app/actions/auth";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <form action={logout}>
          <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
            Sign out
          </button>
        </form>
      </div>
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <Welcome />
        </Suspense>
      </div>
    </main>
  );
}

async function Welcome() {
  const user = await requireUser();
  return (
    <>
      <p className="text-lg">
        Hello, <span className="font-semibold">{user.username}</span> 👋
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Member since {new Date(user.created_at.replace(" ", "T") + "Z").toLocaleDateString("en-US")}.
        This page is only visible to signed-in users.
      </p>
    </>
  );
}
