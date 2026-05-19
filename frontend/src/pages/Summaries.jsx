import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiZap,
  FiCopy,
  FiDownload,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiList,
} from "react-icons/fi";
import { notesAPI, summariesAPI } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function Summaries() {
  const [notes, setNotes] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedSummary, setExpandedSummary] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesRes, summariesRes] = await Promise.all([
        notesAPI.getAll(),
        summariesAPI.getAll(),
      ]);
      setNotes(notesRes.data);
      setSummaries(summariesRes.data);
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
      const { data } = await summariesAPI.generate(selectedNote);
      setSummaries([data, ...summaries]);
      setSelectedNote("");
      toast.success("Summary generated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this summary?")) return;
    try {
      await summariesAPI.delete(id);
      setSummaries(summaries.filter((s) => s._id !== id));
      toast.success("Summary deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Summary Generator</h1>
        <p className="text-dark-400 mt-1">
          Generate intelligent summaries from your study notes
        </p>
      </div>

      {/* Generator Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiZap className="text-primary-400" />
          Generate New Summary
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedNote}
            onChange={(e) => setSelectedNote(e.target.value)}
            className="input-field flex-1"
          >
            <option value="">Select a note...</option>
            {notes.map((note) => (
              <option key={note._id} value={note._id}>
                {note.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={!selectedNote || generating}
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                Generating...
              </>
            ) : (
              <>
                <FiZap />
                Generate Summary
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summaries List */}
      {summaries.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No Summaries Yet"
          description="Select a note above and generate your first AI summary!"
        />
      ) : (
        <div className="space-y-4">
          {summaries.map((summary, index) => (
            <motion.div
              key={summary._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() =>
                  setExpandedSummary(
                    expandedSummary === summary._id ? null : summary._id
                  )
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiBookOpen className="text-primary-400" />
                      {summary.note?.title || "Untitled Note"}
                    </h3>
                    <p className="text-dark-300 mt-2 line-clamp-2">
                      {summary.shortSummary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(summary.detailedSummary);
                      }}
                      className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-primary-400 transition-colors"
                      title="Copy"
                    >
                      <FiCopy />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(summary._id);
                      }}
                      className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                    {expandedSummary === summary._id ? (
                      <FiChevronUp className="text-dark-400" />
                    ) : (
                      <FiChevronDown className="text-dark-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedSummary === summary._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-dark-700/50 pt-4">
                      {/* Detailed Summary */}
                      <div>
                        <h4 className="text-sm font-semibold text-primary-400 mb-2 flex items-center gap-2">
                          <FiFileText /> Detailed Summary
                        </h4>
                        <p className="text-dark-200 whitespace-pre-wrap">
                          {summary.detailedSummary}
                        </p>
                      </div>

                      {/* Key Points */}
                      {summary.keyPoints?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                            <FiList /> Key Points
                          </h4>
                          <ul className="space-y-2">
                            {summary.keyPoints.map((point, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-dark-200"
                              >
                                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Important Topics */}
                      {summary.importantTopics?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-purple-400 mb-2">
                            Important Topics
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {summary.importantTopics.map((topic, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-dark-500">
                        Generated on{" "}
                        {new Date(summary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
