import Error404 from "@/components/main/pages/error-404";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | CoreiCode Team",
  description:
    "The requested CoreiCode Team page could not be found.",
};

export default function Error404Page() {
  return <Error404 />;
}
