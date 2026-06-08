import { redirect } from "next/navigation";

// Root route redirects to the marketing landing page
export default function RootPage() {
  redirect("/");
}
