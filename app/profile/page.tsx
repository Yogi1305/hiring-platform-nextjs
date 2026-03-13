"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, updateProfile } from '../api'
import type { Education, UserProfile } from '../api'

type EditSection = 'social' | 'skills' | 'education' | 'coding' | 'experiences' | null

interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

function Profile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [editSection, setEditSection] = useState<EditSection>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'resume'>('overview')

  const [profile, setProfile] = useState<UserProfile>({
    github: '',
    linkedin: '',
    skills: [],
    education: [],
    resume: [],
    primaryResumeIndex: 0,
    codingProfiles: [],
    experiences: [],
  })

  const [resumes, setResumes] = useState<string[]>([])
  const [primaryResumeIndex, setPrimaryResumeIndex] = useState(0)
  const [codingProfiles, setCodingProfiles] = useState<string[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])

  // Edit states
  const [editGithub, setEditGithub] = useState('')
  const [editLinkedin, setEditLinkedin] = useState('')
  const [editSkills, setEditSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [editEducation, setEditEducation] = useState<Education[]>([])
  const [editCodingProfiles, setEditCodingProfiles] = useState<string[]>([])
  const [codingInput, setCodingInput] = useState('')
  const [editExperiences, setEditExperiences] = useState<Experience[]>([])

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await getProfile()
      const data = response.data
      setProfile({
        github: data.github || '',
        linkedin: data.linkedin || '',
        skills: data.skills || [],
        education: data.education || [],
      })
      setResumes(data.resumes || [])
      setPrimaryResumeIndex(data.primaryResumeIndex || 0)
      setCodingProfiles(data.codingProfiles || [])
      setExperiences(data.experiences || [])
    } catch (err: unknown) {
      if (err instanceof Error && /401|unauthorized/i.test(err.message)) {
        router.push('/login')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (section: EditSection) => {
    setEditSection(section)
    setError(null)
    setSuccess(false)
    if (section === 'social') {
      setEditGithub(profile.github || '')
      setEditLinkedin(profile.linkedin || '')
    } else if (section === 'skills') {
      setEditSkills([...(profile.skills || [])])
      setSkillInput('')
    } else if (section === 'education') {
      setEditEducation([...(profile.education || [])])
    } else if (section === 'coding') {
      setEditCodingProfiles([...codingProfiles])
      setCodingInput('')
    } else if (section === 'experiences') {
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
      if (section === 'social') {
        updatedProfile = { ...updatedProfile, github: editGithub, linkedin: editLinkedin }
      } else if (section === 'skills') {
        updatedProfile = { ...updatedProfile, skills: editSkills }
      } else if (section === 'education') {
        updatedProfile = { ...updatedProfile, education: editEducation }
      } else if (section === 'coding') {
        setCodingProfiles(editCodingProfiles)
      } else if (section === 'experiences') {
        setExperiences(editExperiences)
      }
      await updateProfile(updatedProfile)
      setProfile(updatedProfile)
      setEditSection(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed])
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => setEditSkills(editSkills.filter((s) => s !== skill))

  const addCodingProfile = () => {
    const trimmed = codingInput.trim()
    if (trimmed && !editCodingProfiles.includes(trimmed)) {
      setEditCodingProfiles([...editCodingProfiles, trimmed])
      setCodingInput('')
    }
  }

  const removeCodingProfile = (url: string) =>
    setEditCodingProfiles(editCodingProfiles.filter((p) => p !== url))

  const addEducation = () =>
    setEditEducation([...editEducation, { name: '', course: '', startDate: '', endDate: '' }])

  const updateEducationField = (index: number, field: keyof Education, value: string) => {
    const updated = [...editEducation]
    updated[index] = { ...updated[index], [field]: value }
    setEditEducation(updated)
  }

  const removeEducation = (index: number) =>
    setEditEducation(editEducation.filter((_, i) => i !== index))

  const addExperience = () =>
    setEditExperiences([
      ...editExperiences,
      { title: '', company: '', location: '', startDate: '', endDate: '', description: '' },
    ])

  const updateExperienceField = (index: number, field: keyof Experience, value: string) => {
    const updated = [...editExperiences]
    updated[index] = { ...updated[index], [field]: value }
    setEditExperiences(updated)
  }

  const removeExperience = (index: number) =>
    setEditExperiences(editExperiences.filter((_, i) => i !== index))

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getResumeFileName = (url: string) => {
    try {
      const decoded = decodeURIComponent(url.split('/').pop() || '')
      return decoded.replace(/_/g, ' ')
    } catch {
      return 'Resume'
    }
  }

  const getCodingPlatformName = (url: string) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '')
      return hostname.charAt(0).toUpperCase() + hostname.slice(1)
    } catch {
      return url
    }
  }

  const completionItems = [
    { label: 'GitHub', done: !!profile.github },
    { label: 'LinkedIn', done: !!profile.linkedin },
    { label: 'Skills', done: (profile.skills?.length ?? 0) > 0 },
    { label: 'Education', done: (profile.education?.length ?? 0) > 0 },
    { label: 'Experience', done: experiences.length > 0 },
    { label: 'Resume', done: resumes.length > 0 },
  ]
  const completionPercent = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  )

  // ── Loading ──────────────────────────────────────────────────────
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
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-1">
              {[120, 160, 140].map((h, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
                  style={{ height: h }}
                />
              ))}
            </div>
            <div className="space-y-5 lg:col-span-2">
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

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Left: avatar + info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-200">
                  U
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                    My Profile
                  </span>
                </div>
                <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                  Professional Identity
                </h1>
                {/* Completion bar */}
                <div className="mt-2 flex items-center gap-2.5">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {completionPercent}% complete
                  </span>
                </div>
              </div>
            </div>

            {/* Right: tab switcher */}
            <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
              {(['overview', 'resume'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
                    activeTab === tab
                      ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">

        {/* Notifications */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
              <svg className="h-3 w-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 mt-0.5">
              <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-emerald-700">Profile updated successfully!</p>
          </div>
        )}

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === 'overview' && (
          <div className="grid gap-5 lg:grid-cols-3">

            {/* ── Left Column ── */}
            <div className="flex flex-col gap-5 lg:col-span-1">

              {/* Profile Health */}
              <Card>
                <CardHeader title="Profile Health" />
                <div className="p-5 space-y-2.5">
                  {completionItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                          item.done
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {item.done ? '✓' : '–'}
                      </span>
                    </div>
                  ))}
                  {/* Overall bar */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-400">Overall</span>
                      <span className="text-xs font-semibold text-indigo-600">{completionPercent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader
                  title="Social Links"
                  onEdit={editSection !== 'social' ? () => startEdit('social') : undefined}
                />
                <div className="p-5">
                  {editSection === 'social' ? (
                    <EditForm onSave={() => saveSection('social')} onCancel={cancelEdit} saving={saving}>
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
                      <SocialRow
                        icon={
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        }
                        bgColor="bg-slate-800"
                        label="GitHub"
                        value={profile.github}
                      />
                      <SocialRow
                        icon={
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        }
                        bgColor="bg-blue-600"
                        label="LinkedIn"
                        value={profile.linkedin}
                      />
                    </div>
                  )}
                </div>
              </Card>

              {/* Coding Profiles */}
              <Card>
                <CardHeader
                  title="Coding Profiles"
                  badge={codingProfiles.length ? `${codingProfiles.length}` : undefined}
                  onEdit={editSection !== 'coding' ? () => startEdit('coding') : undefined}
                />
                <div className="p-5">
                  {editSection === 'coding' ? (
                    <EditForm onSave={() => saveSection('coding')} onCancel={cancelEdit} saving={saving}>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={codingInput}
                          onChange={(e) => setCodingInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCodingProfile() } }}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          placeholder="https://leetcode.com/username"
                        />
                        <button
                          type="button"
                          onClick={addCodingProfile}
                          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editCodingProfiles.map((url) => (
                          <div
                            key={url}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                          >
                            <span className="truncate text-sm text-slate-600">
                              {getCodingPlatformName(url)}
                            </span>
                            <button
                              onClick={() => removeCodingProfile(url)}
                              className="ml-2 rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
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
                          className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
                        >
                          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <span className="truncate">{getCodingPlatformName(url)}</span>
                          <svg className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No coding profiles added" />
                  )}
                </div>
              </Card>
            </div>

            {/* ── Right Column ── */}
            <div className="flex flex-col gap-5 lg:col-span-2">

              {/* Skills */}
              <Card>
                <CardHeader
                  title="Skills"
                  badge={profile.skills?.length ? `${profile.skills.length} skills` : undefined}
                  onEdit={editSection !== 'skills' ? () => startEdit('skills') : undefined}
                />
                <div className="p-5">
                  {editSection === 'skills' ? (
                    <EditForm onSave={() => saveSection('skills')} onCancel={cancelEdit} saving={saving}>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                          placeholder="Type a skill and press Enter…"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          Add
                        </button>
                      </div>
                      {editSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {editSkills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="rounded-full text-indigo-400 hover:text-red-500"
                              >
                                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </EditForm>
                  ) : profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No skills added yet" />
                  )}
                </div>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader
                  title="Experience"
                  badge={experiences.length ? `${experiences.length}` : undefined}
                  onEdit={editSection !== 'experiences' ? () => startEdit('experiences') : undefined}
                />
                <div className="p-5">
                  {editSection === 'experiences' ? (
                    <EditForm onSave={() => saveSection('experiences')} onCancel={cancelEdit} saving={saving}>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="flex items-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Experience
                      </button>
                      {editExperiences.map((exp, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Experience #{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeExperience(i)}
                              className="text-xs font-medium text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {(
                              [
                                ['title', 'Job Title', 'e.g., Senior Engineer'],
                                ['company', 'Company', 'e.g., Acme Inc.'],
                                ['location', 'Location', 'e.g., New York, NY'],
                              ] as [keyof Experience, string, string][]
                            ).map(([field, label, placeholder]) => (
                              <div key={field} className={field === 'location' ? 'sm:col-span-2' : ''}>
                                <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
                                <input
                                  type="text"
                                  value={exp[field]}
                                  onChange={(e) => updateExperienceField(i, field, e.target.value)}
                                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                  placeholder={placeholder}
                                />
                              </div>
                            ))}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-500">Start Date</label>
                              <input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => updateExperienceField(i, 'startDate', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-500">End Date</label>
                              <input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => updateExperienceField(i, 'endDate', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
                              <textarea
                                value={exp.description}
                                onChange={(e) => updateExperienceField(i, 'description', e.target.value)}
                                rows={3}
                                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                placeholder="Describe your role and achievements…"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </EditForm>
                  ) : experiences.length > 0 ? (
                    <div className="space-y-5">
                      {experiences.map((exp, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                              <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            {i < experiences.length - 1 && (
                              <div className="mt-2 w-px flex-1 bg-slate-200" />
                            )}
                          </div>
                          <div className="flex-1 pb-5">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-slate-800">{exp.title || 'Job Title'}</h3>
                                <p className="text-sm text-slate-500">
                                  {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                                </p>
                              </div>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                                {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="mt-2 text-sm leading-relaxed text-slate-500">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No experience added yet" />
                  )}
                </div>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader
                  title="Education"
                  badge={profile.education?.length ? `${profile.education.length}` : undefined}
                  onEdit={editSection !== 'education' ? () => startEdit('education') : undefined}
                />
                <div className="p-5">
                  {editSection === 'education' ? (
                    <EditForm onSave={() => saveSection('education')} onCancel={cancelEdit} saving={saving}>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="flex items-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Education
                      </button>
                      {editEducation.map((edu, i) => (
                        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Education #{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeEducation(i)}
                              className="text-xs font-medium text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-500">Institution</label>
                              <input
                                type="text"
                                value={edu.name}
                                onChange={(e) => updateEducationField(i, 'name', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                placeholder="e.g., MIT"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-500">Course / Degree</label>
                              <input
                                type="text"
                                value={edu.course}
                                onChange={(e) => updateEducationField(i, 'course', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                placeholder="e.g., Computer Science"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-500">Start Date</label>
                              <input
                                type="date"
                                value={edu.startDate}
                                onChange={(e) => updateEducationField(i, 'startDate', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-500">End Date</label>
                              <input
                                type="date"
                                value={edu.endDate}
                                onChange={(e) => updateEducationField(i, 'endDate', e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {editEducation.length === 0 && (
                        <p className="text-sm text-slate-400">Click "Add Education" to get started.</p>
                      )}
                    </EditForm>
                  ) : profile.education && profile.education.length > 0 ? (
                    <div className="space-y-4">
                      {profile.education.map((edu, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                            <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{edu.name || 'Institution'}</h3>
                            <p className="text-sm text-slate-500">{edu.course || 'Course'}</p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No education added yet" />
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ══ RESUME TAB ══ */}
        {activeTab === 'resume' && (
          <div className="mx-auto max-w-2xl space-y-5">
            <Card>
              <CardHeader
                title="Uploaded Resumes"
                badge={resumes.length ? `${resumes.length}` : undefined}
              />
              <div className="p-5">
                {resumes.length > 0 ? (
                  <div className="space-y-3">
                    {resumes.map((url, i) => (
                      <div
                        key={i}
                        className={`group flex items-center gap-4 rounded-xl border p-4 transition-all ${
                          i === primaryResumeIndex
                            ? 'border-indigo-200 bg-indigo-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 ring-1 ring-red-100">
                          <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {getResumeFileName(url)}
                          </p>
                          <p className="text-xs text-slate-400">PDF Document</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {i === primaryResumeIndex && (
                            <span className="rounded-full border border-indigo-200 bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                              Primary
                            </span>
                          )}
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                            title="View resume"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                      <svg className="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-600">No resumes uploaded</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Upload your resume to share with employers
                      </p>
                    </div>
                    <button className="mt-1 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Resume
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

/* ─── Reusable Sub-components ───────────────────────────────── */

function Card({ children }: { children: React.ReactNode }) {
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
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        {badge && (
          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
            {badge}
          </span>
        )}
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
  children: React.ReactNode
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
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {saving && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
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
  type = 'text',
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
      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
    />
  )
}

function SocialRow({
  icon,
  bgColor,
  label,
  value,
}: {
  icon: React.ReactNode
  bgColor: string
  label: string
  value?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bgColor} text-white`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-slate-400">Not provided</p>
        )}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}