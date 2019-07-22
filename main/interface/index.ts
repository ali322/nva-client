export interface Package {
  name: string;
  current: string;
  latest: string;
}

export interface Project {
  name: string;
  path: string;
  repo: string;
}

export interface GenerateProject extends Project {
  answers: Record<string, any>;
}
