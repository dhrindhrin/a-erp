import { AuthForm } from "@/components/auth-form";
import { login } from "@/app/actions/auth";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return <AuthForm mode="login" action={login} />;
}
