import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const AdminChatInterface = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState({
    chats: true,
    messages: false
  });
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  // Fetch all admin chats
  const fetchChats = async () => {
    try {
      setLoading(prev => ({ ...prev, chats: true }));
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/chats/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      setChats(response.data);
      setError(null);
      
      // Auto-select first chat if none selected
      if (!selectedChat && response.data.length > 0) {
        setSelectedChat(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to load chats. Please try again.');
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, chats: false }));
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async () => {
    if (!selectedChat) return;
    
    try {
      setLoading(prev => ({ ...prev, messages: true }));
      const token = localStorage.getItem('token');
      
      // Find the chat by id
      const chat = chats.find(c => c.id === selectedChat);
      
      if (chat && chat.messages) {
        setMessages(chat.messages);
        
        // Mark messages as read when opening chat
        await axios.put(
          `${API_BASE_URL}/chats/admin/read/${selectedChat}`,
          {},
          { headers: { Authorization: `Bearer ${token}` }}
        );
        
        // Refresh chats to update unread counts
        fetchChats();
        setShouldScroll(true);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  // Update admin status
  const updateAdminStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/chats/admin/status`,
        { is_online: status },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      setIsOnline(response.data.is_online);
    } catch (err) {
      console.error('Failed to update status:', err);
      setIsOnline(prev => !prev);
    }
  };

  // Send reply to user
  const sendReply = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_BASE_URL}/chats/admin/reply/${selectedChat}`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setNewMessage('');
      fetchMessages();
      fetchChats();
      setShouldScroll(true);
    } catch (err) {
      setError('Failed to send reply. Please try again.');
      console.error(err);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchChats();
    
    // Set up periodic refreshing
    const chatInterval = setInterval(fetchChats, 10000);
    return () => clearInterval(chatInterval);
  }, []);

  // Load messages when chat selection changes
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // Scroll to bottom when needed
  useEffect(() => {
    if (shouldScroll && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      setShouldScroll(false);
    }
  }, [messages, shouldScroll]);

const formatTimestamp = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  } catch (err) {
    console.error('Error formatting timestamp:', err);
    return 'Unknown time';
  }
};

  const getUnreadCount = (chat) => {
    return chat.messages?.filter(m => !m.is_admin && !m.is_read).length || 0;
  };

  const getUserNameFromTitle = (title) => {
    const parts = title.split('-');
    return parts.length > 1 ? parts[1].trim() : 'User';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white shadow-sm">
        <div className="p-4 border-b flex justify-between items-center bg-indigo-600 text-white">
          <h2 className="text-xl font-bold">Support Chats</h2>
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isOnline}
                onChange={(e) => updateAdminStatus(e.target.checked)}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              <span className="ml-1 text-sm">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </label>
          </div>
        </div>
        
        {loading.chats ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No active chats
          </div>
        ) : (
          <div className="divide-y">
            {chats.map(chat => (
              <div 
                key={chat.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chat.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">
                    {getUserNameFromTitle(chat.title)}
                  </h3>
                  {getUnreadCount(chat) > 0 && (
                    <span className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {getUnreadCount(chat)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {chat.messages?.length > 0 
                    ? chat.messages[chat.messages.length - 1].content
                    : 'No messages yet'}
                </p>
                {chat.messages?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimestamp(chat.messages[chat.messages.length - 1].created_at)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {getUserNameFromTitle(chats.find(c => c.id === selectedChat)?.title || 'Chat')}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className="text-sm text-gray-500">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {loading.messages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No messages in this chat yet</p>
                  <p className="text-sm mt-1">Start the conversation</p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_admin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 shadow-sm ${
                        message.is_admin 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div
                        className={`text-xs mt-1 flex justify-end items-center ${
                          message.is_admin ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {formatTimestamp(message.created_at)}
                        {!message.is_read && !message.is_admin && (
                          <span className="ml-1 text-red-400">•</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <form 
              onSubmit={sendReply} 
              className="p-4 border-t bg-white shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-lg font-medium">Select a chat to start messaging</h3>
            <p className="text-sm mt-1">Or wait for a user to initiate a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatInterface;