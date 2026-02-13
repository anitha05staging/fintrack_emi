import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import clsx from "clsx";

const LoanDetails = () => {
    const { id } = useParams();
    const [loan, setLoan] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            // 1. Fetch Loan Metadata
            const loanRes = await api.get(`/api/loans/${id}/`);
            setLoan(loanRes.data);

            // 2. Fetch Payments (EMI Schedule)
            const paymentsRes = await api.get(`/api/payments/?loan_id=${id}`);
            setPayments(paymentsRes.data);
        } catch (error) {
            console.error("Failed to fetch loan details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleMarkPaid = async (paymentId) => {
        if (!window.confirm("Are you sure you want to mark this EMI as PAID?")) return;

        try {
            await api.post(`/api/payments/${paymentId}/mark_paid/`);
            // Refresh data to show updated status/balance
            await fetchDetails();
            alert("Payment successful!");
        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to mark payment as paid.");
        }
    };

    if (loading) return <div className="p-8">Loading details...</div>;
    if (!loan) return <div className="p-8 text-red-500">Loan not found.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{loan.loan_name}</h1>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">ID: {loan.loan_id}</span>
                        <span>•</span>
                        <span>Started: {formatDate(loan.start_date)}</span>
                        <span>•</span>
                        <StatusBadge status={loan.status} />
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Loan Amount</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(loan.total_amount)}</p>
                </div>
            </div>

            {/* Loan Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-xl font-bold text-gray-800">{loan.interest_rate}%</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Tenure</p>
                    <p className="text-xl font-bold text-gray-800">{loan.tenure_months} Months</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Next EMI Due</p>
                    <p className="text-xl font-bold text-indigo-600">
                        {payments.find(p => p.status === 'PENDING')?.due_date
                            ? formatDate(payments.find(p => p.status === 'PENDING')?.due_date)
                            : 'Completed'}
                    </p>
                </div>
            </div>

            {/* EMI Schedule Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Repayment Schedule</h3>
                    <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                        {payments.filter(p => p.status === 'PAID').length} / {payments.length} Paid
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Due Date</th>
                                <th className="px-6 py-3 text-right">EMI</th>
                                <th className="px-6 py-3 text-right">Penalty</th>
                                <th className="px-6 py-3 text-right">Total</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Balance</th>
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((payment, index) => (
                                <tr key={payment.id} className={clsx("transition-colors", payment.status === 'PAID' ? "bg-gray-50/30 text-gray-400" : "hover:bg-gray-50")}>
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{formatDate(payment.due_date)}</td>
                                    <td className="px-6 py-4 text-right">{formatCurrency(payment.emi_amount)}</td>
                                    <td className="px-6 py-4 text-right">
                                        {payment.penalty_amount > 0 && <span className="text-red-500 font-medium">{formatCurrency(payment.penalty_amount)}</span>}
                                        {payment.penalty_amount <= 0 && "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {formatCurrency(parseFloat(payment.emi_amount) + parseFloat(payment.penalty_amount))}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-xs">
                                        {formatCurrency(payment.outstanding_balance_after_payment)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {payment.status !== "PAID" ? (
                                            <button
                                                onClick={() => handleMarkPaid(payment.id)}
                                                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition shadow-sm"
                                            >
                                                Pay
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">Paid</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        PAID: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        OVERDUE: "bg-red-100 text-red-700",
    };
    return (
        <span className={clsx("px-2 py-1 rounded-full text-xs font-semibold", styles[status] || "bg-gray-100")}>
            {status}
        </span>
    );
};

export default LoanDetails;
