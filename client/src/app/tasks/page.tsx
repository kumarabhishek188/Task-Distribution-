"use client";
import { useEffect, useMemo, useState } from "react";
import { getTasks } from "../../utils/api";
import Card from "../../components/ui/Card";
import Alert from "../../components/ui/Alert";

interface Lead {
  [key: string]: string;
}

interface Task {
  _id: string;
  lead: Lead;
  agent: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  
  // Check if running client-side
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      getTasks(token)
        .then((data) => {
          if (Array.isArray(data)) {
            setTasks(data);
          } else {
            setError("Invalid data format received");
          }
        })
        .catch(() => setError("Failed to fetch tasks"));
    } else {
      setError("Authentication token not found");
    }
  }, [token]);

  // Defensive: ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Group tasks by agent name
  const tasksGroupedByAgent = safeTasks.reduce<Record<string, Task[]>>((acc, task) => {
    const agentName = task.agent?.name || "Unknown";
    if (!acc[agentName]) {
      acc[agentName] = [];
    }
    acc[agentName].push(task);
    return acc;
  }, {});
  const filtered = useMemo(() => {
    if (!query.trim()) return tasksGroupedByAgent;
    const q = query.toLowerCase();
    const out: Record<string, Task[]> = {};
    for (const [agentName, list] of Object.entries(tasksGroupedByAgent)) {
      const matchAgent = agentName.toLowerCase().includes(q);
      const matchLeads = list.filter((t) =>
        Object.entries(t.lead).some(([k, v]) => `${k}:${v}`.toLowerCase().includes(q))
      );
      if (matchAgent || matchLeads.length) out[agentName] = matchLeads.length ? matchLeads : list;
    }
    return out;
  }, [query, tasksGroupedByAgent]);

  const sortedAgentNames = Object.keys(filtered).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 p-8 flex flex-col items-center">
      <Card className="p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-700 text-center">Task Distribution</h1>

        {error && <Alert tone="error">{error}</Alert>}

        <div className="mb-6 flex justify-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by agent or lead fields…"
            className="w-full max-w-xl p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>

        {sortedAgentNames.length === 0 && !error && (
          <p className="text-center text-gray-500">No tasks found.</p>
        )}

        <div className="space-y-6">
          {sortedAgentNames.map((agentName) => {
            const agentTasks = filtered[agentName];
            const firstAgent = agentTasks[0]?.agent;
            const isOpen = open[agentName] ?? true;

            return (
              <div key={agentName} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen((o) => ({ ...o, [agentName]: !isOpen }))}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{agentName}</h2>
                    <div className="text-sm text-gray-600">
                      {firstAgent?.email && <span className="mr-3 text-blue-600">{firstAgent.email}</span>}
                      {firstAgent?.phone && <span>{firstAgent.phone}</span>}
                    </div>
                  </div>
                  <span className="text-purple-700 font-medium">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="p-4">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-purple-100">
                          <th className="text-left p-3 border border-gray-200">Lead Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agentTasks.map((task) => (
                          <tr key={task._id} className="border-b border-gray-200 hover:bg-purple-50">
                            <td className="p-3 align-top text-gray-800">
                              {Object.entries(task.lead).map(([key, value]) => (
                                <div key={key} className="mb-1">
                                  <strong>{key}:</strong> {String(value)}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}