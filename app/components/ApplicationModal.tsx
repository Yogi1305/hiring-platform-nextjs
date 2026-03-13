"use client";

import { useEffect, useState } from "react";
import api from "../api";
import type { Job, Question } from "../pages/Jobs";

interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

interface FormResponse {
  [key: string]: string | number;
}

interface TestAnswer {
  questionId: string;
  answer: string;
}

type Step = "form" | "test" | "review" | "success";

function ApplicationModal({ job, isOpen, onClose }: ApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("form");
  const [formResponse, setFormResponse] = useState<FormResponse>({});
  const [testAnswers, setTestAnswers] = useState<TestAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const hasTest = job.test && job.test.questions && job.test.questions.length > 0;
  const formFields = job.form?.form?.fields || [];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep("form");
      setFormResponse({});
      setTestAnswers([]);
      setQuestions(job.test?.questions || []);
      setError(null);
      setApplicationId(null);
    }
  }, [isOpen, job.test?.questions]);

  const handleFormChange = (fieldLabel: string, value: string | number) => {
    setFormResponse((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));
  };

  const handleAnswerChange = async (questionId: string, answer: string) => {
    if (!applicationId) {
      setError("Application not created. Please go back and submit the form again.");
      return;
    }

    setSubmittingAnswer(questionId);
    setError(null);

    try {
      await api.post(`/applications/${applicationId}/submit-test`, {
        testAnswers: [{ questionId, answer }],
      });

      setTestAnswers((prev) => {
        const existing = prev.find((a) => a.questionId === questionId);
        if (existing) {
          return prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a));
        }
        return [...prev, { questionId, answer }];
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit answer. Please try again.");
    } finally {
      setSubmittingAnswer(null);
    }
  };

  const validateForm = () => {
    for (const field of formFields) {
      if (field.required && !formResponse[field.label]) {
        return false;
      }
    }
    return true;
  };

  const validateTest = () => {
    return questions.every((q) => testAnswers.find((a) => a.questionId === q.id));
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // First create the application to get applicationId
      const response = await api.post("/applications/apply", {
        jobId: job.id,
        formResponse,
      });

      const appId = response.data.data?.id || response.data.id;
      setApplicationId(appId);

      if (hasTest) {
        setCurrentStep("test");
      } else {
        setCurrentStep("success");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestSubmit = () => {
    if (!validateTest()) {
      setError("Please answer all questions.");
      return;
    }
    setError(null);
    setCurrentStep("success");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Apply for {job.title}</h2>
              <p className="text-sm text-slate-500">
                {currentStep === "form" && "Step 1: Fill Application Form"}
                {currentStep === "test" && "Step 2: Complete Assessment Test"}
                {currentStep === "review" && "Step 3: Review & Submit"}
                {currentStep === "success" && "Application Submitted!"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submittingAnswer !== null}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          {currentStep !== "success" && (
            <div className="mt-4 flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                currentStep === "form" ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-600"
              }`}>
                1
              </div>
              <div className={`h-1 flex-1 rounded ${
                currentStep !== "form" ? "bg-indigo-600" : "bg-slate-200"
              }`} />
              {hasTest && (
                <>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    currentStep === "test" ? "bg-indigo-600 text-white" : 
                    currentStep === "review" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-400"
                  }`}>
                    2
                  </div>
                  <div className={`h-1 flex-1 rounded ${
                    currentStep === "review" ? "bg-indigo-600" : "bg-slate-200"
                  }`} />
                </>
              )}
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                currentStep === "review" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
              }`}>
                {hasTest ? "3" : "2"}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form Step */}
          {currentStep === "form" && (
            <div className="space-y-4">
              {formFields.length > 0 ? (
                formFields.map((field) => (
                  <div key={field.id}>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {field.label}
                      {field.required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                    <input
                      type={field.type}
                      required={field.required}
                      value={formResponse[field.label] || ""}
                      onChange={(e) =>
                        handleFormChange(
                          field.label,
                          field.type === "number" ? Number(e.target.value) : e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder={`Enter ${field.label}`}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500">No application form required.</p>
              )}
            </div>
          )}

          {/* Test Step */}
          {currentStep === "test" && (
            <div className="space-y-6">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <div key={question.id} className="rounded-lg border border-slate-200 p-4">
                    <p className="mb-3 font-medium text-slate-900">
                      {index + 1}. {question.questionText}
                    </p>
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => {
                        const isSelected = testAnswers.find((a) => a.questionId === question.id)?.answer === option
                        const isSubmitting = submittingAnswer === question.id
                        return (
                          <label
                            key={optIndex}
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-slate-200 hover:bg-slate-50"
                            } ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              checked={isSelected}
                              disabled={isSubmitting}
                              onChange={() => handleAnswerChange(question.id, option)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">{option}</span>
                            {isSubmitting && isSelected && (
                              <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                            )}
                          </label>
                        )
                      })}
                    </div>
                    {testAnswers.find((a) => a.questionId === question.id) && (
                      <p className="mt-2 text-xs text-green-600">Answer saved</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500">No questions available.</p>
              )}
            </div>
          )}

          {/* Review Step */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 p-4">
                <h3 className="mb-3 font-semibold text-slate-900">Application Details</h3>
                <div className="space-y-2">
                  {Object.entries(formResponse).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-500">{key}:</span>
                      <span className="font-medium text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hasTest && testAnswers.length > 0 && (
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-3 font-semibold text-slate-900">Test Answers</h3>
                  <div className="space-y-2">
                    {questions.map((q, index) => {
                      const answer = testAnswers.find((a) => a.questionId === q.id)
                      return (
                        <div key={q.id} className="text-sm">
                          <p className="text-slate-500">Q{index + 1}: {q.questionText}</p>
                          <p className="font-medium text-slate-700">A: {answer?.answer || "Not answered"}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Step */}
          {currentStep === "success" && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Application Submitted!</h3>
              <p className="mt-2 text-slate-600">
                Your application for {job.title} has been submitted successfully.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex justify-between gap-3">
            {currentStep !== "success" && currentStep !== "test" && (
              <button
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            {currentStep === "test" && (
              <div className="text-xs text-slate-500">
                Answers are saved automatically when you select them
              </div>
            )}

            {currentStep === "form" && (
              <button
                onClick={handleFormSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {submitting && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                )}
                {submitting ? "Submitting..." : hasTest ? "Submit & Take Test" : "Submit Application"}
              </button>
            )}

            {currentStep === "test" && (
              <button
                onClick={handleTestSubmit}
                disabled={submittingAnswer !== null}
                className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:bg-green-400"
              >
                Finish Test
              </button>
            )}

            {currentStep === "success" && (
              <button
                onClick={onClose}
                className="ml-auto rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationModal;
