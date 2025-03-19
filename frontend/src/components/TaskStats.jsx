import { useEffect, useState } from "react";
import { fetchTaskSummary } from "../api/tasks";
import { useAuth } from "../context/AuthContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import React from "react";

const TaskStats = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetchTaskSummary(token);
        setStats(response.data);
      } catch (err) {
        setError("Failed to load task statistics.");
        console.error("Error fetching task summary:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  if (loading) return <p className="text-center text-blue-600">Loading task statistics...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!stats) return null;

  // Data for Pie Chart (Task Completion)
  const completionData = [
    { name: "Completed", value: stats.completedTasks },
    { name: "Pending", value: stats.pendingTasks },
  ];
  const COLORS = ["#00C49F", "#FF8042"];

  // Data for Bar Chart (Task Priority Distribution)
  const priorityData = [
    { name: "High", value: stats.highPriority },
    { name: "Medium", value: stats.mediumPriority },
    { name: "Low", value: stats.lowPriority },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Task Overview</h2>

      {/* Task Completion Pie Chart */}
      <div className="flex justify-center my-6">
        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie data={completionData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
              {completionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Task Priority Bar Chart */}
      <div className="flex justify-center my-6">
        <ResponsiveContainer width="80%" height={300}>
          <BarChart data={priorityData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value">
  {priorityData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={["#FF0000", "#FFA500", "#008000"][index]} />
  ))}
</Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskStats;
