import React, { useState } from 'react';
import { Link } from 'react-router-dom';
 
const Help = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
 
  // FAQ data
  const faqItems = [
    {
      question: "How do I create a new task?",
      answer: "To create a new task, navigate to the Dashboard and click on the '+ Add Task' button. Fill in the required details like title, description, due date, and priority, then click 'Save'."
    },
    {
      question: "Can I share tasks with other users?",
      answer: "Yes, you can share tasks with other users by clicking the 'Share' button on any task and entering their email address or username. They will receive a notification once you've shared the task."
    },
    {
      question: "How do I change my password?",
      answer: "To change your password, go to Settings > Account Settings > Change Password. You'll need to enter your current password and then your new password twice to confirm."
    },
    {
      question: "How do I switch between dark and light mode?",
      answer: "You can switch between dark and light mode by clicking the theme toggle button in the navigation bar. The button shows a sun icon for light mode and a moon icon for dark mode."
    },
    {
      question: "What are the different task priority levels?",
      answer: "Tasks can be assigned one of four priority levels: Low, Medium, High, and Urgent. Each level is color-coded to help you quickly identify task priorities."
    }
  ];
 
  // Filter FAQ items based on search query
  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Help Center</h1>
 
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full p-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
 
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Navigation */}
        <div className="md:w-1/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Topics</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection('getting-started')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection === 'getting-started'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Getting Started
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('faq')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection === 'faq'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('tutorials')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection === 'tutorials'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Video Tutorials
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('troubleshooting')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection === 'troubleshooting'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Troubleshooting
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('contact')}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeSection === 'contact'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>
 
        {/* Right Content */}
        <div className="md:w-3/4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {activeSection === 'getting-started' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Getting Started</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Welcome to Task Manager</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Task Manager helps you organize your work and stay on top of your responsibilities.
                      This guide will help you get started with the basic features.
                    </p>
                  </div>
 
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">1. Create Your First Task</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Start by creating your first task to get familiar with the system:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>Navigate to the Dashboard</li>
                      <li>Click the "+ Add Task" button in the top right corner</li>
                      <li>Fill in the task details (title, description, due date, priority)</li>
                      <li>Click "Save" to create your task</li>
                    </ol>
                    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Pro tip: Use keyboard shortcut Ctrl+N (or Cmd+N on Mac) to quickly create a new task from anywhere in the app.
                        </span>
                      </div>
                    </div>
                  </div>
 
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">2. Organize Your Tasks</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Keep your tasks organized by using these features:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>Assign priority levels to differentiate urgent tasks</li>
                      <li>Set due dates to track deadlines</li>
                      <li>Use tags to categorize tasks by project or type</li>
                      <li>Create subtasks for complex items that require multiple steps</li>
                    </ul>
                  </div>
 
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">3. Track Your Progress</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Monitor your productivity and stay on track:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>View your task completion rate on the Dashboard</li>
                      <li>Check overdue tasks in the "Overdue" section</li>
                      <li>Review completed tasks in the "Completed" tab</li>
                      <li>Set up reminders for upcoming deadlines</li>
                    </ul>
                  </div>
 
                  <div className="flex justify-end">
                    <Link
                      to="/dashboard"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}
 
            {activeSection === 'faq' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Frequently Asked Questions</h2>
               
                {searchQuery && filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(searchQuery ? filteredFAQs : faqItems).map((item, index) => (
                      <details key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <summary className="px-4 py-3 cursor-pointer text-gray-800 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-600">
                          {item.question}
                        </summary>
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            )}
 
 
 {activeSection === 'tutorials' && (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      Video Tutorials
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {[
        {
          title: "Getting Started with Task Manager",
          description: "Learn the basics of Task Manager in this quick overview tutorial.",
          time: "5:24 • Updated 2 months ago",
          image: "https://via.placeholder.com/400x225",
        },
        {
          title: "Advanced Features & Shortcuts",
          description: "Discover time-saving tips and advanced functionality.",
          time: "8:12 • Updated 1 month ago",
          image: "https://via.placeholder.com/400x225",
        },
        {
          title: "Collaborating with Team Members",
          description: "Learn how to share tasks and work together effectively.",
          time: "6:48 • Updated 3 weeks ago",
          image: "https://via.placeholder.com/400x225",
        },
        {
          title: "Generating Reports & Analytics",
          description: "Track productivity and measure progress with built-in reports.",
          time: "7:33 • Updated 1 week ago",
          image: "https://via.placeholder.com/400x225",
        },
      ].map((tutorial, index) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <img src={tutorial.image} alt={tutorial.title} className="w-full h-full object-cover" />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          {/* Tutorial Details */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              {tutorial.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {tutorial.description}
            </p>
            <span className="text-sm text-gray-500 dark:text-gray-400">{tutorial.time}</span>
          </div>
        </div>
      ))}
      
    </div>
  </div>
)}


            {activeSection === 'troubleshooting' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Troubleshooting</h2>
               
                <div className="space-y-6">
                  {/* Common Issues */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Common Issues</h3>
                   
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Can't log in to my account</h4>
                        <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                          <li>Verify that you're using the correct email address</li>
                          <li>Check that Caps Lock is not enabled</li>
                          <li>Try resetting your password using the "Forgot Password" link</li>
                          <li>Clear your browser cache and cookies</li>
                          <li>Try using a different browser or device</li>
                        </ol>
                      </div>
 
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Task changes not saving</h4>
                        <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                          <li>Check your internet connection</li>
                          <li>Make sure you're clicking the "Save" button after making changes</li>
                          <li>Try refreshing the page (your changes may be saved but not displayed)</li>
                          <li>Clear your browser cache and reload the page</li>
                          <li>Contact support if the problem persists</li>
                        </ol>
                      </div>
 
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Notifications not working</h4>
                        <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                          <li>Check your notification settings in the Settings page</li>
                          <li>Ensure notifications are enabled in your browser</li>
                          <li>Verify that your email address is correct in your profile</li>
                          <li>Check your email spam folder</li>
                          <li>Try using a different browser</li>
                        </ol>
                      </div>
                    </div>
                  </div>
 
                  {/* Error Messages */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Common Error Messages</h3>
                   
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">"Something went wrong" error</h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          This is a general error that can occur for various reasons. Try:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                          <li>Refreshing the page</li>
                          <li>Logging out and back in</li>
                          <li>Clearing your browser cache</li>
                          <li>Contacting support if the error persists</li>
                        </ul>
                      </div>
 
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">"Unauthorized" error</h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          This error occurs when you don't have permission to access a resource or your session has expired.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                          <li>Log out and log back in</li>
                          <li>Check if you have the necessary permissions</li>
                          <li>Contact your administrator if you believe you should have access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
 
                  {/* System Requirements */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">System Requirements</h3>
                   
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Supported Browsers</h4>
                      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                        <li>Chrome (latest version)</li>
                        <li>Firefox (latest version)</li>
                        <li>Safari (latest version)</li>
                        <li>Edge (latest version)</li>
                      </ul>
                     
                      <h4 className="font-semibold mt-4 mb-2 text-gray-800 dark:text-white">Mobile Devices</h4>
                      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                        <li>iOS 13 or later</li>
                        <li>Android 8.0 or later</li>
                      </ul>
                     
                      <h4 className="font-semibold mt-4 mb-2 text-gray-800 dark:text-white">Required Settings</h4>
                      <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                        <li>JavaScript must be enabled</li>
                        <li>Cookies must be enabled</li>
                        <li>Local storage must be enabled</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
 
            {activeSection === 'contact' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Contact Support</h2>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Email Support</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
                      Send us an email and we'll get back to you within 24 hours.
                    </p>
                    <a href="mailto:support@taskmanager.com" className="text-blue-600 dark:text-blue-400 font-medium">
                      support@taskmanager.com
                    </a>
                  </div>
 
                 </div>
                </div>
            )}
        </div>
    </div>
        </div>
        </div>
 
    );
}
 
 export default Help;