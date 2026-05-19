import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiHelpCircle,
  FiZap,
  FiClock,
  FiTarget,
  FiTrash2,
  FiPlay,
  FiCheckCircle,
} from "react-icons/fi";
import { notesAPI, quizzesAPI } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function Quizzes() {
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesRes, quizzesRes] = await Promise.all([
        notesAPI.getAll(),
        quizzesAPI.getAll(),
      ]);
      setNotes(notesRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedNote) {
      toast.error("Please select a note");
      return;
    }

    setGenerating(true);
    try {
      const { data } = await quizzesAPI.generate(selectedNote, {
        difficulty,
        numberOfQuestions: numQuestions,
      });
      setQuizzes([data, ...quizzes]);
      setSelectedNote("");
      toast.success("Quiz generated! Let's go!");
      navigate(`/quizzes/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await quizzesAPI.delete(id);
      setQuizzes(quizzes.filter((q) => q._id !== id));
      toast.success("Quiz deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Quiz Generator</h1>
        <p className="text-dark-400 mt-1">
          Test your knowledge with AI-generated quizzes
        </p>
      </div>

      {/* Generator Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiZap className="text-primary-400" />
          Create New Quiz
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Select Note
              </label>
              <select
                value={selectedNote}
                onChange={(e) => setSelectedNote(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a note...</option>
                {notes.map((note) => (
                  <option key={note._id} value={note._id}>
                    {note.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-field"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="input-field"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedNote || generating}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                Generating Quiz...
              </>
            ) : (
              <>
                <FiZap />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <EmptyState
          icon={FiHelpCircle}
          title="No Quizzes Yet"
          description="Select a note above and create your first AI quiz!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-5 hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-dark-400">
                    {quiz.note?.title || "Unknown Note"}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-red-400 transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    quiz.difficulty === "easy"
                      ? "bg-green-500/20 text-green-400"
                      : quiz.difficulty === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {quiz.difficulty.charAt(0).toUpperCase() +
                    quiz.difficulty.slice(1)}
                </span>
                <span className="text-sm text-dark-400 flex items-center gap-1">
                  <FiHelpCircle />
                  {quiz.totalQuestions} questions
                </span>
                {quiz.isCompleted && (
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    <FiCheckCircle />
                    {quiz.score}/{quiz.totalQuestions}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-dark-500">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => navigate(`/quizzes/${quiz._id}`)}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                >
                  <FiPlay />
                  {quiz.isCompleted ? "Review" : "Start"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
