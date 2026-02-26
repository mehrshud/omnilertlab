import { NextResponse } from "next/server";

const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_USER  = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "mehrshud";
const GH_API   = "https://api.github.com";

const ghHeaders: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (GH_TOKEN) ghHeaders["Authorization"] = `Bearer ${GH_TOKEN}`;

export const revalidate = 3600;

export async function GET() {
  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(`${GH_API}/users/${GH_USER}/repos?sort=updated&per_page=30&type=public`, {
        headers: ghHeaders,
        next: { revalidate: 3600 },
      }),
      fetch(`${GH_API}/users/${GH_USER}`, {
        headers: ghHeaders,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!reposRes.ok) throw new Error(`Repos ${reposRes.status}`);
    const repos: GHRepo[] = await reposRes.json();
    const user: GHUser = await userRes.json();

    const projects = repos
      .filter((r) => !r.fork && r.name !== GH_USER)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        url: r.html_url,
        homepage: r.homepage ?? null,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language ?? "Unknown",
        topics: r.topics ?? [],
        updatedAt: r.updated_at,
        createdAt: r.created_at,
      }));

    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

    return NextResponse.json({
      projects,
      stats: {
        followers: user.followers,
        publicRepos: user.public_repos,
        totalStars,
      },
    });
  } catch (err) {
    console.error("[/api/github]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
  is_template: boolean;
}
interface GHUser {
  followers: number;
  public_repos: number;
}
