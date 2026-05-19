import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiHelpCircle,
  FiSearch,
  FiTrash2,
  FiEye,
  FiClock,
  FiFilter,
} from "react-icons/fi";
import { notesAPI, summariesAPI, quizzesAPI } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function History() {
  const [activeTab, setActiveTab] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesRes, summariesRes, quizzesRes] = await Promise.all([
        notesAPI.getAll(),
        summariesAPI.getAll(),
        quizzesAPI.getAll(),
      ]);
      setNotes(notesRes.data);
      setSummaries(summariesRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm("Delete this note? This will also delete related summaries and quizzes.")) return;
    try {
      await notesAPI.delete(id);
      setNotes(notes.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleDeleteSummary = async (id) => {
    if (!confirm("Delete this summary?")) return;
    try {
      await summariesAPI.delete(id);
      setSummaries(summaries.filter((s) => s._id !== id));
      toast.success("Summary deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleDeleteQuiz = async (id) => {
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

  const tabs = [
    { id: "notes", label: "Notes", icon: FiFileText, count: notes.length },
    {
      id: "summaries",
      label: "Summaries",
      icon: FiFileText,
      count: summaries.length,
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: FiHelpCircle,
      count: quizzes.length,
    },
  ];

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSummaries = summaries.filter((s) =>
    s.note?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredQuizzes = quizzes.filter(
    (q) =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.note?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-dark-400 mt-1">
          View all your uploaded notes, summaries, and quiz attempts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-dark-800/50 text-dark-400 border border-dark-700/50 hover:text-dark-200"
            }`}
          >
            <tab.icon />
            <span>{tab.label}</span>
            <span className="bg-dark-700/50 px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11"
          placeholder="Search..."
        />
      </div>

      {/* Notes Tab */}
      {activeTab === "notes" && (
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <EmptyState
              icon={FiFileText}
              title="No Notes Found"
              description="Upload some notes to get started!"
            />
          ) : (
            filteredNotes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FiFileText className="text-blue-400 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-dark-400">
                    {note.category} &middot;{" "}
                    {(note.fileSize / 1024).toFixed(1)} KB &middot;{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    <FiEye />
                  </a>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Summaries Tab */}
      {activeTab === "summaries" && (
        <div className="space-y-3">
          {filteredSummaries.length === 0 ? (
            <EmptyState
              icon={FiFileText}
              title="No Summaries Found"
              description="Generate some summaries from your notes!"
            />
          ) : (
            filteredSummaries.map((summary, index) => (
              <motion.div
                key={summary._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium">
                      {summary.note?.title || "Untitled"}
                    </h3>
                    <p className="text-sm text-dark-300 mt-1 line-clamp-2">
                      {summary.shortSummary}
                    </p>
                    <p className="text-xs text-dark-500 mt-2">
                      {new Date(summary.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteSummary(summary._id)}
                    className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <div className="space-y-3">
          {filteredQuizzes.length === 0 ? (
            <EmptyState
              icon={FiHelpCircle}
              title="No Quizzes Found"
              description="Take some quizzes to see your history here!"
            />
          ) : (
            filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    quiz.isCompleted
                      ? "bg-green-500/20"
                      : "bg-orange-500/20"
                  }`}
                >
                  <FiHelpCircle
                    className={`text-xl ${
                      quiz.isCompleted ? "text-green-400" : "text-orange-400"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-dark-400">
                    {quiz.difficulty} &middot; {quiz.totalQuestions} questions
                    {quiz.isCompleted &&
                      ` &middot; Score: ${quiz.score}/${quiz.totalQuestions}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
