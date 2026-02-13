import { useEffect, useState } from "react";
import api from "../services/api";
import { formatDate } from "../utils/format";
import { Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const Reminders = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await api.get("/api/reminders/");
                setReminders(response.data);
            } catch (error) {
                console.error("Failed to fetch reminders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReminders();
    }, []);

    const handleTriggerReminders = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/reminders/trigger/");

            // Extract meaningful message from backend output if possible
            const output = res.data.details || "";
            const match = output.match(/Job completed\.\s+(.*)/);
            const summary = match ? match[1] : res.data.message;

            toast.info(summary, { autoClose: 5000 });

            // Refresh list
            const response = await api.get("/api/reminders/");
            setReminders(response.data);
        } catch (error) {
            console.error("Failed to trigger reminders", error);
            toast.error("Failed to send reminders.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading reminders...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Email Reminders</h1>
                <button
                    onClick={handleTriggerReminders}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm flex items-center"
                >
                    <Mail className="mr-2" size={16} />
                    Send Reminders Now
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3">Loan</th>
                            <th className="px-6 py-3">Due Date</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Sent At</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reminders.map((reminder) => (
                            <tr key={reminder.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{reminder.loan_name || "N/A"}</td>
                                <td className="px-6 py-4">{formatDate(reminder.reminder_date)}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center text-gray-500">
                                        <Mail size={16} className="mr-2" />
                                        {reminder.reminder_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {reminder.sent_at ? new Date(reminder.sent_at).toLocaleString() : "-"}
                                </td>
                                <td className="px-6 py-4">
                                    {reminder.is_sent ? (
                                        <span className="flex items-center text-green-600 font-medium text-xs">
                                            <CheckCircle size={14} className="mr-1" /> Sent
                                        </span>
                                    ) : new Date(reminder.reminder_date) > new Date() ? (
                                        <span className="flex items-center text-blue-500 font-medium text-xs">
                                            <Clock size={14} className="mr-1" /> Scheduled
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-500 font-medium text-xs">
                                            <XCircle size={14} className="mr-1" /> Failed/Overdue
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reminders.length === 0 && (
                    <div className="p-8 text-center text-gray-400">No reminders sent yet.</div>
                )}
            </div>
        </div>
    );
};

export default Reminders;
