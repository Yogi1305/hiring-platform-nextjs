import type { Job } from "./_pages/Jobs"
import axios, { type AxiosInstance } from "axios"

// Axios API client

export const Baseurl = 'http://localhost:3001'
// export const Baseurl = 'https://hireme-i1re.onrender.com'

type ApiClient = AxiosInstance & {
  uploadFile: (file: File) => Promise<any>
}

const api = axios.create({
  baseURL: Baseurl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}) as ApiClient

api.uploadFile = async (file: File): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export default api

// --- Types and API functions ---

// Question Set types
export interface Question {
  questionText: string
  options: string[]
  correctAnswer: string
}

export interface QuestionSet {
  id: string
  setName: string
  questions: Question[]
}

// Add an existing question to a test
export const addExistingQuestionToTest = async (testId: string, questionId: string) => {
  const res = await api.post(`/questions/tests/${testId}/add-existing/${questionId}`)
  return res.data
}
export const fetchAllJobs = async (): Promise<Job[]> => {
  const res = await api.get('/jobs/all')
  return res.data.data || res.data
}

// Toggle public/private for a job
export const toggleJobPublic = async (jobId: string) => {
  const res = await api.post(`/jobs/${jobId}/public`)
  return res.data
}
// Create a QuestionSet
export const createQuestionSet = async (setName: string) => {
  const res = await api.post('/questionset', { setName })
  return res.data
}

// Fetch all QuestionSets with questions
export const fetchAllQuestionSets = async (): Promise<QuestionSet[]> => {
  const res = await api.get('/questionset')
  return res.data
}

// Fetch a single QuestionSet with questions
export const fetchQuestionSet = async (id: string): Promise<QuestionSet> => {
  const res = await api.get(`/questionset/${id}`)
  return res.data
}

// Add a question to a QuestionSet
export const addQuestionToSet = async (setId: string, question: Question) => {
  const res = await api.post(`/questionset/${setId}/question`, question)
  return res.data
}

// Profile types
export interface Education {
  name: string
  course: string
  startDate: string
  endDate: string
}

export interface UserProfile {
  github?: string
  linkedin?: string
  skills?: string[]
  education?: Education[]
  resumes?: string[]
  primaryResumeIndex?: number
  codingProfiles?: { platform: string; url: string }[]
  experiences?: { company: string; role: string; startDate: string; endDate: string }[]
}

// Profile API functions
export const getProfile = () => api.get<UserProfile>('/user/profile')

export const updateProfile = (data: UserProfile) => api.post('/user/profile/update', data)

// Company Jobs with Applicants types
export interface ApplicantUser {
  id: string
  name: string
  email: string
  profile?: {
    github?: string
    linkedin?: string
    skills?: string[]
    resumes?: string[]
    codingProfiles?: { platform: string; url: string }[]
    experiences?: { company: string; role: string; startDate: string; endDate: string }[]
  }
}

export interface Applicant {
  applicationId: string
  status: string
  notes?: string
  testScore: string
  correctAnswers: number
  incorrectAnswers: number
  appliedAt: string
  user: ApplicantUser
}

export interface JobWithApplicants {
  id: string
  title: string
  applicantCount: number
  applicants: Applicant[]
}

export interface CompanyJobsResponse {
  message: string
  data: {
    jobs: JobWithApplicants[]
  }
}

export const getCompanyJobsWithApplicants = () => api.get<CompanyJobsResponse>('/applications/company/jobs')

export const updateApplicationStatus = (applicationId: string, status: string, notes?: string) =>
  api.patch(`/applications/${applicationId}/status`, { status, notes })

// Employee types
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  companyCode: string
  createdAt: string
}

export interface EmployeesResponse {
  message: string
  data: Employee[]
}

export const getCompanyEmployees = () => api.get<EmployeesResponse>('/employees/company')

// User Application types
export interface ApplicationCompany {
  id: string
  name: string
  logo: string
}

export interface ApplicationJob {
  id: string
  title: string
  description: string
  location: string
  salary: number
  jobType: string
  jobCategory: string
  lastDateToApply: string
  company: ApplicationCompany
}

export interface UserApplication {
  id: string
  status: string
  notes?: string
  formResponse: Record<string, string>
  testAnswered: boolean
  totalquestions: number
  correctedanswers: string[]
  incorrectanswers: string[]
  createdAt: string
  updatedAt: string
  job: ApplicationJob
  form: { id: string }
}

export const getUserApplications = () => api.get<UserApplication[]>('/user/applications')

export interface CheckAuthResponse {
  message: string
  success: boolean
}

export const checkUserAuth = (cookieHeader?: string) =>
  api.get<CheckAuthResponse>('/user/check-auth', cookieHeader ? { headers: { cookie: cookieHeader } } : undefined)

export const logoutUser = () => api.post('/user/logout')

export interface AppNotification {
  id: string
  userId: string
  companyName: string
  jobTitle: string
  status: string
  isRead: boolean
  message: string
  createdAt: string
  updatedAt: string
}

export interface NotificationsResponse {
  message: string
  data: AppNotification[]
}

export const getMyNotifications = () => api.get<NotificationsResponse>('/notifications/my')

export const markNotificationAsRead = (notificationId: string) =>
  api.patch(`/notifications/${notificationId}/mark-as-read`)

export const markAllNotificationsAsRead = () => api.patch('/notifications/mark-all-as-read')

// Form fields types
export interface FormField {
  id: string;
  label: string;
  type: any; // 'text' | 'email' | 'number' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'date';
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select fields
}

export async function createForm(jobId: string, formFields: FormField[]) {
  const response = await api.post('/forms/create', {
    jobId,
    form: { fields: formFields },
  });
  return response.data;
}
