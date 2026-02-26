import { notFound } from "next/navigation";
import { fetchGitHubRepos } from "@/lib/github";
import type { Metadata } from "next";
import ProjectDetailClient from "./client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repos = await fetchGitHubRepos();
  const project = repos.find((r) => r.name === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.name} — Omnilertlab`,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const repos = await fetchGitHubRepos();
  const project = repos.find((r) => r.name === slug);

  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
