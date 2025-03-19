// import { useEffect, useState } from "react";
// import { fetchTaskSummary } from "../api/tasks";
// import { useAuth } from "../context/AuthContext";
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import React from "react";

// const TaskStats = () => {
//   const { token } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         setLoading(true);
//         const response = await fetchTaskSummary(token);
//         setStats(response.data);
//       } catch (err) {
//         setError("Failed to load task statistics.");
//         console.error("Error fetching task summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadStats();
//   }, [token]);

//   if (loading) return <p className="text-center text-blue-600">Loading task statistics...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!stats) return null;

//   // Data for Pie Chart (Task Completion)
//   const completionData = [
//     { name: "Completed", value: stats.completedTasks },
//     { name: "Pending", value: stats.pendingTasks },
//   ];
//   const COLORS = ["#00C49F", "#FF8042"];

//   // Data for Bar Chart (Task Priority Distribution)
//   const priorityData = [
//     { name: "High", value: stats.highPriority },
//     { name: "Medium", value: stats.mediumPriority },
//     { name: "Low", value: stats.lowPriority },
//   ];

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">Task Overview</h2>

//       {/* Task Completion Pie Chart */}
//       <div className="flex justify-center my-6">
//         <ResponsiveContainer width="50%" height={300}>
//           <PieChart>
//             <Pie data={completionData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
//               {completionData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Task Priority Bar Chart */}
//       <div className="flex justify-center my-6">
//         <ResponsiveContainer width="80%" height={300}>
//           <BarChart data={priorityData}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value">
//   {priorityData.map((entry, index) => (
//     <Cell key={`cell-${index}`} fill={["#FF0000", "#FFA500", "#008000"][index]} />
//   ))}
// </Bar>

//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default TaskStats;


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
  const [activeIndex, setActiveIndex] = useState(null);

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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200 transition-all duration-300 transform hover:shadow-lg">
      <p className="text-center text-red-500 font-medium flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    </div>
  );

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

  const handlePieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 relative overflow-hidden">
        Task Overview
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Pie Chart */}
        <div className="bg-gray-50 p-4 rounded-lg transition-all duration-150 hover:shadow-md hover:bg-gray-100 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Task Completion Status</h3>
          <div className="flex justify-center my-4">
            <ResponsiveContainer width="75%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50} // Define inner radius for better doughnut appearance
                  outerRadius={100} // Define outer radius to avoid breaking
                  fill="#8884d8"
                  dataKey="value"
                  startAngle={90} // Ensure smooth segment start
                  endAngle={-270} // Properly distribute the segments
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

          </div>
          <div className="flex justify-center gap-6 mt-2">
            {completionData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Priority Bar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Task Priority Distribution</h3>
          <div className="flex justify-center my-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  className="transition-all duration-300 hover:opacity-80"
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#EF4444", "#F59E0B", "#10B981"][index]}
                      className="hover:opacity-90 transition-opacity duration-300"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 border border-blue-100">
          <h4 className="text-sm font-medium text-blue-700">Total Tasks</h4>
          <p className="text-2xl font-bold">{stats.completedTasks + stats.pendingTasks}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 border border-green-100">
          <h4 className="text-sm font-medium text-green-700">Completed</h4>
          <p className="text-2xl font-bold">{stats.completedTasks}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 border border-orange-100">
          <h4 className="text-sm font-medium text-orange-700">Pending</h4>
          <p className="text-2xl font-bold">{stats.pendingTasks}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 border border-red-100">
          <h4 className="text-sm font-medium text-red-700">High Priority</h4>
          <p className="text-2xl font-bold">{stats.highPriority}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;