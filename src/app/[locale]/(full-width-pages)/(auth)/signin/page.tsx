import SignIn from "@/components/others/auth/sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CoreiCode Team",
  description: "Sign in to your CoreiCode Team account.",
};

export default function SignInPage() {
  return <SignIn />;
}
