const API_ROOT_API = 'https://api.github.com';

export const API_URL = {
  USER_REPOSITORIES: (username) => `${API_ROOT_API}/users/${username}/repos`,
};
