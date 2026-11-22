import SignUpForm from "@/components/others/auth/sign-up";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | CoreiCode Team",
  description: "Create your CoreiCode Team account.",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
