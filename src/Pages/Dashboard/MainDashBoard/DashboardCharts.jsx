import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Card from "../../../components/ui/Card";

const COLORS = ["#b91c1c", "#1d4ed8", "#059669", "#d97706", "#7c3aed", "#64748b"];

const DashboardCharts = () => {
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get("/analytics/charts")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <h3 className="mb-4">Requests by status</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data.requestsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.requestsByStatus.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="mb-4">Donors by blood group</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.donorsByBlood}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#b91c1c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="mb-4">Requests over time (6 months)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.requestsOverTime}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="mb-4">Funding over time (USD)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.fundsOverTime}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, "Amount"]} />
            <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DashboardCharts;
