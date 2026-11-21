"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/lib/definitions";

type Props = {
  mode: "login" | "signup";
  action: (state: FormState, formData: FormData) => Promise<FormState>;
};

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="mb-1 text-2xl font-semibold">{isLogin ? "Sign in" : "Create account"}</h1>
      <p className="mb-6 text-sm text-zinc-500">
        {isLogin ? "Welcome back. Enter your details." : "Pick a username and password."}
      </p>

      <form action={formAction} className="space-y-4" noValidate>
        <Field
          label="Username"
          name="username"
          autoComplete="username"
          defaultValue={state?.username}
          errors={state?.errors?.username}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          errors={state?.errors?.password}
        />

        {state?.message && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {isLogin ? "No account yet? " : "Already have an account? "}
        <Link href={isLogin ? "/signup" : "/login"} className="font-medium text-zinc-900 underline dark:text-zinc-100">
          {isLogin ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  errors?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={!!errors?.length}
        className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 aria-[invalid=true]:border-red-500 dark:border-zinc-700 dark:focus:border-zinc-100"
      />
      {errors?.map((e) => (
        <p key={e} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {e}
        </p>
      ))}
    </div>
  );
}
