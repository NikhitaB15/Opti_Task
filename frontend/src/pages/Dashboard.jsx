
import TaskList from "../components/TaskList";
import React from "react";
import TaskStats from "../components/TaskStats";
import Chatbot from "../components/Chatbot";
const Dashboard = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Task Dashboard
      </h1>
      <TaskStats/>
      <TaskList />
      {/* <Chatbot/> */}
    </div>
  );
};

export default Dashboard;
