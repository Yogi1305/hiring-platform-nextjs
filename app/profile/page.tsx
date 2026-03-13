"use client"

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import api, { getProfile, updateProfile } from "../api"
import type { Education, UserProfile } from "../api"

type EditSection =
  | "social"
  | "skills"
  | "education"
  | "coding"
  | "experiences"
  | null

interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

/* ─── Reusable UI (token-aligned) ─────────────────────────────── */

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {children}
    </div>
  )
}

function CardHeader({
  title,
  badge,
  onEdit,
}: {
  title: string
  badge?: string
  onEdit?: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div className="flex items-center gap-2.5">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {badge && (
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-indigo-700">
            {badge}
          </span>
        )}
      </div>

      {onEdit && (
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 hover:text-indigo-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Edit
        </button>
      )}
    </div>
  )
}

function EditForm({
  children,
  onSave,
  onCancel,
  saving,
}: {
  children: ReactNode
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  return (
    <div className="space-y-4">
      {children}
      <div className="flex gap-2 border-t border-slate-100 pt-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {saving && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          Save Changes
        </button>

        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </label>
      {children}
    </div>
  )
}

function LightInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
    />
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}

function Banner({
  tone,
  message,
}: {
  tone: "error" | "success"
  message: string
}) {
  const styles =
    tone === "error"
      ? "border-red-100 bg-red-50 text-red-700"
      : "border-emerald-100 bg-emerald-50 text-emerald-700"

  const icon =
    tone === "error" ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    )

  return (
    <div className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${styles}`}>
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          tone === "error" ? "bg-red-100" : "bg-emerald-100"
        }`}
      >
        <svg
          className={`h-3 w-3 ${tone === "error" ? "text-red-600" : "text-emerald-600"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────────── */

export default function Profile() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [editSection, setEditSection] = useState<EditSection>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "resume">("overview")

  // Canonical profile object (keep it complete)
  const [profile, setProfile] = useState<UserProfile>({
    github: "",
    linkedin: "",
    skills: [],
    education: [],
    resume: [],
    primaryResumeIndex: 0,
    codingProfiles: [],
    experiences: [],
  })

  // Convenience mirrors (used heavily by your UI)
  const [resumes, setResumes] = useState<string[]>([])
  const [primaryResumeIndex, setPrimaryResumeIndex] = useState(0)
  const [codingProfiles, setCodingProfiles] = useState<string[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])

  // Edit states
  const [editGithub, setEditGithub] = useState("")
  const [editLinkedin, setEditLinkedin] = useState("")
  const [editSkills, setEditSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [editEducation, setEditEducation] = useState<Education[]>([])
  const [editCodingProfiles, setEditCodingProfiles] = useState<string[]>([])
  const [codingInput, setCodingInput] = useState("")
  const [editExperiences, setEditExperiences] = useState<Experience[]>([])

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getProfile()
      const data = response.data

      // Some backends use `resumes`, some use `resume`
      const resumesFromApi: string[] = data.resumes || data.resume || []

      const nextProfile: UserProfile = {
        github: data.github || "",
        linkedin: data.linkedin || "",
        skills: data.skills || [],
        education: data.education || [],
        resume: resumesFromApi,
        primaryResumeIndex: data.primaryResumeIndex || 0,
        codingProfiles: data.codingProfiles || [],
        experiences: data.experiences || [],
      }

      setProfile(nextProfile)
      setResumes(resumesFromApi)
      setPrimaryResumeIndex(nextProfile.primaryResumeIndex || 0)
      setCodingProfiles(nextProfile.codingProfiles || [])
      setExperiences((nextProfile.experiences as Experience[]) || [])
    } catch (err: unknown) {
      if (err instanceof Error && /401|unauthorized/i.test(err.message)) {
        router.push("/login")
      } else {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      }
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (section: EditSection) => {
    setEditSection(section)
    setError(null)
    setSuccess(false)

    if (section === "social") {
      setEditGithub(profile.github || "")
      setEditLinkedin(profile.linkedin || "")
    } else if (section === "skills") {
      setEditSkills([...(profile.skills || [])])
      setSkillInput("")
    } else if (section === "education") {
      setEditEducation([...(profile.education || [])])
    } else if (section === "coding") {
      setEditCodingProfiles([...codingProfiles])
      setCodingInput("")
    } else if (section === "experiences") {
      setEditExperiences([...experiences])
    }
  }

  const cancelEdit = () => {
    setEditSection(null)
    setError(null)
  }

  const saveSection = async (section: EditSection) => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      let updatedProfile: UserProfile = { ...profile }

      if (section === "social") {
        updatedProfile = {
          ...updatedProfile,
          github: editGithub,
          linkedin: editLinkedin,
        }
      } else if (section === "skills") {
        updatedProfile = { ...updatedProfile, skills: editSkills }
      } else if (section === "education") {
        updatedProfile = { ...updatedProfile, education: editEducation }
      } else if (section === "coding") {
        updatedProfile = { ...updatedProfile, codingProfiles: editCodingProfiles }
        setCodingProfiles(editCodingProfiles)
      } else if (section === "experiences") {
        updatedProfile = { ...updatedProfile, experiences: editExperiences }
        setExperiences(editExperiences)
      }

      await updateProfile(updatedProfile)
      setProfile(updatedProfile)

      setEditSection(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  /* ─── Helpers ─────────────────────────────────────────────── */

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed])
      setSkillInput("")
    }
  }
  const removeSkill = (skill: string) =>
    setEditSkills(editSkills.filter((s) => s !== skill))

  const addCodingProfile = () => {
    const trimmed = codingInput.trim()
    if (trimmed && !editCodingProfiles.includes(trimmed)) {
      setEditCodingProfiles([...editCodingProfiles, trimmed])
      setCodingInput("")
    }
  }
  const removeCodingProfile = (url: string) =>
    setEditCodingProfiles(editCodingProfiles.filter((p) => p !== url))

  const addEducation = () =>
    setEditEducation([
      ...editEducation,
      { name: "", course: "", startDate: "", endDate: "" },
    ])

  const updateEducationField = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...editEducation]
    updated[index] = { ...updated[index], [field]: value }
    setEditEducation(updated)
  }

  const removeEducation = (index: number) =>
    setEditEducation(editEducation.filter((_, i) => i !== index))

  const addExperience = () =>
    setEditExperiences([
      ...editExperiences,
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ])

  const updateExperienceField = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...editExperiences]
    updated[index] = { ...updated[index], [field]: value }
    setEditExperiences(updated)
  }

  const removeExperience = (index: number) =>
    setEditExperiences(editExperiences.filter((_, i) => i !== index))

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present"
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  const getResumeFileName = (url: string) => {
    try {
      const decoded = decodeURIComponent(url.split("/").pop() || "")
      return decoded.replace(/_/g, " ")
    } catch {
      return "Resume"
    }
  }

  const getCodingPlatformName = (url: string) => {
    try {
      const hostname = new URL(url).hostname.replace("www.", "")
      return hostname.charAt(0).toUpperCase() + hostname.slice(1)
    } catch {
      return url
    }
  }

  /* ─── Resume handlers (in-scope, fixed) ───────────────────── */

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return
    const file = event.target.files[0]
    event.target.value = ""

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // NOTE: assumes api.uploadFile(file) exists.
      // If not, implement with FormData + api.post(...).
      const response = await api.uploadFile(file)
      const filePath: string = response.data.filePath

      const nextResumes = [...resumes, filePath]
      const nextPrimary = nextResumes.length === 1 ? 0 : primaryResumeIndex

      setResumes(nextResumes)
      setPrimaryResumeIndex(nextPrimary)

      const updatedProfile: UserProfile = {
        ...profile,
        resume: nextResumes,
        primaryResumeIndex: nextPrimary,
      }

      await updateProfile(updatedProfile)
      setProfile(updatedProfile)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload resume")
    } finally {
      setSaving(false)
    }
  }

  const setPrimaryResume = async (index: number) => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      setPrimaryResumeIndex(index)

      const updatedProfile: UserProfile = {
        ...profile,
        primaryResumeIndex: index,
      }

      await updateProfile(updatedProfile)
      setProfile(updatedProfile)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to set primary resume")
    } finally {
      setSaving(false)
    }
  }

  const removeResume = async (url: string) => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const nextResumes = resumes.filter((r) => r !== url)

      const removedIndex = resumes.findIndex((r) => r === url)
      let nextPrimary = primaryResumeIndex
      if (removedIndex === primaryResumeIndex) nextPrimary = 0
      if (nextPrimary >= nextResumes.length) {
        nextPrimary = Math.max(0, nextResumes.length - 1)
      }

      setResumes(nextResumes)
      setPrimaryResumeIndex(nextPrimary)

      const updatedProfile: UserProfile = {
        ...profile,
        resume: nextResumes,
        primaryResumeIndex: nextPrimary,
      }

      await updateProfile(updatedProfile)
      setProfile(updatedProfile)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove resume")
    } finally {
      setSaving(false)
    }
  }

  /* ─── Completion ─────────────────────────────────────────── */

  const completionItems = useMemo(
    () => [
      { label: "GitHub", done: !!profile.github },
      { label: "LinkedIn", done: !!profile.linkedin },
      { label: "Skills", done: (profile.skills?.length ?? 0) > 0 },
      { label: "Education", done: (profile.education?.length ?? 0) > 0 },
      { label: "Experience", done: experiences.length > 0 },
      { label: "Resume", done: resumes.length > 0 },
    ],
    [profile, resumes.length, experiences.length]
  )

  const completionPercent = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  )

  /* ─── Loading skeleton ────────────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              {[120, 160, 140].map((h, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
                  style={{ height: h }}
                />
              ))}
            </div>
            <div className="space-y-6 lg:col-span-2">
              {[100, 200, 180].map((h, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Page ───────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header (token aligned: bg-white + border-b) */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-sm">
                  U
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  My Profile
                </div>
                <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900">
                  Professional Identity
                </h1>

                <div className="mt-2 flex items-center gap-2.5">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500">
                    {completionPercent}% complete
                  </span>
                </div>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(["overview", "resume"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                    activeTab === tab
                      ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <Banner tone="error" message={error} />}
        {success && <Banner tone="success" message="Profile updated successfully!" />}

        {/* ── Overview ───────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left column */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Profile Health */}
              <Card>
                <CardHeader title="Profile Health" badge={`${completionPercent}%`} />
                <div className="p-6 space-y-3">
                  {completionItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          item.done
                            ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {item.done ? "✓" : "–"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader
                  title="Social Links"
                  onEdit={editSection !== "social" ? () => startEdit("social") : undefined}
                />
                <div className="p-6">
                  {editSection === "social" ? (
                    <EditForm
                      onSave={() => saveSection("social")}
                      onCancel={cancelEdit}
                      saving={saving}
                    >
                      <Field label="GitHub URL">
                        <LightInput
                          value={editGithub}
                          onChange={setEditGithub}
                          placeholder="https://github.com/username"
                          type="url"
                        />
                      </Field>
                      <Field label="LinkedIn URL">
                        <LightInput
                          value={editLinkedin}
                          onChange={setEditLinkedin}
                          placeholder="https://linkedin.com/in/username"
                          type="url"
                        />
                      </Field>
                    </EditForm>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                          GitHub
                        </p>
                        {profile.github ? (
                          <a
                            className="mt-1 block truncate text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {profile.github}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-slate-400">Not provided</p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                          LinkedIn
                        </p>
                        {profile.linkedin ? (
                          <a
                            className="mt-1 block truncate text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {profile.linkedin}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-slate-400">Not provided</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Coding Profiles */}
              <Card>
                <CardHeader
                  title="Coding Profiles"
                  badge={codingProfiles.length ? `${codingProfiles.length}` : undefined}
                  onEdit={editSection !== "coding" ? () => startEdit("coding") : undefined}
                />
                <div className="p-6">
                  {editSection === "coding" ? (
                    <EditForm
                      onSave={() => saveSection("coding")}
                      onCancel={cancelEdit}
                      saving={saving}
                    >
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={codingInput}
                          onChange={(e) => setCodingInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addCodingProfile()
                            }
                          }}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          placeholder="https://leetcode.com/username"
                        />
                        <button
                          type="button"
                          onClick={addCodingProfile}
                          className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-2">
                        {editCodingProfiles.map((url) => (
                          <div
                            key={url}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
                          >
                            <span className="truncate text-sm text-slate-600">
                              {getCodingPlatformName(url)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCodingProfile(url)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </EditForm>
                  ) : codingProfiles.length > 0 ? (
                    <div className="space-y-2">
                      {codingProfiles.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
                        >
                          <span className="truncate">{getCodingPlatformName(url)}</span>
                          <span className="text-slate-400">Open</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No coding profiles added yet." />
                  )}
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Skills */}
              <Card>
                <CardHeader
                  title="Skills"
                  badge={profile.skills?.length ? `${profile.skills.length} skills` : undefined}
                  onEdit={editSection !== "skills" ? () => startEdit("skills") : undefined}
                />
                <div className="p-6">
                  {editSection === "skills" ? (
                    <EditForm
                      onSave={() => saveSection("skills")}
                      onCancel={cancelEdit}
                      saving={saving}
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addSkill()
                            }
                          }}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          placeholder="Type a skill and press Enter…"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          Add
                        </button>
                      </div>

                      {editSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {editSkills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="rounded-full text-indigo-400 hover:text-red-500"
                              >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </EditForm>
                  ) : profile.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No skills added yet." />
                  )}
                </div>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader
                  title="Experience"
                  badge={experiences.length ? `${experiences.length}` : undefined}
                  onEdit={editSection !== "experiences" ? () => startEdit("experiences") : undefined}
                />
                <div className="p-6">
                  {editSection === "experiences" ? (
                    <EditForm
                      onSave={() => saveSection("experiences")}
                      onCancel={cancelEdit}
                      saving={saving}
                    >
                      <button
                        type="button"
                        onClick={addExperience}
                        className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        Add Experience
                      </button>

                      <div className="space-y-4">
                        {editExperiences.map((exp, i) => (
                          <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                Experience #{i + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeExperience(i)}
                                className="text-xs font-semibold uppercase tracking-widest text-red-500 hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Title
                                </label>
                                <LightInput
                                  value={exp.title}
                                  onChange={(v) => updateExperienceField(i, "title", v)}
                                  placeholder="e.g., Senior Engineer"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Company
                                </label>
                                <LightInput
                                  value={exp.company}
                                  onChange={(v) => updateExperienceField(i, "company", v)}
                                  placeholder="e.g., Acme Inc."
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Location
                                </label>
                                <LightInput
                                  value={exp.location}
                                  onChange={(v) => updateExperienceField(i, "location", v)}
                                  placeholder="e.g., New York, NY"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Start Date
                                </label>
                                <LightInput
                                  type="date"
                                  value={exp.startDate}
                                  onChange={(v) => updateExperienceField(i, "startDate", v)}
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  End Date
                                </label>
                                <LightInput
                                  type="date"
                                  value={exp.endDate}
                                  onChange={(v) => updateExperienceField(i, "endDate", v)}
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Description
                                </label>
                                <textarea
                                  value={exp.description}
                                  onChange={(e) => updateExperienceField(i, "description", e.target.value)}
                                  rows={3}
                                  className="w-full resize-none rounded-lg border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                  placeholder="Describe your role and achievements…"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </EditForm>
                  ) : experiences.length ? (
                    <div className="space-y-5">
                      {experiences.map((exp, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800">
                                {exp.title || "Job Title"}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {exp.company}
                                {exp.location ? ` · ${exp.location}` : ""}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
                              {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No experience added yet." />
                  )}
                </div>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader
                  title="Education"
                  badge={profile.education?.length ? `${profile.education.length}` : undefined}
                  onEdit={editSection !== "education" ? () => startEdit("education") : undefined}
                />
                <div className="p-6">
                  {editSection === "education" ? (
                    <EditForm
                      onSave={() => saveSection("education")}
                      onCancel={cancelEdit}
                      saving={saving}
                    >
                      <button
                        type="button"
                        onClick={addEducation}
                        className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        Add Education
                      </button>

                      <div className="space-y-4">
                        {editEducation.map((edu, i) => (
                          <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                Education #{i + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeEducation(i)}
                                className="text-xs font-semibold uppercase tracking-widest text-red-500 hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Institution
                                </label>
                                <LightInput
                                  value={edu.name}
                                  onChange={(v) => updateEducationField(i, "name", v)}
                                  placeholder="e.g., MIT"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Course / Degree
                                </label>
                                <LightInput
                                  value={edu.course}
                                  onChange={(v) => updateEducationField(i, "course", v)}
                                  placeholder="e.g., Computer Science"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  Start Date
                                </label>
                                <LightInput
                                  type="date"
                                  value={edu.startDate}
                                  onChange={(v) => updateEducationField(i, "startDate", v)}
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-500">
                                  End Date
                                </label>
                                <LightInput
                                  type="date"
                                  value={edu.endDate}
                                  onChange={(v) => updateEducationField(i, "endDate", v)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {editEducation.length === 0 && (
                        <p className="text-sm text-slate-500">
                          Click “Add Education” to get started.
                        </p>
                      )}
                    </EditForm>
                  ) : profile.education?.length ? (
                    <div className="space-y-4">
                      {profile.education.map((edu, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                          <h3 className="text-lg font-semibold text-slate-800">
                            {edu.name || "Institution"}
                          </h3>
                          <p className="text-sm text-slate-600">{edu.course || "Course"}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No education added yet." />
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── Resume Tab (styled + conditional) ───────────────── */}
        {activeTab === "resume" && (
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Resume"
                badge={resumes.length ? `${resumes.length} uploaded` : "No resume"}
              />
              <div className="p-6">
                <p className="text-sm text-slate-500">
                  Upload your latest resume. If you have multiple, set one as{" "}
                  <span className="font-semibold text-slate-700">Primary</span>.
                </p>

                <label className="mt-5 block">
                  <div
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-12 text-center transition-colors ${
                      saving
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-300 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                      <svg
                        className="h-6 w-6 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16.5V3m0 0l-4.5 4.5M12 3l4.5 4.5M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {saving ? "Uploading…" : "Click to upload a resume"}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        PDF, DOC, DOCX
                      </p>
                    </div>
                  </div>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={saving}
                    className="sr-only"
                  />
                </label>
              </div>
            </Card>

            {resumes.length > 0 ? (
              <Card>
                <CardHeader title="Your uploaded resumes" />
                <div className="divide-y divide-slate-100">
                  {resumes.map((url, idx) => {
                    const isPrimary = idx === primaryResumeIndex
                    return (
                      <div
                        key={url}
                        className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {getResumeFileName(url)}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            {isPrimary ? (
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                                Primary
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-slate-600">
                                Secondary
                              </span>
                            )}

                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                              View
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryResume(idx)}
                              disabled={saving}
                              className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
                            >
                              Set Primary
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => removeResume(url)}
                            disabled={saving}
                            className="rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-500 disabled:opacity-60"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ) : (
              <EmptyState message="No resumes uploaded yet. Upload one above to get started." />
            )}
          </div>
        )}
      </main>
    </div>
  )
}