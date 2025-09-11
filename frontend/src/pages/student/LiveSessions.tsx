import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { liveSessionAPI } from '../../services/api';
import { Calendar, Clock, Users, Video, ExternalLink } from 'lucide-react';
import { LiveSession } from '../../types';

const LiveSessions: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchSessions();
    }
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      const response = await liveSessionAPI.getCourseSessions(courseId!);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const response = await liveSessionAPI.joinSession(sessionId);
      if (response.data.meetingLink) {
        window.open(response.data.meetingLink, '_blank');
      }
    } catch (error) {
      console.error('Error joining session:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Live Sessions</h2>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session._id} className="card border-l-4 border-primary-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {session.description && (
                    <p className="text-gray-600 mb-3">{session.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{new Date(session.scheduledAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{session.attendees.length} attendees</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      <span>{session.duration} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  {session.status === 'live' && (
                    <button
                      onClick={() => handleJoinSession(session._id)}
                      className="btn-primary flex items-center animate-pulse"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Join Live
                    </button>
                  )}
                  {session.status === 'scheduled' && (
                    <button
                      onClick={() => handleJoinSession(session._id)}
                      className="btn-secondary flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Link
                    </button>
                  )}
                  {session.status === 'completed' && session.recording?.available && (
                    <button className="btn-secondary flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Watch Recording
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No live sessions scheduled</h3>
          <p className="text-gray-600">Live sessions will appear here when scheduled by your instructor</p>
        </div>
      )}
    </div>
  );
};

export default LiveSessions;