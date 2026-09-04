import React from "react";
import { StudioCanvas } from "@/components/studio/studio-canvas";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#07080d]">
      <StudioCanvas projectId={id} />
    </div>
  );
}
