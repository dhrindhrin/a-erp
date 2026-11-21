import { AuthForm } from "@/components/auth-form";
import { signup } from "@/app/actions/auth";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return <AuthForm mode="signup" action={signup} />;
}
