import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCamera,
  FiSave,
  FiAward,
  FiFileText,
  FiHelpCircle,
  FiTarget,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { authAPI, statsAPI } from "../utils/api";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await statsAPI.get();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const updateData = { name, email };
      if (password) updateData.password = password;

      const { data } = await authAPI.updateProfile(updateData);
      updateUser(data);
      setPassword("");
      setConfirmPassword("");
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be less than 2MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await authAPI.uploadAvatar(formData);
      updateUser({ ...user, avatar: data.avatar });
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const achievements = [
    {
      icon: FiFileText,
      label: "First Note",
      description: "Upload your first note",
      earned: (stats?.totalNotes || 0) >= 1,
    },
    {
      icon: FiAward,
      label: "Quiz Master",
      description: "Complete 5 quizzes",
      earned: (stats?.totalQuizzes || 0) >= 5,
    },
    {
      icon: FiTarget,
      label: "High Scorer",
      description: "Score 80%+ on a quiz",
      earned: (stats?.avgScore || 0) >= 80,
    },
    {
      icon: FiUser,
      label: "Scholar",
      description: "Upload 10 notes",
      earned: (stats?.totalNotes || 0) >= 10,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-dark-400 mt-1">
          Manage your account and view your achievements
        </p>
      </div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center cursor-pointer hover:bg-primary-400 transition-colors">
              <FiCamera className="text-white text-sm" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-dark-400">{user?.email}</p>
            <p className="text-sm text-dark-500 mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Notes", value: stats?.totalNotes || 0, icon: FiFileText },
          {
            label: "Summaries",
            value: stats?.totalSummaries || 0,
            icon: FiFileText,
          },
          {
            label: "Quizzes",
            value: stats?.totalQuizzes || 0,
            icon: FiHelpCircle,
          },
          {
            label: "Avg Score",
            value: `${stats?.avgScore || 0}%`,
            icon: FiTarget,
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 text-center"
          >
            <stat.icon className="text-primary-400 text-xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-dark-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FiAward className="text-primary-400" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                achievement.earned
                  ? "bg-primary-500/10 border-primary-500/30"
                  : "bg-dark-800/30 border-dark-700/30 opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  achievement.earned
                    ? "bg-primary-500/20 text-primary-400"
                    : "bg-dark-700/50 text-dark-500"
                }`}
              >
                <achievement.icon />
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    achievement.earned ? "text-white" : "text-dark-400"
                  }`}
                >
                  {achievement.label}
                </p>
                <p className="text-xs text-dark-500">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Edit Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          Edit Profile
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              <FiUser className="inline mr-2" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              <FiMail className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="border-t border-dark-700/50 pt-4">
            <p className="text-sm text-dark-400 mb-4">
              Leave password fields empty to keep current password
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  <FiLock className="inline mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Leave empty to keep"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  <FiLock className="inline mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
            ) : (
              <>
                <FiSave /> Save Changes
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
