import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'

import api from '../../../api'
import ImportQuestions from './ImportQuestions'

interface Job {
  id: string
  title: string
  jobType: string
  jobCategory: string
}

interface Test {
  id: string
  title: string
  description: string
  job: Job
  questionSet: unknown[]
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring'

function CreateQuestionForm() {
  // Tests state
  const [tests, setTests] = useState<Test[]>([])
  const [loadingTests, setLoadingTests] = useState(true)
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)

  // Question form state
  const [questionText, setQuestionText] = useState('')
  const [questionOptions, setQuestionOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)

  // Fetch tests on mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get('/tests/all')
        setTests(response.data.data || [])
      } catch (err) {
        console.error('Failed to fetch tests:', err)
        setError('Failed to load tests')
      } finally {
        setLoadingTests(false)
      }
    }
    fetchTests()
  }, [])

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test)
    setQuestionText('')
    setQuestionOptions([])
    setNewOption('')
    setCorrectAnswer('')
    setError(null)
    setSuccess(null)
  }

  const handleBackToTests = () => {
    setSelectedTest(null)
    setQuestionText('')
    setQuestionOptions([])
    setNewOption('')
    setCorrectAnswer('')
    setError(null)
    setSuccess(null)
  }

  const addOption = () => {
    if (!newOption.trim()) return
    if (questionOptions.includes(newOption.trim())) return
    setQuestionOptions([...questionOptions, newOption.trim()])
    setNewOption('')
  }

  const removeOption = (index: number) => {
    const removedOption = questionOptions[index]
    setQuestionOptions(questionOptions.filter((_, i) => i !== index))
    if (correctAnswer === removedOption) {
      setCorrectAnswer('')
    }
  }

  const handleCreateQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedTest) return
    if (questionOptions.length < 2) {
      setError('Please add at least 2 options')
      return
    }
    if (!correctAnswer) {
      setError('Please select the correct answer')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await api.post(`/questions/tests/${selectedTest.id}/create`, {
        questionText,
        options: questionOptions,
        correctAnswer,
        testId: selectedTest.id,
      })
      console.log('Create Question response:', response.data)
      setSuccess('Question created successfully!')
      // Reset form but stay on the test
      setQuestionText('')
      setQuestionOptions([])
      setCorrectAnswer('')
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : 'Failed to create question'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loadingTests) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading tests...</div>
      </div>
    )
  }

  // Show tests list if no test selected
  if (!selectedTest) {
    return (
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Create Question</h2>
        <p className="mt-2 text-slate-600">Select a test to add questions.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {tests.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-500">No tests found. Create a test first.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
              >
                <div>
                  <h3 className="font-medium text-slate-900">{test.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-1">{test.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {test.job?.title || 'No job'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {test.questionSet?.length || 0} questions
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTest(test)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Add Question
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Show question form for selected test
  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleBackToTests}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Create Question</h2>
          <p className="mt-1 text-slate-600">
            Adding to: <span className="font-medium text-indigo-600">{selectedTest.title}</span>
          </p>
        </div>
      </div>

      {/* Selected Test Info */}
      <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">{selectedTest.title}</p>
            <p className="mt-1 text-sm text-slate-600">{selectedTest.description}</p>
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
              <span>Job: {selectedTest.job?.title || 'N/A'}</span>
              <span>•</span>
              <span>{selectedTest.questionSet?.length || 0} questions</span>
            </div>
          </div>
          <div className="text-right text-sm text-slate-500">
            <p>Test ID:</p>
            <p className="font-mono text-xs text-slate-700">{selectedTest.id}</p>
          </div>
        </div>
      </div>

      {/* Import Questions Button */}
      <div className="mt-4">
        <button
          type="button"
          className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
          onClick={() => setShowImport((prev) => !prev)}
        >
          {showImport ? 'Hide Import Questions' : 'Import Questions'}
        </button>
        {showImport && <ImportQuestions testId={selectedTest.id} />}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleCreateQuestion} className="mt-6 space-y-4">
        <div>
          <label htmlFor="questionText" className="mb-1 block text-sm font-medium text-slate-700">
            Question Text
          </label>
          <textarea
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            rows={3}
            className={inputClass}
            placeholder="Enter your question here..."
          />
        </div>

        {/* Options Builder */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Options</h3>
          <p className="mt-1 text-xs text-slate-500">Add at least 2 options for this question.</p>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className={inputClass}
              placeholder="Enter an option"
            />
            <button
              type="button"
              onClick={addOption}
              className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              + Add
            </button>
          </div>

          {/* Options List */}
          {questionOptions.length > 0 && (
            <div className="mt-4 space-y-2">
              {questionOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm text-slate-700">{option}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Correct Answer Selector */}
        {questionOptions.length > 0 && (
          <div>
            <label htmlFor="correctAnswer" className="mb-1 block text-sm font-medium text-slate-700">
              Correct Answer
            </label>
            <select
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select the correct answer</option>
              {questionOptions.map((option, index) => (
                <option key={index} value={option}>
                  {String.fromCharCode(65 + index)}. {option}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || questionOptions.length < 2 || !correctAnswer}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Question'}
        </button>
      </form>
    </div>
  )
}

export default CreateQuestionForm