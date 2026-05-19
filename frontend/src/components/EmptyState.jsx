import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {Icon && (
        <div className="w-20 h-20 rounded-2xl bg-dark-800/50 border border-dark-700/50 flex items-center justify-center mb-6">
          <Icon className="text-3xl text-dark-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-dark-200 mb-2">{title}</h3>
      <p className="text-dark-400 max-w-md mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
