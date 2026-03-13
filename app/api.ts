import { Job } from "./pages/Jobs"

// Minimal fetch-based API wrapper to replace axios usage
export const Baseurl = 'http://localhost:3001'
// export const Baseurl = 'https://hireme-backend-1.onrender.com'

async function request<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const isAbsolute = /^https?:\/\//i.test(path)
  const url = isAbsolute ? path : `${Baseurl}${path.startsWith('/') ? path : `/${path}`}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  }

  const body = init.body && typeof init.body !== 'string' ? JSON.stringify(init.body) : init.body

  const res = await fetch(url, {
    ...init,
    headers,
    body,
    credentials: 'include',
  })

  if (res.status === 204) return null as unknown as T

  let data: any
  try {
    data = await res.json()
  } catch (err) {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return null as unknown as T
  }

  if (!res.ok) {
    const message = data?.message || data || `HTTP ${res.status}`
    throw new Error(message)
  }

  return data as T
}

const api = {
  async get<T = any>(path: string) {
    const data = await request<T>(path, { method: 'GET' })
    return { data }
  },
  async post<T = any>(path: string, body?: any) {
    const data = await request<T>(path, { method: 'POST', body })
    return { data }
  },
  async patch<T = any>(path: string, body?: any) {
    const data = await request<T>(path, { method: 'PATCH', body })
    return { data }
  },
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
  resume?: string[]
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
  }
}

export interface Applicant {
  applicationId: string
  status: string
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
