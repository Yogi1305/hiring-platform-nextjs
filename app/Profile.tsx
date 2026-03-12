// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { getProfile, updateProfile } from './api'
// import type { Education, UserProfile } from './api'

// type EditSection = 'social' | 'skills' | 'education' | null

// function Profile() {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   const [editSection, setEditSection] = useState<EditSection>(null)

//   // Profile data
//   const [profile, setProfile] = useState<UserProfile>({
//     github: '',
//     linkedin: '',
//     skills: [],
//     education: [],
//   })

//   // Edit form state
//   const [editGithub, setEditGithub] = useState('')
//   const [editLinkedin, setEditLinkedin] = useState('')
//   const [editSkills, setEditSkills] = useState<string[]>([])
//   const [skillInput, setSkillInput] = useState('')
//   const [editEducation, setEditEducation] = useState<Education[]>([])

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       setLoading(true)
//       const response = await getProfile()
//       const data = response.data
//       setProfile({
//         github: data.github || '',
//         linkedin: data.linkedin || '',
//         skills: data.skills || [],
//         education: data.education || [],
//       })
//     } catch (err: any) {
//       if (err.response?.status === 401) {
//         router.push('/login')
//       } else {
//         setError(err.response?.data?.message || 'Failed to load profile')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const startEdit = (section: EditSection) => {
//     setEditSection(section)
//     setError(null)
//     setSuccess(false)
//     if (section === 'social') {
//       setEditGithub(profile.github || '')
//       setEditLinkedin(profile.linkedin || '')
//     } else if (section === 'skills') {
//       setEditSkills([...(profile.skills || [])])
//       setSkillInput('')
//     } else if (section === 'education') {
//       setEditEducation([...(profile.education || [])])
//     }
//   }

//   const cancelEdit = () => {
//     setEditSection(null)
//     setError(null)
//   }

//   const saveSection = async (section: EditSection) => {
//     setSaving(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       let updatedProfile: UserProfile = { ...profile }

//       if (section === 'social') {
//         updatedProfile = { ...updatedProfile, github: editGithub, linkedin: editLinkedin }
//       } else if (section === 'skills') {
//         updatedProfile = { ...updatedProfile, skills: editSkills }
//       } else if (section === 'education') {
//         updatedProfile = { ...updatedProfile, education: editEducation }
//       }

//       await updateProfile(updatedProfile)
//       setProfile(updatedProfile)
//       setEditSection(null)
//       setSuccess(true)
//       setTimeout(() => setSuccess(false), 3000)
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to update profile')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const addSkill = () => {
//     const trimmed = skillInput.trim()
//     if (trimmed && !editSkills.includes(trimmed)) {
//       setEditSkills([...editSkills, trimmed])
//       setSkillInput('')
//     }
//   }

//   const removeSkill = (skillToRemove: string) => {
//     setEditSkills(editSkills.filter((skill) => skill !== skillToRemove))
//   }

//   const addEducation = () => {
//     setEditEducation([
//       ...editEducation,
//       { name: '', course: '', startDate: '', endDate: '' },
//     ])
//   }

//   const updateEducationField = (index: number, field: keyof Education, value: string) => {
//     const updated = [...editEducation]
//     updated[index] = { ...updated[index], [field]: value }
//     setEditEducation(updated)
//   }

//   const removeEducation = (index: number) => {
//     setEditEducation(editEducation.filter((_, i) => i !== index))
//   }

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return 'N/A'
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       month: 'short',
//       year: 'numeric',
//     })
//   }

//   if (loading) {
//     return (
//       <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-center">
//           <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
//         </div>
//       </main>
//     )
//   }

//   return (
//     <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
//       <div className="mx-auto w-full max-w-3xl">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
//           <p className="mt-2 text-slate-600">Manage your professional information</p>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//             Profile updated successfully!
//           </div>
//         )}

