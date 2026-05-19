import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiClock,
  FiCheck,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiAward,
  FiRotateCcw,
} from "react-icons/fi";
import { quizzesAPI } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!showResult && quiz && !quiz.isCompleted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showResult, quiz]);

  const fetchQuiz = async () => {
    try {
      const { data } = await quizzesAPI.getOne(id);
      setQuiz(data);
      if (data.isCompleted) {
        setShowResult(true);
        setResult({
          score: data.score,
          total: data.totalQuestions,
          percentage: Math.round((data.score / data.totalQuestions) * 100),
          timeTaken: data.timeTaken,
          questions: data.questions,
        });
      }
    } catch (error) {
      toast.error("Quiz not found");
      navigate("/quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);

    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(newAnswers[currentQ + 1] || "");
    }
  };

  const handlePrev = () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;
    setAnswers(newAnswers);

    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelectedOption(newAnswers[currentQ - 1] || "");
    }
  };

  const handleSubmit = async () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedOption;

    // Check if all questions are answered
    const unanswered = newAnswers.filter((a) => !a).length;
    if (unanswered > 0) {
      if (!confirm(`You have ${unanswered} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const { data } = await quizzesAPI.submit(id, {
        answers: newAnswers,
        timeTaken: timer,
      });
      setResult(data);
      setShowResult(true);
      toast.success(`You scored ${data.percentage}%!`);
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) return <LoadingSpinner />;
  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  // Result Screen
  if (showResult && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6">
            <FiAward className="text-4xl text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
          <p className="text-dark-400 mb-6">{quiz.title}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4">
              <p className="text-3xl font-bold text-primary-400">
                {result.percentage}%
              </p>
              <p className="text-sm text-dark-400">Score</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-3xl font-bold text-green-400">
                {result.score}/{result.total}
              </p>
              <p className="text-sm text-dark-400">Correct</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-3xl font-bold text-orange-400">
                {formatTime(result.timeTaken)}
              </p>
              <p className="text-sm text-dark-400">Time</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/quizzes")}
              className="btn-secondary flex items-center gap-2"
            >
              <FiArrowLeft /> Back to Quizzes
            </button>
            <button
              onClick={() => {
                setShowResult(false);
                setCurrentQ(0);
                setAnswers([]);
                setSelectedOption("");
                setTimer(0);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <FiRotateCcw /> Review Answers
            </button>
          </div>
        </motion.div>

        {/* Answer Review */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Answer Review</h2>
          {result.questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {isCorrect ? <FiCheck /> : <FiX />}
                  </span>
                  <div>
                    <p className="text-white font-medium">
                      {index + 1}. {q.question}
                    </p>
                    {!isCorrect && userAnswer && (
                      <p className="text-red-400 text-sm mt-1">
                        Your answer: {userAnswer}
                      </p>
                    )}
                    <p className="text-green-400 text-sm mt-1">
                      Correct answer: {q.correctAnswer}
                    </p>
                    {q.explanation && (
                      <p className="text-dark-300 text-sm mt-2 italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{quiz.title}</h2>
          <p className="text-sm text-dark-400">
            Question {currentQ + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2 text-primary-400">
          <FiClock />
          <span className="font-mono text-lg">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-dark-800 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-primary-600 to-primary-400 h-2 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                currentQuestion.type === "mcq"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-purple-500/20 text-purple-400"
              }`}
            >
              {currentQuestion.type === "mcq"
                ? "Multiple Choice"
                : "True / False"}
            </span>
            <h3 className="text-xl text-white font-medium">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedOption === option
                    ? "bg-primary-500/20 border-primary-500 text-white"
                    : "bg-dark-800/50 border-dark-700/50 text-dark-200 hover:border-dark-600"
                }`}
              >
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50"
        >
          <FiArrowLeft /> Previous
        </button>

        {/* Question indicators */}
        <div className="hidden sm:flex items-center gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentQ] = selectedOption;
                setAnswers(newAnswers);
                setCurrentQ(index);
                setSelectedOption(newAnswers[index] || "");
              }}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                index === currentQ
                  ? "bg-primary-500 text-white"
                  : answers[index]
                  ? "bg-green-500/20 text-green-400"
                  : "bg-dark-800 text-dark-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQ < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
          >
            Next <FiArrowRight />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
            ) : (
              <>
                <FiCheck /> Submit Quiz
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
