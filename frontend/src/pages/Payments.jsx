import { useEffect, useState } from "react";
import api from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import clsx from "clsx";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL"); // ALL, PAID, PENDING, OVERDUE

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            let url = "/api/payments/";
            if (filter !== "ALL") {
                url += `?status=${filter}`;
            }
            const response = await api.get(url);
            setPayments(response.data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
            toast.error("Failed to fetch payments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [filter]);

    const initiatePayment = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setIsModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        if (!selectedPaymentId) return;
        try {
            await api.post(`/api/payments/${selectedPaymentId}/mark_paid/`);
            fetchPayments();
            toast.success("Payment marked as PAID successfully!");
        } catch (error) {
            console.error("Payment failed", error);
            toast.error("Failed to mark payment as paid.");
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                    <p className="text-gray-500 text-sm mt-1">Track all your EMI payments and status.</p>
                </div>
                <div className="flex space-x-2">
                    {["ALL", "PAID", "PENDING", "OVERDUE"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                filter === status
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            )}
                        >
                            {status === "ALL" ? "All Payments" : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading payments...</div>
                ) : payments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No payments found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3">Loan</th>
                                    <th className="px-6 py-3">Due Date</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-right">Penalty</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {payment.loan_name || `Loan #${payment.loan}`}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{formatDate(payment.due_date)}</td>
                                        <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(payment.emi_amount)}</td>
                                        <td className="px-6 py-4 text-right text-red-500">
                                            {payment.penalty_amount > 0 ? formatCurrency(payment.penalty_amount) : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            <div>
                                                {formatCurrency(parseFloat(payment.emi_amount) + parseFloat(payment.penalty_amount))}
                                                {parseFloat(payment.penalty_amount) > 0 && (
                                                    <div className="text-xs text-xs text-gray-500 font-normal mt-1">
                                                        ({formatCurrency(payment.emi_amount)} + <span className="text-red-500">{formatCurrency(payment.penalty_amount)}</span>)
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={clsx(
                                                "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                payment.status === 'PAID' ? "bg-green-100 text-green-700" :
                                                    payment.status === 'OVERDUE' ? "bg-red-100 text-red-700" :
                                                        "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {payment.status !== "PAID" && (
                                                <button
                                                    onClick={() => initiatePayment(payment.id)}
                                                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition shadow-sm"
                                                >
                                                    Pay
                                                </button>
                                            )}
                                            {payment.status === "PAID" && (
                                                <span className="text-gray-400 text-xs">Paid on {formatDate(payment.paid_date)}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmPayment}
                title="Confirm Payment"
                message="Are you sure you want to mark this EMI as PAID? This action will update the outstanding balance and cannot be undone directly."
                confirmText="Yes, Mark Paid"
            />
        </div>
    );
};

export default Payments;
