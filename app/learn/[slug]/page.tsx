import { notFound } from "next/navigation";
import LoginForm from "@/components/learn/login-form";
import RoadmapView from "@/components/learn/roadmap";
import { getProgress, getRoadmap, isOwner } from "@/lib/learn/server";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Owner first, so a 404 never confirms which roadmaps exist
  if (!(await isOwner())) return <LoginForm />;

  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) notFound();

  return (
    <RoadmapView roadmap={roadmap} initialProgress={await getProgress(slug)} />
  );
}
