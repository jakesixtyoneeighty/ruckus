import React from "react";
import { redirect } from "next/navigation";
import { StudioCanvas } from "@/components/studio/studio-canvas";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session, no studio — back to the landing/login gate.
  if (!user) {
    redirect("/");
  }

  const { id } = await params;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0b0d]">
      <StudioCanvas projectId={id} />
    </div>
  );
}
