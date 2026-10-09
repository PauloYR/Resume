import { site } from '@config/site';
import { loadGithubActivity, type GithubActivity } from './github';

/** Build-time entry used by pages. GITHUB_TOKEN never leaves this module. */
export async function getSiteGithubActivity(): Promise<GithubActivity | null> {
  return loadGithubActivity({
    user: site.githubUser,
    token: process.env.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN,
  });
}