//         <div className="space-y-6">
//           {/* Social Links Section */}
//           <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <h2 className="text-lg font-semibold text-slate-900">Social Links</h2>
//               {editSection !== 'social' && (
//                 <button
//                   onClick={() => startEdit('social')}
//                   className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>
//             <div className="p-6">
//               {editSection === 'social' ? (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="mb-1 block text-sm font-medium text-slate-700">
//                       GitHub Profile
//                     </label>
//                     <input
//                       type="url"
//                       value={editGithub}
//                       onChange={(e) => setEditGithub(e.target.value)}
//                       className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//                       placeholder="https://github.com/username"
//                     />
//                   </div>
//                   <div>
//                     <label className="mb-1 block text-sm font-medium text-slate-700">
//                       LinkedIn Profile
//                     </label>
//                     <input
//                       type="url"
//                       value={editLinkedin}
//                       onChange={(e) => setEditLinkedin(e.target.value)}
//                       className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//                       placeholder="https://linkedin.com/in/username"
//                     />
//                   </div>
//                   <div className="flex gap-3 pt-2">
//                     <button
//                       onClick={() => saveSection('social')}
//                       disabled={saving}
//                       className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
//                     >
//                       {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
//                       Save
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
//                       <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-slate-500">GitHub</p>
//                       {profile.github ? (
//                         <a
//                           href={profile.github}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-sm text-indigo-600 hover:underline"
//                         >
//                           {profile.github}
//                         </a>
//                       ) : (
//                         <p className="text-sm text-slate-400">Not provided</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
//                       <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-slate-500">LinkedIn</p>
//                       {profile.linkedin ? (
//                         <a
//                           href={profile.linkedin}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-sm text-indigo-600 hover:underline"
//                         >
//                           {profile.linkedin}
//                         </a>
//                       ) : (
//                         <p className="text-sm text-slate-400">Not provided</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Skills Section */}
//           <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
//               {editSection !== 'skills' && (
//                 <button
//                   onClick={() => startEdit('skills')}
//                   className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>
//             <div className="p-6">
//               {editSection === 'skills' ? (
//                 <div className="space-y-4">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={skillInput}
//                       onChange={(e) => setSkillInput(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault()
//                           addSkill()
//                         }
//                       }}
//                       className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//                       placeholder="Add a skill (e.g., JavaScript)"
//                     />
//                     <button
//                       type="button"
//                       onClick={addSkill}
//                       className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   {editSkills.length > 0 && (
//                     <div className="flex flex-wrap gap-2">
//                       {editSkills.map((skill) => (
//                         <span
//                           key={skill}
//                           className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700"
//                         >
//                           {skill}
//                           <button
//                             type="button"
//                             onClick={() => removeSkill(skill)}
//                             className="ml-1 rounded-full p-0.5 text-indigo-500 hover:bg-indigo-200 hover:text-indigo-700"
//                           >
//                             <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                               <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
//                             </svg>
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                   <div className="flex gap-3 pt-2">
//                     <button
//                       onClick={() => saveSection('skills')}
//                       disabled={saving}
//                       className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
//                     >
//                       {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
//                       Save
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   {profile.skills && profile.skills.length > 0 ? (
//                     <div className="flex flex-wrap gap-2">
//                       {profile.skills.map((skill) => (
//                         <span
//                           key={skill}
//                           className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-slate-400">No skills added yet</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Education Section */}
//           <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <h2 className="text-lg font-semibold text-slate-900">Education</h2>
//               {editSection !== 'education' && (
//                 <button
//                   onClick={() => startEdit('education')}
//                   className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>
//             <div className="p-6">
//               {editSection === 'education' ? (
//                 <div className="space-y-4">
//                   <button
//                     type="button"
//                     onClick={addEducation}
//                     className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
//                   >
//                     + Add Education
//                   </button>
//                   {editEducation.length > 0 ? (
//                     <div className="space-y-4">
//                       {editEducation.map((edu, index) => (
//                         <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
//                           <div className="mb-3 flex items-center justify-between">
//                             <span className="text-sm font-medium text-slate-600">
//                               Education #{index + 1}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() => removeEducation(index)}
//                               className="text-sm text-red-600 hover:text-red-700"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                           <div className="grid gap-3 sm:grid-cols-2">
//                             <div>
//                               <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 Institution
//                               </label>
//                               <input
//                                 type="text"
//                                 value={edu.name}
//                                 onChange={(e) => updateEducationField(index, 'name', e.target.value)}
//                                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//                                 placeholder="e.g., MIT"
//                               />
//                             </div>
//                             <div>
//                               <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 Course
//                               </label>
//                               <input
//                                 type="text"
//                                 value={edu.course}
//                                 onChange={(e) => updateEducationField(index, 'course', e.target.value)}
//                                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//                                 placeholder="e.g., Computer Science"
//                               />
//                             </div>
//                             <div>
//                               <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 Start Date
//                               </label>
//                               <input
//                                 type="date"
//                                 value={edu.startDate}
//                                 onChange={(e) => updateEducationField(index, 'startDate', e.target.value)}
//                                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//                               />
//                             </div>
//                             <div>
//                               <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 End Date
//                               </label>
//                               <input
//                                 type="date"
//                                 value={edu.endDate}
//                                 onChange={(e) => updateEducationField(index, 'endDate', e.target.value)}
//                                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-slate-500">No education entries. Click "Add Education" to add one.</p>
//                   )}
//                   <div className="flex gap-3 pt-2">
//                     <button
//                       onClick={() => saveSection('education')}
//                       disabled={saving}
//                       className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
//                     >
//                       {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
//                       Save
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div>
//                   {profile.education && profile.education.length > 0 ? (
//                     <div className="space-y-4">
//                       {profile.education.map((edu, index) => (
//                         <div key={index} className="flex gap-4">
//                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
//                             <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
//                             </svg>
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-slate-900">{edu.name || 'Institution Name'}</h3>
//                             <p className="text-sm text-slate-600">{edu.course || 'Course'}</p>
//                             <p className="mt-1 text-xs text-slate-500">
//                               {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-slate-400">No education added yet</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//   )
// }

// export default Profile
