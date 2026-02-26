import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "mehrshud";

const octokit = new Octokit({ auth: GITHUB_TOKEN || undefined });

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage?: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  languages: string[];
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  openIssues: number;
  size: number;
  defaultBranch: string;
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: GITHUB_USERNAME,
      sort: 'updated',
      per_page: 12, // Top 12 to prevent N+1 API limits!
      type: 'owner',
    });

    // Fetch commit activity for each repo (parallel)
    const enriched = await Promise.all(
      repos.map(async (repo) => {
        // Add safe fallback for language API limits
        try {
          const { data: langs } = await octokit.rest.repos.listLanguages({
            owner: GITHUB_USERNAME,
            repo: repo.name,
          });
          return {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || "No description provided.",
            url: repo.html_url,
            homepage: repo.homepage || undefined,
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            watchers: repo.watchers_count || 0,
            language: repo.language || null,
            languages: Object.keys(langs).slice(0, 4),
            topics: repo.topics || [],
            createdAt: repo.created_at || "",
            updatedAt: repo.updated_at || "",
            pushedAt: repo.pushed_at || "",
            openIssues: repo.open_issues_count || 0,
            size: repo.size || 0,
            defaultBranch: repo.default_branch || "main",
          };
        } catch (err) {
          return {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || "No description provided.",
            url: repo.html_url,
            homepage: repo.homepage || undefined,
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            watchers: repo.watchers_count || 0,
            language: repo.language || null,
            languages: repo.language ? [repo.language] : [],
            topics: repo.topics || [],
            createdAt: repo.created_at || "",
            updatedAt: repo.updated_at || "",
            pushedAt: repo.pushed_at || "",
            openIssues: repo.open_issues_count || 0,
            size: repo.size || 0,
            defaultBranch: repo.default_branch || "main",
          };
        }
      })
    );

    return enriched;
  } catch (err) {
    return [];
  }
}
