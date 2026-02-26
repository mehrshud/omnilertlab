import { fetchGitHubRepos } from "@/lib/github";
import ClientPage from "./client-page";

export default async function HomePage() {
  const projects = await fetchGitHubRepos();
  return <ClientPage projects={projects} />;
}
