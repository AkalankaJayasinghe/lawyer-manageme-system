import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messageAPI } from '../services/api';
import Layout from '../layout/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import io from 'socket.io-client';

const MessagingPage = () => {
  const { user, isLawyer, isUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
      joinRoom(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    
    socketRef.current.emit('join', user?._id);

    socketRef.current.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('userTyping', (data) => {
      if (data.userId !== user?._id) {
        setIsTyping(data.isTyping);
      }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  };

  const fetchConversations = async () => {
    try {
      // This would need to be implemented in the backend
      // For now, using mock data
      const mockConversations = [
        {
          _id: '1',
          otherUser: isLawyer() ? { name: 'John Smith', role: 'user' } : { name: 'Sarah Johnson', role: 'lawyer' },
          lastMessage: 'Thanks for your help!',
          lastMessageTime: new Date(),
          unreadCount: 2
        },
        {
          _id: '2',
          otherUser: isLawyer() ? { name: 'Emily Davis', role: 'user' } : { name: 'Michael Chen', role: 'lawyer' },
          lastMessage: 'I will prepare the documents',
          lastMessageTime: new Date(Date.now() - 3600000),
          unreadCount: 0
        }
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // This would need to be implemented in the backend
      const mockMessages = [
        {
          _id: '1',
          senderId: conversationId,
          receiverId: user?._id,
          content: 'Hello, I need legal advice',
          timestamp: new Date(Date.now() - 86400000),
          isRead: true
        },
        {
          _id: '2',
          senderId: user?._id,
          receiverId: conversationId,
          content: 'I would be happy to help. What is your issue about?',
          timestamp: new Date(Date.now() - 86400000 + 300000),
          isRead: true
        }
      ];
      setConversations([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const joinRoom = (conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('join', conversationId);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation._id,
      receiverId: selectedConversation.otherUser._id,
      content: newMessage.trim()
    };

    try {
      const response = await messageAPI.sendMessage(messageData);
      const message = {
        _id: response.data._id,
        senderId: user._id,
        receiverId: messageData.receiverId,
        content: newMessage.trim(),
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Send via socket for real-time delivery
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', {
          ...message,
          roomId: selectedConversation._id
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socketRef.current && selectedConversation) {
      socketRef.current.emit('typing', {
        roomId: selectedConversation._id,
        userId: user._id,
        isTyping: e.target.value.length > 0
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-120px)]">
        <div className="flex h-full bg-white rounded-lg border border-gray-200">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600">
                Your conversations with {isLawyer() ? 'clients' : 'lawyers'}
              </p>
            </div>
            
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full text-left p-4 hover:bg-gray-50 ${
                    selectedConversation?._id === conversation._id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {conversation.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.otherUser.name}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400">
                        {conversation.lastMessageTime.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedConversation.otherUser.name}
                        </h2>
                        <p className="text-xs text-gray-500 capitalize">
                          {selectedConversation.otherUser.role}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?._id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === user?._id ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 px-4 py-2 rounded-lg">
                        <p className="text-sm text-gray-500">Typing...</p>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagingPage;