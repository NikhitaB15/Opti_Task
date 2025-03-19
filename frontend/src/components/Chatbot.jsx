import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Chatbot as fetchChatbotResponse } from "../api/auth";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
  
    try {
      const response = await fetchChatbotResponse(input);
      const botMessage = { sender: "bot", text: response.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        <MessageCircle size={24} />
      </button>
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col absolute bottom-12 right-0 border border-gray-300">
          <div className="bg-blue-600 text-white p-3 text-center font-semibold rounded-t-lg">
            Virtual Assistant
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-white max-w-xs ${
                  msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-500 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-2 border-t border-gray-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
