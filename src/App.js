import { useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import GitHubStats from './components/GitHubStats';
import fetchStats from './utils/fetchStats';
import RepoList from './components/RepoList';
import './App.css';

//pagination not working 

function App() {
  const [avatarURL, setAvatarURL] = useState('');
  const [githubUsername, setGitHubUsername] = useState('');
  const [repoData, setRepoData] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [stats, setStats] = useState(null);
  //new
  const [currentPage, setCurrentPage] = useState(1);
  const [repositoriesPerPage, setRepositoriesPerPage] = useState(10);
  const [totalRepositories, setTotalRepositories] = useState([]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    console.log('new input')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // new userInput, currentPage, repositoriesPerPage)
      const fetchedStats = await fetchStats(userInput, currentPage, repositoriesPerPage);
      setStats(fetchedStats);
      // new
      setTotalRepositories(fetchedStats.repositories)
      fetchUserData(userInput);
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchUserData = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const userData = await response.json();
      setAvatarURL(userData.avatar_url);
      setGitHubUsername(userData.login);
      fetchUserRepos(username);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserRepos = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const repoData = await response.json();
      const list = repoData.map((item) => (
        <div className="text-center" key={item.id}>
          <a target="_blank" href={item.svn_url} rel="noreferrer">
            {item.name}
          </a>
        </div>
      ));
      setRepoData(list);
    } catch (error) {
      console.error('Error fetching user repositories:', error);
    }
  };

  return (
    <div className="App w-100 min-vh-100 justify-content-center align-items-center d-flex">
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={userInput} onChange={handleInputChange} placeholder="Enter GitHub username" />
          <Button type="submit" variant="primary">
            Get Stats
          </Button>
        </form>
        {stats && <GitHubStats stats={stats} />}
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src={avatarURL} />
          <Card.Body>
            <Card.Title>{githubUsername}</Card.Title>
           {/* <Button variant="primary" onClick={() => fetchUserRepos(githubUsername)}>
              List my public repos!
  </Button> */}
          </Card.Body>
        </Card>
        {repoData}
      </div>
    </div>
  );
}

export default App;
