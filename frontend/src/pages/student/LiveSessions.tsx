import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { liveSessionAPI } from "../../services/api";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  ExternalLink, 
  Play, 
  Zap, 
  AlertCircle,
  Download,
  Bell,
  BellOff
} from "lucide-react";
import { LiveSession } from "../../types";
import { notificationAPI } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";

const LiveSessions: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [subscribedSessions, setSubscribedSessions] = useState<Set<string>>(new Set());
  const { resetUnread, decrementUnread } = useNotification();
  
  useEffect(() => {
    if (courseId) {
      fetchCourseSessions(courseId); // course-specific
    } else {
      fetchMySessions(); // all enrolled sessions
    }

    markLiveSessionNotificationsAsRead();
    fetchSubscribedSessions();
  }, [courseId]);

  const fetchSubscribedSessions = async () => {
    try {
      const response = await liveSessionAPI.getSubscribedSessions();
      setSubscribedSessions(new Set(response.data.map((s: LiveSession) => s._id)));
    } catch (error) {
      console.error("Error fetching subscribed sessions:", error);
    }
  };

  const markLiveSessionNotificationsAsRead = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      const liveNotifications = res.data.filter(
        (n: any) => n.type === "live-session" && !n.read
      );

      for (const n of liveNotifications) {
        await notificationAPI.markAsRead(n._id);
        decrementUnread(); // update navbar count instantly
      }
    } catch (err) {
      console.error("Error marking live-session notifications as read:", err);
    }
  };

  const fetchCourseSessions = async (id: string) => {
    try {
      const response = await liveSessionAPI.getCourseSessions(id);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySessions = async () => {
    try {
      const response = await liveSessionAPI.getMySessions();
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching my sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const response = await liveSessionAPI.joinSession(sessionId);
      if (response.data.meetingLink) {
        // ✅ Mark related notifications as read
        await markLiveSessionNotificationsAsRead();
        window.open(response.data.meetingLink, '_blank');
      }
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const handleToggleSubscription = async (sessionId: string, currentlySubscribed: boolean) => {
    try {
      if (currentlySubscribed) {
        await liveSessionAPI.unsubscribeFromSession(sessionId);
        setSubscribedSessions(prev => {
          const newSet = new Set(prev);
          newSet.delete(sessionId);
          return newSet;
        });
      } else {
        await liveSessionAPI.subscribeToSession(sessionId);
        setSubscribedSessions(prev => new Set(prev).add(sessionId));
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const handleDownloadMaterials = async (sessionId: string, materials: any[]) => {
    // This would typically open download links or trigger file downloads
    materials.forEach(material => {
      window.open(material.url, '_blank');
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 border-l-4 border-red-500";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-l-4 border-blue-500";
      case "completed":
        return "bg-green-100 text-green-800 border-l-4 border-green-500";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-l-4 border-gray-500";
      default:
        return "bg-gray-100 text-gray-800 border-l-4 border-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <Zap className="h-4 w-4 mr-1 text-red-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 mr-1 text-blue-500" />;
      case "completed":
        return <Play className="h-4 w-4 mr-1 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 mr-1 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  const isUpcoming = (session: LiveSession) => {
    return session.status === "scheduled" && new Date(session.scheduledAt) > new Date();
  };

  const isCompleted = (session: LiveSession) => {
    return session.status === "completed" || 
           (session.status === "scheduled" && new Date(session.scheduledAt) < new Date());
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === "upcoming") return isUpcoming(session);
    if (filter === "completed") return isCompleted(session);
    return true;
  });

  const sortedSessions = filteredSessions.sort((a, b) => {
    // Live sessions first, then upcoming, then completed
    if (a.status === "live" && b.status !== "live") return -1;
    if (a.status !== "live" && b.status === "live") return 1;
    
    // Then sort by date
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading live sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Video className="h-6 w-6 mr-2 text-blue-600" />
              Live Sessions
            </h1>
            <p className="text-gray-600 mt-1">
              {courseId ? "Course live sessions" : "All your enrolled live sessions"}
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filter === "all" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filter === "upcoming" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                filter === "completed" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {sortedSessions.length > 0 ? (
        <div className="space-y-4">
          {sortedSessions.map((session) => {
            const isSubscribed = subscribedSessions.has(session._id);
            const isSessionUpcoming = isUpcoming(session);
            const isSessionCompleted = isCompleted(session);
            
            return (
              <div 
                key={session._id} 
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${getStatusColor(session.status)}`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {session.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(session.status)}`}
                        >
                          {getStatusIcon(session.status)}
                          {session.status.toUpperCase()}
                        </span>
                      </div>

                      {session.description && (
                        <p className="text-gray-600 mb-3">{session.description}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {new Date(session.scheduledAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {new Date(session.scheduledAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{session.attendees?.length || 0} attendees</span>
                        </div>
                        <div className="flex items-center">
                          <Video className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{session.duration} minutes</span>
                        </div>
                      </div>

                      {session.instructor && (
                        <div className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Instructor: </span>
                          {session.instructor.name}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-4">
                      {session.status === "live" && (
                        <button
                          onClick={() => handleJoinSession(session._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center animate-pulse"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Join Live Now
                        </button>
                      )}
                      
                      {isSessionUpcoming && (
                        <>
                          <button
                            onClick={() => handleJoinSession(session._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Get Meeting Link
                          </button>
                          
                          <button
                            onClick={() => handleToggleSubscription(session._id, isSubscribed)}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
                              isSubscribed
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {isSubscribed ? (
                              <>
                                <BellOff className="h-4 w-4 mr-2" />
                                Unsubscribe
                              </>
                            ) : (
                              <>
                                <Bell className="h-4 w-4 mr-2" />
                                Get Reminders
                              </>
                            )}
                          </button>
                        </>
                      )}
                      
                      {isSessionCompleted && session.recording?.available && (
                        <button 
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                          onClick={() => window.open(session.recording.url, '_blank')}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Recording
                        </button>
                      )}
                      
                      {session.materials && session.materials.length > 0 && (
                        <button
                          onClick={() => handleDownloadMaterials(session._id, session.materials)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Materials ({session.materials.length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === "all" 
              ? "No live sessions scheduled" 
              : filter === "upcoming" 
                ? "No upcoming sessions" 
                : "No completed sessions"}
          </h3>
          <p className="text-gray-600">
            {filter === "all" 
              ? "Live sessions will appear here when scheduled by your instructor" 
              : filter === "upcoming" 
                ? "Check back later for upcoming sessions" 
                : "Completed sessions will appear here after they finish"}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveSessions;