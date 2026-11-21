"use server";

import { redirect } from "next/navigation";
import { createUser, verifyLogin } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, SignupSchema, type FormState } from "@/lib/definitions";

export async function signup(_state: FormState, formData: FormData): Promise<FormState> {
  const username = String(formData.get("username") ?? "");
  const parsed = SignupSchema.safeParse({ username, password: formData.get("password") });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, username };
  }

  const userId = await createUser(parsed.data.username, parsed.data.password);
  if (!userId) {
    return { errors: { username: ["That username is taken."] }, username };
  }
  await createSession(userId);
  redirect("/dashboard");
}

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const username = String(formData.get("username") ?? "");
  const parsed = LoginSchema.safeParse({ username, password: formData.get("password") });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, username };
  }

  const userId = await verifyLogin(parsed.data.username, parsed.data.password);
  if (!userId) {
    return { message: "Invalid username or password.", username };
  }
  await createSession(userId);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
