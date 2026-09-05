import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LandingGate } from "@/components/auth/landing-gate";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already signed in? Straight to the app.
  if (user) {
    redirect("/");
  }

  // Otherwise the same on-brand gate (defaults to signup tab, toggle to sign in).
  return <LandingGate />;
}
