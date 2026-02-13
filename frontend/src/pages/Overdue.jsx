import { useEffect, useState } from "react";
import api from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

const Overdue = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOverdue = async () => {
        try {
            const response = await api.get("/api/payments/?status=OVERDUE");
            setPayments(response.data);
        } catch (error) {
            console.error("Failed to fetch overdue payments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverdue();
    }, []);

    const handleMarkPaid = async (paymentId) => {
        if (!window.confirm("Are you sure you want to mark this overdue EMI as PAID?")) return;

        try {
            await api.post(`/api/payments/${paymentId}/mark_paid/`);
            await fetchOverdue(); // Refresh list
            alert("Payment successful!");
        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to mark payment as paid.");
        }
    };

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div>
            <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                    <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Overdue Payments</h1>
                    <p className="text-gray-500">Immediate action required for these items.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {payments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg font-medium">No overdue payments!</p>
                        <p className="text-sm">You are all caught up.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-red-50 text-red-700 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Loan ID</th>
                                    <th className="px-6 py-3">Due Date</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-right">Penalty</th>
                                    <th className="px-6 py-3 text-right">Total Due</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-red-50/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {payment.loan_id || "Loan #" + payment.loan}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-red-600">
                                            {formatDate(payment.due_date)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(payment.emi_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-red-600 font-bold">
                                            {formatCurrency(payment.penalty_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                                            {formatCurrency(parseFloat(payment.emi_amount) + parseFloat(payment.penalty_amount))}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                OVERDUE
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleMarkPaid(payment.id)}
                                                className="text-xs bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-sm transition-all transform hover:scale-105"
                                            >
                                                Pay Now
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Overdue;
