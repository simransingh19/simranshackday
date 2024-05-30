import React from 'react';

const GitHubStats = ({ stats }) => {
  const { username, totalRepoCount, totalForkCount, languages } = stats;

  return (
    <div>
      <h2>GitHub Stats for {username}</h2>
      <div>
        <p>Total Repositories: {totalRepoCount}</p>
        <p>Total Forks: {totalForkCount}</p>
        <div>
          <h3>Languages Used:</h3>
          <ul>
            {languages.map(({ language, count }) => (
              <li key={language}>
                {language}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;