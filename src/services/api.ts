import axios from 'axios';
import type { 
  Problem, 
  Submission, 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials, 
  CreateSubmissionRequest 
} from '../types';

// API base URLs - use environment variables with fallbacks
const PROBLEM_SERVICE_URL = import.meta.env.VITE_PROBLEM_SERVICE_URL || 'https://43.204.79.92/api';
const SUBMISSION_SERVICE_URL = import.meta.env.VITE_SUBMISSION_SERVICE_URL || 'https://vibecodesgs.duckdns.org/api';

// Create axios instances
const problemApi = axios.create({
  baseURL: PROBLEM_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const submissionApi = axios.create({
  baseURL: SUBMISSION_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
const setAuthToken = (token: string) => {
  if (token) {
    problemApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    submissionApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete problemApi.defaults.headers.common['Authorization'];
    delete submissionApi.defaults.headers.common['Authorization'];
  }
};

// Auth API
export const authAPI = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await problemApi.post('/auth/signup', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await problemApi.post('/auth/login', credentials);
    return response.data;
  },
};

// Problem API
export const problemAPI = {
  getProblems: async (): Promise<Problem[]> => {
    const response = await problemApi.get('/problems');
    return response.data;
  },

  getProblemById: async (id: string): Promise<Problem> => {
    const response = await problemApi.get(`/problems/${id}`);
    return response.data;
  },

  createProblem: async (problem: Partial<Problem>): Promise<Problem> => {
    const response = await problemApi.post('/problems', problem);
    return response.data;
  },

  updateProblem: async (id: string, problem: Partial<Problem>): Promise<Problem> => {
    const response = await problemApi.put(`/problems/${id}`, problem);
    return response.data;
  },

  deleteProblem: async (id: string): Promise<{ message: string }> => {
    const response = await problemApi.delete(`/problems/${id}`);
    return response.data;
  },
};

// Submission API
export const submissionAPI = {
  createSubmission: async (submission: CreateSubmissionRequest): Promise<Submission> => {
    const response = await submissionApi.post('/submissions/create', submission, {
      params: { problemId: submission.problemId }
    });
    return response.data;
  },

  getSubmissionById: async (id: string): Promise<Submission> => {
    const response = await submissionApi.get(`/submissions/${id}`);
    return response.data;
  },

  getUserSubmissions: async (): Promise<Submission[]> => {
    const response = await submissionApi.get('/submissions/user');
    return response.data;
  },
};

export { setAuthToken }; 