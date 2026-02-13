import { useEffect, useState } from "react";
import api from "../services/api";
import { formatCurrency } from "../utils/format";
import { CreditCard, AlertTriangle, TrendingUp, CheckCircle, Activity, DollarSign } from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/api/loans/dashboard_summary/");
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex h-full items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    // Mock data for Line Chart (Outstanding Balance History)
    // In a real app, this would come from a historical data endpoint
    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Outstanding Balance",
                data: [
                    stats?.outstanding_balance * 1.2 || 120000,
                    stats?.outstanding_balance * 1.15 || 115000,
                    stats?.outstanding_balance * 1.1 || 110000,
                    stats?.outstanding_balance * 1.05 || 105000,
                    stats?.outstanding_balance * 1.02 || 102000,
                    stats?.outstanding_balance || 100000
                ], // Simulated decline
                borderColor: "rgb(79, 70, 229)",
                backgroundColor: "rgba(79, 70, 229, 0.5)",
                tension: 0.4,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: {
                    borderDash: [2, 4],
                    color: "rgba(0,0,0,0.05)",
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Data for Pie Chart
    const pieChartData = {
        labels: ["Paid", "Overdue", "Pending"],
        datasets: [
            {
                data: [stats?.total_paid || 0, stats?.total_overdue || 0, stats?.total_pending || 0],
                backgroundColor: [
                    "rgba(16, 185, 129, 0.8)", // Green
                    "rgba(239, 68, 68, 0.8)",  // Red
                    "rgba(245, 158, 11, 0.8)", // Yellow
                ],
                borderColor: [
                    "rgba(16, 185, 129, 1)",
                    "rgba(239, 68, 68, 1)",
                    "rgba(245, 158, 11, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, here's your financial summary.</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Activity size={16} className="text-indigo-500" />
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Outstanding Balance"
                    value={formatCurrency(stats?.outstanding_balance || 0)}
                    icon={TrendingUp}
                    color="blue"
                    trend="2.5% decrease"
                    trendColor="text-green-500"
                />
                <StatCard
                    title="Total Pending EMIs"
                    value={formatCurrency(stats?.total_pending || 0)}
                    icon={CreditCard}
                    color="orange"
                    trend="Due soon"
                    trendColor="text-orange-500"
                />
                <StatCard
                    title="Total Overdue"
                    value={formatCurrency(stats?.total_overdue || 0)}
                    icon={AlertTriangle}
                    color="red"
                    trend="Action required"
                    trendColor="text-red-500"
                />
                <StatCard
                    title="Total Paid"
                    value={formatCurrency(stats?.total_paid || 0)}
                    icon={CheckCircle}
                    color="green"
                    trend="Great job!"
                    trendColor="text-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
                        Balance History
                    </h3>
                    <div className="h-72">
                        <Line options={lineChartOptions} data={lineChartData} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Status</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Pie options={pieChartOptions} data={pieChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend, trendColor }) => {
    const colorStyles = {
        blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
        orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
        red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
        green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
    };

    const style = colorStyles[color] || colorStyles.blue;

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${style.bg} ${style.text} group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                </div>
                {trend && <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );
};

export default Dashboard;
