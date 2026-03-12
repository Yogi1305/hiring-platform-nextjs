import { useState, useEffect } from "react";
import api, { createQuestionSet, fetchAllQuestionSets, addQuestionToSet } from "../../../app/api";
import type { QuestionSet, Question } from "../../../app/api";

const QuestionBank = () => {
  const [setName, setSetName] = useState<string>("");
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  // Use setId for selected set, as required by backend
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchAllSets();
  }, []);

  const fetchAllSets = async () => {
    const sets = await fetchAllQuestionSets();
    console.log('Fetched questionSets:', sets);
    setQuestionSets(sets);
  };

  const handleCreateSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createQuestionSet(setName);
    setSetName("");
    fetchAllSets();
  };

  const handleAddQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    if (!selectedSetId) return;
    if (!options.includes(correctAnswer)) {
      setFeedback({ type: 'error', message: 'Correct answer must match one of the options.' });
      return;
    }
    setLoading(true);
    try {
      await addQuestionToSet(selectedSetId, { questionText, options, correctAnswer });
      setFeedback({ type: 'success', message: 'Question added successfully!' });
      setQuestionText("");
      setOptions(["", ""]);
      setCorrectAnswer("");
      fetchAllSets();
      setTimeout(() => {
        setSelectedSetId("");
        setFeedback(null);
      }, 1000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to add question.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Question Bank</h2>
      <form
        onSubmit={handleCreateSet}
        className="flex flex-col md:flex-row gap-4 items-center bg-white shadow rounded-lg p-4 mb-8"
      >
        <input
          value={setName}
          onChange={e => setSetName(e.target.value)}
          placeholder="New Question Set Name"
          required
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
        >
          Create Set
        </button>
      </form>

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">All Question Sets</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {questionSets.length === 0 && (
          <div className="col-span-2 text-center text-gray-500">No question sets found.</div>
        )}
        {questionSets.map((set: QuestionSet) => (
          <div
            key={set.id}
            className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-2 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-blue-700">{set.setName}</span>
              <button
                onClick={() => setSelectedSetId(set.id)}
                className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
              >
                Add Question
              </button>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Questions:</span>
              <ul className="list-disc ml-6 mt-1">
                {set.questions && set.questions.length > 0 ? (
                  set.questions.map((q: Question, i: number) => (
                    <li key={i} className="text-gray-800">
                      <span className="font-medium">Q{i + 1}:</span> {q.questionText}
                      <div className="ml-4 text-sm text-gray-600">
                        Options: {q.options.join(", ")}
                        <br />
                        <span className="text-green-700">Correct: {q.correctAnswer}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No questions yet.</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {selectedSetId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddQuestion}
            className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setSelectedSetId("")}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="text-xl font-bold mb-4 text-blue-700">Add Question</h4>
            {feedback && (
              <div className={`mb-3 px-3 py-2 rounded text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{feedback.message}</div>
            )}
            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Question Text</label>
              <input
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                placeholder="Enter question"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Options</label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    value={opt}
                    onChange={e => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    required
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={loading}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                      onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                      aria-label="Remove option"
                      disabled={loading}
                    >
                      &minus;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-1 text-blue-600 hover:underline text-sm"
                onClick={() => setOptions([...options, ""])}
                disabled={loading}
              >
                + Add Option
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Correct Answer</label>
              <input
                value={correctAnswer}
                onChange={e => setCorrectAnswer(e.target.value)}
                placeholder="Correct Answer"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Question'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
