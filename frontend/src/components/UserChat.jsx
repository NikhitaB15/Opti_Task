import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

// API base URL - adjust as needed
const API_BASE_URL = 'http://localhost:8000';

const UserChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminStatus, setAdminStatus] = useState({ isOnline: false, lastSeen: null });
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Fetch user's admin chat
  const fetchChat = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      
      const response = await axios.get(`${API_BASE_URL}/chats/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(response.data.messages || []);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // No chat exists yet, that's okay
        setMessages([]);
      } else {
        setError('Failed to load chat. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin status
  const fetchAdminStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats/admin/status`);
      setAdminStatus({
        isOnline: response.data.is_online,
        lastSeen: response.data.last_seen
      });
    } catch (err) {
      console.error('Failed to fetch admin status:', err);
    }
  };

  // Fetch unread message count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/chats/admin/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(response.data.unread_count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_BASE_URL}/chats/admin/message`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setNewMessage('');
      fetchChat(); // Refresh messages after sending
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      // First we need to get the chat ID
      const chatResponse = await axios.get(`${API_BASE_URL}/chats/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const chatId = chatResponse.data.id;
      
      // Then mark messages as read
      if (chatId) {
        await axios.put(
          `${API_BASE_URL}/chats/admin/read/${chatId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }}
        );
        fetchUnreadCount(); // Update unread count
      }
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchChat();
    fetchAdminStatus();
    fetchUnreadCount();
    
    // Set up periodic refreshing
    const chatInterval = setInterval(fetchChat, 15000); // Every 15 seconds
    const statusInterval = setInterval(fetchAdminStatus, 30000); // Every 30 seconds
    const unreadInterval = setInterval(fetchUnreadCount, 20000); // Every 20 seconds
    
    return () => {
      clearInterval(chatInterval);
      clearInterval(statusInterval);
      clearInterval(unreadInterval);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (messages.length > 0) {
      markMessagesAsRead();
    }
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (err) {
      return 'Unknown time';
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-100 shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Support Chat</h1>
          <div className="text-sm flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${adminStatus.isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
            {adminStatus.isOnline 
              ? 'Admin is online' 
              : `Last seen: ${adminStatus.lastSeen ? formatTimestamp(adminStatus.lastSeen) : 'Unknown'}`
            }
          </div>
        </div>
        
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
            {unreadCount}
          </div>
        )}
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start your conversation with support.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  message.is_admin 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${message.is_admin ? 'text-gray-500' : 'text-blue-100'}`}>
                  {formatTimestamp(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={sendMessage} className="border-t p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            ref={messageInputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-r-lg disabled:bg-blue-300"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserChatInterface;