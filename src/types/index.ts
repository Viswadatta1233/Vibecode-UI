// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Problem types
export interface TestCase {
  _id: string;
  input: string;
  output: string;
}

export interface CodeStub {
  _id: string;
  language: 'JAVA' | 'PYTHON' | 'CPP';
  startSnippet: string;
  endSnippet: string;
  userSnippet: string;
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'Medium' | 'Hard';
  category?: string;
  testcases: TestCase[];
  codeStubs: CodeStub[];
  editorial?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  __v: number;
}

// Submission types
export interface SubmissionResult {
  testcase: TestCase;
  output: string;
  passed: boolean;
  error?: string;
}

export interface Submission {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  language: 'JAVA' | 'PYTHON' | 'CPP';
  status: 'Pending' | 'Running' | 'Success' | 'RE' | 'TLE' | 'MLE' | 'WA' | 'Failed';
  percentage?: number;
  passedCount?: number;
  totalCount?: number;
  results?: SubmissionResult[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubmissionRequest {
  problemId: string;
  code: string;
  language: 'JAVA' | 'PYTHON' | 'CPP';
}

// WebSocket types
export interface SubmissionUpdate {
  status: string;
  percentage?: number;
  passedCount?: number;
  totalCount?: number;
  progress?: {
    completed: number;
    total: number;
  };
  results?: SubmissionResult[];
  error?: string;
} 