export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  codeStubs: CodeStub[];
  testcases: TestCase[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  editorial?: string;
}

export interface CodeStub {
  language: string;
  startSnippet: string;
  endSnippet: string;
  userSnippet: string;
}

export interface TestCase {
  _id: string;
  input: string;
  output: string;
}

export interface Submission {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Success' | 'WA' | 'RE' | 'TLE' | 'MLE';
  results?: TestResult[];
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  testcase: TestCase;
  output: string;
  passed: boolean;
  executionTime?: number;
  memory?: number;
  error?: string;
  expected?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface CreateSubmissionRequest {
  problemId: string;
  userCode: string;
  language: string;
} 