import { useState } from 'react';
import { fetchAllQuestionSets, addExistingQuestionToTest } from '../../api';
import type { QuestionSet } from '../../api';

interface ImportQuestionsProps {
  testId: string;
}

const ImportQuestions: React.FC<ImportQuestionsProps> = ({ testId }) => {
    const [addLoading, setAddLoading] = useState<string | null>(null);
    const [addSuccess, setAddSuccess] = useState<string | null>(null);
    const [addError, setAddError] = useState<string | null>(null);
    const handleAddToTest = async (questionId: string) => {
      setAddLoading(questionId);
      setAddSuccess(null);
      setAddError(null);
      try {
        await addExistingQuestionToTest(testId, questionId);
        setAddSuccess('Question added to test!');
      } catch (err: unknown) {
        setAddError('Failed to add question to test');
      } finally {
        setAddLoading(null);
      }
    };
  const [showSets, setShowSets] = useState(false);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<QuestionSet | null>(null);

  const handleShowSets = async () => {
    setLoading(true);
    setError(null);
    try {
      const sets = await fetchAllQuestionSets();
      setQuestionSets(sets);
      setShowSets(true);
    } catch (err: unknown) {
      setError('Failed to load question sets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
        onClick={handleShowSets}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Import Questions'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {showSets && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Select a Question Set</h3>
          <ul className="space-y-2">
            {questionSets.map((set) => (
              <li key={set.id}>
                <button
                  className="w-full text-left px-4 py-2 bg-slate-100 hover:bg-indigo-50 rounded"
                  onClick={() => setSelectedSet(set)}
                >
                  {set.setName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedSet && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Questions in {selectedSet.setName}</h4>
          <ul className="space-y-2">
            {selectedSet.questions.map((q: any, idx) => (
              <li key={(q.id || q.questionText) + idx} className="bg-white border rounded px-4 py-2">
                <div className="font-medium">{q.questionText}</div>
                <div className="text-xs text-slate-500 mb-2">Options: {q.options.join(', ')} | Correct: {q.correctAnswer}</div>
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-3 py-1 text-xs"
                  onClick={() => handleAddToTest(q.id)}
                  disabled={addLoading === q.id}
                >
                  {addLoading === q.id ? 'Adding...' : 'Add to Test'}
                </button>
                {addSuccess && addLoading === null && (
                  <div className="text-green-600 text-xs mt-1">{addSuccess}</div>
                )}
                {addError && addLoading === null && (
                  <div className="text-red-600 text-xs mt-1">{addError}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportQuestions;
