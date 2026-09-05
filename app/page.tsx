import { createClient } from "@/lib/supabase/server";
import { HomeClient } from "@/components/studio/home-client";
import { LandingGate } from "@/components/auth/landing-gate";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated visitors always get the on-brand landing/login gate —
  // nothing past this screen without a session.
  if (!user) {
    return <LandingGate />;
  }

  return <HomeClient initialUser={user} />;
}
