import React from "react";
import { Bell } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationBadgeProps {
  onClick?: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ onClick }) => {
  const { unreadCount } = useNotification();

  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Bell Icon */}
      <Bell
        className={`h-7 w-7 ${
          unreadCount > 0 ? "text-blue-600" : "text-gray-500"
        }`}
      />

      {/* Notification Count */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse Effect */}
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-400 opacity-75 animate-ping"></span>
      )}
    </motion.div>
  );
};

export default NotificationBadge;
