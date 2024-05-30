import { Octokit } from '@octokit/core';

const octokit = new Octokit();

const fetchStats = async (username) => {
  try {
    // Fetch user data from GitHub API
    const userData = await octokit.request('GET /users/{username}', {
      username,
    });

    // fetch all user repositories from GitHub API
    const repositories = await fetchAllRepositories(username);

    // calculate aggregated stats
    const totalRepoCount = repositories.length;
    const totalForkCount = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languageCounts = {};

    repositories.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({ language, count }));

    // return aggregated stats
    return {
      username: userData.data.login,
      totalRepoCount,
      totalForkCount,
      languages: sortedLanguages,
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    throw error;
  }
};

// helper function to fetch all user repositories
async function fetchAllRepositories(username) {
  let repositories = [];
  let page = 1;
  const perPage = 100; // Max per page GitHub API allows

  while (true) {
    try {
      const response = await octokit.request('GET /users/{username}/repos', {
        username,
        per_page: perPage,
        page,
      });

      repositories = [...repositories, ...response.data];

      if (response.data.length < perPage) {
        // If less than perPage repositories fetched, it means we reached the last page
        break;
      }

      page++;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  return repositories;
}

export default fetchStats;
