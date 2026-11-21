"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createUser, findUserByUsername } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { LoginSchema, SignupSchema, type FormState } from "@/lib/definitions";

// Compared against when the username doesn't exist, so timing doesn't reveal valid usernames.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function signup(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = SignupSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  const username = String(formData.get("username") ?? "");
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, username };
  }

  if (findUserByUsername(parsed.data.username)) {
    return { errors: { username: ["That username is taken."] }, username };
  }

  const hash = await bcrypt.hash(parsed.data.password, 12);
  const userId = createUser(parsed.data.username, hash);
  await createSession(userId);
  redirect("/dashboard");
}

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const parsed = LoginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  const username = String(formData.get("username") ?? "");
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, username };
  }

  const user = findUserByUsername(parsed.data.username);
  const ok = await bcrypt.compare(parsed.data.password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !ok) {
    return { message: "Invalid username or password.", username };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
