import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiFileText,
  FiHelpCircle,
  FiTrendingUp,
  FiTarget,
  FiClock,
  FiAward,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { statsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await statsAPI.get();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      icon: FiFileText,
      label: "Total Notes",
      value: stats?.totalNotes || 0,
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: FiFileText,
      label: "AI Summaries",
      value: stats?.totalSummaries || 0,
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: FiHelpCircle,
      label: "Quizzes Taken",
      value: stats?.totalQuizzes || 0,
      color: "from-green-500 to-green-700",
    },
    {
      icon: FiTarget,
      label: "Avg Score",
      value: `${stats?.avgScore || 0}%`,
      color: "from-orange-500 to-orange-700",
    },
  ];

  const quickActions = [
    {
      icon: FiUpload,
      label: "Upload Notes",
      path: "/upload",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      icon: FiFileText,
      label: "Generate Summary",
      path: "/summaries",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    {
      icon: FiHelpCircle,
      label: "Take a Quiz",
      path: "/quizzes",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
  ];

  const chartData =
    stats?.quizHistory?.map((q) => ({
      name: q.title.substring(0, 15) + "...",
      score: Math.round((q.score / q.total) * 100),
    })) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 bg-gradient-to-r from-primary-600/20 to-primary-800/20"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-dark-300">
          Ready to continue your learning journey? Upload new notes, generate
          summaries, or test your knowledge with AI quizzes.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="text-white text-xl" />
              </div>
              <FiTrendingUp className="text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className={`flex items-center gap-3 p-4 rounded-xl border ${action.color} hover:opacity-80 transition-all duration-200`}
              >
                <action.icon className="text-xl" />
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quiz Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Quiz Performance
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] text-dark-400">
              <FiAward className="text-4xl mb-3" />
              <p>Take some quizzes to see your performance here!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h2>
        {stats?.activity?.length > 0 ? (
          <div className="space-y-3">
            {stats.activity.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/30"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.type === "upload"
                      ? "bg-blue-500/20 text-blue-400"
                      : item.type === "summary"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {item.type === "upload" ? (
                    <FiUpload />
                  ) : item.type === "summary" ? (
                    <FiFileText />
                  ) : (
                    <FiHelpCircle />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{item.title}</p>
                  <p className="text-xs text-dark-400">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-400">
            <FiClock className="text-3xl mx-auto mb-3" />
            <p>No recent activity yet. Start by uploading some notes!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
