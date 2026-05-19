import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUpload,
  FiFile,
  FiX,
  FiCheck,
  FiFileText,
  FiTag,
} from "react-icons/fi";
import { notesAPI } from "../utils/api";

export default function UploadNotes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setTitle(acceptedFiles[0].name.replace(/\.[^/.]+$/, ""));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setTags("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await notesAPI.upload(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success("Note uploaded successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const categories = [
    "General",
    "Mathematics",
    "Science",
    "Programming",
    "History",
    "Literature",
    "Business",
    "Other",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Notes</h1>
        <p className="text-dark-400 mt-1">
          Upload your study notes and let AI do the magic
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                {...getRootProps()}
                className={`glass-card p-12 border-2 border-dashed cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-dark-600 hover:border-primary-500/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center mb-4">
                    <FiUpload className="text-3xl text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isDragActive
                      ? "Drop your file here"
                      : "Drag & Drop your file here"}
                  </h3>
                  <p className="text-dark-400 mb-4">
                    or click to browse files
                  </p>
                  <p className="text-sm text-dark-500">
                    Supports PDF, DOC, DOCX, TXT (Max 10MB)
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <FiFile className="text-2xl text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-sm text-dark-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-400 hover:text-red-400 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-dark-300">Uploading...</span>
                    <span className="text-primary-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary-600 to-primary-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              <FiFileText className="inline mr-2" />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter note title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Brief description of your notes"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <FiTag className="inline mr-2" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
                placeholder="e.g., biology, chapter1, important"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
              Uploading...
            </>
          ) : (
            <>
              <FiCheck />
              Upload Note
            </>
          )}
        </button>
      </form>
    </div>
  );
}
