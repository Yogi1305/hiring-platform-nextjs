"use client"
import { useState, useEffect } from "react"
import { createQuestionSet, fetchAllQuestionSets, addQuestionToSet } from "@/app/api"
import type { QuestionSet, Question } from "@/app/api"

const QuestionBank = () => {
  const [setName, setSetName] = useState<string>("")
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [selectedSetId, setSelectedSetId] = useState<string>("")
  const [selectedSetName, setSelectedSetName] = useState<string>("")
  const [questionText, setQuestionText] = useState<string>("")
  const [options, setOptions] = useState<string[]>(["", ""])
  const [correctAnswer, setCorrectAnswer] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [setsLoading, setSetsLoading] = useState<boolean>(true)
  const [createLoading, setCreateLoading] = useState<boolean>(false)
  const [expandedSets, setExpandedSets] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    fetchAllSets()
  }, [])

  const fetchAllSets = async () => {
    setSetsLoading(true)
    try {
      const sets = await fetchAllQuestionSets()
      setQuestionSets(sets)
      setExpandedSets(new Set(sets.map((s: QuestionSet) => s.id)))
    } finally {
      setSetsLoading(false)
    }
  }

  const handleCreateSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCreateLoading(true)
    try {
      await createQuestionSet(setName)
      setSetName("")
      await fetchAllSets()
    } finally {
      setCreateLoading(false)
    }
  }

  const handleAddQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFeedback(null)
    if (!selectedSetId) return
    if (!options.includes(correctAnswer)) {
      setFeedback({
        type: "error",
        message: "Correct answer must exactly match one of the options.",
      })
      return
    }
    setLoading(true)
    try {
      await addQuestionToSet(selectedSetId, { questionText, options, correctAnswer })
      setFeedback({ type: "success", message: "Question added successfully!" })
      setQuestionText("")
      setOptions(["", ""])
      setCorrectAnswer("")
      await fetchAllSets()
      setTimeout(() => {
        setSelectedSetId("")
        setSelectedSetName("")
        setFeedback(null)
      }, 1200)
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.response?.data?.message || "Failed to add question.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...options]
    newOptions[idx] = value
    setOptions(newOptions)
  }

  const toggleSet = (id: string) => {
    setExpandedSets((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const openModal = (set: QuestionSet) => {
    setSelectedSetId(set.id)
    setSelectedSetName(set.setName)
    setFeedback(null)
    setQuestionText("")
    setOptions(["", ""])
    setCorrectAnswer("")
  }

  const closeModal = () => {
    setSelectedSetId("")
    setSelectedSetName("")
    setFeedback(null)
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-200" />
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Assessment Tools
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Question Bank
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {questionSets.length} set{questionSets.length !== 1 ? "s" : ""} ·{" "}
                {questionSets.reduce((sum, s) => sum + (s.questions?.length ?? 0), 0)} total
                questions
              </p>
            </div>

            {/* ── Create Set inline form ── */}
            <form
              onSubmit={handleCreateSet}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <input
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  placeholder="New set name…"
                  required
                  disabled={createLoading}
                  className="w-56 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={createLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {createLoading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                Create Set
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Loading skeleton */}
        {setsLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
              />
            ))}
          </div>
        ) : questionSets.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700">No question sets yet</h3>
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              Create your first set using the form above to start building your question bank.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {questionSets.map((set: QuestionSet) => {
              const isExpanded = expandedSets.has(set.id)
              const qCount = set.questions?.length ?? 0

              return (
                <div
                  key={set.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Set header */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <button
                      onClick={() => toggleSet(set.id)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                        <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 truncate">{set.setName}</span>
                          <span className="shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                            {qCount} Q{qCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <svg
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => openModal(set)}
                      className="ml-1 inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Question
                    </button>
                  </div>

                  {/* Questions list */}
                  {isExpanded && (
                    <div className="divide-y divide-slate-100">
                      {qCount === 0 ? (
                        <div className="flex items-center gap-3 px-5 py-5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-slate-300">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <p className="text-sm text-slate-400">No questions yet — add one above.</p>
                        </div>
                      ) : (
                        set.questions?.map((q: Question, i: number) => (
                          <div key={i} className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                {i + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800">
                                  {q.questionText}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {q.options.map((opt, oi) => (
                                    <span
                                      key={oi}
                                      className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                                        opt === q.correctAnswer
                                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                          : "bg-slate-100 text-slate-600 ring-slate-200"
                                      }`}
                                    >
                                      {opt === q.correctAnswer && (
                                        <span className="mr-1">✓</span>
                                      )}
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Add Question Modal ─────────────────────────────────── */}
      {selectedSetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100">
                  <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Add Question</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[200px]">{selectedSetName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddQuestion}>
              <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-5">

                {/* Feedback */}
                {feedback && (
                  <div
                    className={`flex items-start gap-3 rounded-xl p-4 ${
                      feedback.type === "success"
                        ? "border border-emerald-100 bg-emerald-50"
                        : "border border-red-100 bg-red-50"
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        feedback.type === "success" ? "bg-emerald-100" : "bg-red-100"
                      }`}
                    >
                      {feedback.type === "success" ? (
                        <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-3 w-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        feedback.type === "success" ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {feedback.message}
                    </p>
                  </div>
                )}

                {/* Question Text */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Question Text <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter your question here…"
                    required
                    rows={3}
                    disabled={loading}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Answer Options <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <input
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${idx + 1}`}
                          required
                          disabled={loading}
                          className={inputClass}
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                            disabled={loading}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOptions([...options, ""])}
                    disabled={loading}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-50"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Option
                  </button>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Correct Answer <span className="text-red-400">*</span>
                  </label>
                  <p className="mb-2 text-xs text-slate-400">
                    Must exactly match one of the options above
                  </p>
                  {/* Select from existing options if all filled */}
                  {options.some((o) => o.trim()) ? (
                    <div className="flex flex-wrap gap-2">
                      {options.filter((o) => o.trim()).map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCorrectAnswer(opt)}
                          disabled={loading}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                            correctAnswer === opt
                              ? "bg-emerald-500 text-white ring-emerald-400 shadow-sm"
                              : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {correctAnswer === opt && <span className="mr-1">✓</span>}
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="Type the correct answer…"
                      required
                      disabled={loading}
                      className={inputClass}
                    />
                  )}
                  {/* Hidden required input to satisfy form validation */}
                  <input
                    type="hidden"
                    value={correctAnswer}
                    required
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !correctAnswer}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adding…
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Question
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionBank