import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, decrypt } from "./session-token";
import { findUserById } from "./db";

/** Returns the signed-in user, or null. Checks the cookie AND that the user still exists. */
export const getCurrentUser = cache(async () => {
  const session = await decrypt((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return findUserById(session.userId) ?? null;
});

/** Use in protected pages/actions: redirects to /login when not signed in. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
