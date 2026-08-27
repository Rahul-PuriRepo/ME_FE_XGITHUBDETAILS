import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://api.github.com/users";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchUser = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a GitHub username.");
      setUser(null);
      return;
    }

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/${encodeURIComponent(trimmedUsername)}`
      );

      setUser(response.data);
    } catch (err) {
      setUser(null);
      setError("Could not fetch the GitHub user.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchUser();
  };

  return (
    <div className="app">
      <div className="finder-card">
        <h1>GitHub User Finder</h1>

        <p className="subtitle">
          Search a GitHub username to see profile details.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="search-row">
            <input
              type="text"
              name="username"
              placeholder="e.g. torvalds, gagarin, octocat"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              Search
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="status-message">
            Loading...
          </div>
        )}

        {!loading && !error && !user && (
          <div className="empty-message">
            No user yet. Try searching for “octocat”.
          </div>
        )}

        {user && !loading && (
          <div className="profile">
            <img
              className="avatar"
              src={user.avatar_url}
              alt={user.name || user.login}
            />

            <div className="profile-content">
              <div className="name-row">
                <h2>{user.name || user.login}</h2>
                <span className="login">@{user.login}</span>
              </div>

              {user.bio && <p className="bio">{user.bio}</p>}

              <div className="stats">
                <span>
                  <strong>{user.public_repos}</strong> Repos
                </span>

                <span>
                  <strong>{user.followers}</strong> Followers
                </span>

                <span>
                  <strong>{user.following}</strong> Following
                </span>
              </div>

              <div className="details">
                {user.location && <span>📍 {user.location}</span>}
                {user.company && <span>🏢 {user.company}</span>}

                {user.blog && (
                  <a
                    href={user.blog}
                    target="_blank"
                    rel="noreferrer"
                  >
                    🔗 {user.blog}
                  </a>
                )}

                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  🐙 View on GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
