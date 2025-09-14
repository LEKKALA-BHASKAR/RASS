import React, { useEffect, useState } from "react";
import { notificationAPI } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const { decrementUnread, resetUnread } = useNotification();

const markAsRead = async (id: string) => {
  try {
    await notificationAPI.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    decrementUnread(); // ✅ instantly update Navbar
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

const markAllAsRead = async () => {
  try {
    await notificationAPI.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    resetUnread(); // ✅ instantly clear badge
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1 text-sm bg-primary-600 text-green-600 rounded-lg hover:bg-primary-700"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-lg border ${
                n.read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-400"
              }`}
              onClick={() => !n.read && markAsRead(n._id)}
            >
              <h3 className="font-semibold text-gray-900">{n.title}</h3>
              <p className="text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No notifications yet.</p>
      )}
    </div>
  );
};

export default Notifications;
