import React, { useEffect, useState } from "react";
import { notificationAPI } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import { Bell, CheckCircle, Circle, CheckCheck, Clock, Trash2, Filter } from "lucide-react";

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
  const [filter, setFilter] = useState<"all" | "unread">("all");

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
      decrementUnread();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      resetUnread();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };



  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-full mr-4">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Notifications</h1>
                  <p className="text-blue-100">
                    {unreadCount > 0 
                      ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                      : 'All caught up!'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as "all" | "unread")}
                    className="appearance-none bg-white/20 border border-white/30 rounded-lg py-2 pl-10 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                  </select>
                  <Filter className="h-4 w-4 absolute left-3 top-2.5 text-white" />
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium flex items-center hover:bg-blue-50 transition-colors"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-6">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-5 rounded-xl border transition-all ${
                      n.read
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-200 shadow-sm"
                    } hover:shadow-md`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {n.read ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <Circle className="h-4 w-4 text-blue-500 mr-2 fill-blue-500" />
                          )}
                          <h3 className={`font-semibold ${n.read ? "text-gray-700" : "text-gray-900"}`}>
                            {n.title}
                          </h3>
                        </div>
                        <p className="text-gray-700 ml-6 mb-3">{n.message}</p>
                        <div className="flex items-center text-sm text-gray-500 ml-6">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize bg-gray-200 px-2 py-0.5 rounded-full text-xs">
                            {n.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n._id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-5">
                  <Bell className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {filter === "unread" 
                    ? "You've read all your notifications. Check back later for updates."
                    : "You'll see important updates and announcements here."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;