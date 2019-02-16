type Commit = {
  message: string;
};

export interface Provider {
  isLoggedIn?: () => boolean;
  logIn?: () => Promise<null>;
  getCommits: (path: string, repo?: string, sha?: string) => Promise<Commit[]>;
}
