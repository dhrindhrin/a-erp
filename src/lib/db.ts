import "server-only";

// User accounts live in Supabase (schema app_auth, not exposed by the API).
// The app can only reach them through three Postgres functions, and bcrypt
// hashing/checking happens inside the database, so password hashes never leave it.

export type User = { id: string; username: string; created_at: string };

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set (see .env.example).");

  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${fn} failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Creates a user. Returns the new id, or null when the username is taken. */
export function createUser(username: string, password: string) {
  return rpc<string | null>("app_signup", { p_username: username, p_password: password });
}

/** Returns the user id when username + password match, else null. */
export function verifyLogin(username: string, password: string) {
  return rpc<string | null>("app_login", { p_username: username, p_password: password });
}

export async function findUserById(id: string) {
  const rows = await rpc<User[]>("app_get_user", { p_id: id });
  return rows[0];
}
