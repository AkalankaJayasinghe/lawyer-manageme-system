import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../../services/api';
import Spinner from '../ui/Spinner';
import ErrorMessage from '../ui/ErrorMessage';

const MessageThread = ({ recipientId, recipientName, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      setError('');
      const data = await messageAPI.getMessages(recipientId);
      setMessages(data.data || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recipientId) {
      fetchMessages();
    }
  }, [recipientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((msg) => {
      const date = formatDate(msg.createdAt || msg.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchMessages} />;
  }

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
          <svg className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="font-medium">No messages yet</p>
          <p className="text-sm mt-1">Start a conversation with {recipientName || 'this user'}</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 px-2">{date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-2">
              {msgs.map((msg) => {
                const isSent = (msg.senderId || msg.sender_id) === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
                        isSent
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content || msg.message}</p>
                      <p className={`text-xs mt-1 ${isSent ? 'text-blue-200' : 'text-gray-400'}`}>
                        {formatTime(msg.createdAt || msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageThread;
