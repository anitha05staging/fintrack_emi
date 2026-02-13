import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ChevronLeft } from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";

const ApplyLoan = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        loan_name: "",
        loan_type: "Personal",
        total_amount: "",
        interest_rate: "",
        tenure_months: "",
        start_date: new Date().toISOString().split("T")[0],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/loans/", formData);
            toast.success("Loan application submitted successfully!");
            navigate("/loans");
        } catch (error) {
            console.error("Failed to apply for loan", error);
            toast.error("Failed to submit loan application. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate("/loans")}
                className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
                <ChevronLeft size={20} />
                <span className="ml-1">Back to Loans</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-900">Apply for a New Loan</h1>
                    <p className="text-gray-500 text-sm mt-1">Enter loan details to generate your EMI schedule.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Loan Name</label>
                            <input
                                type="text"
                                name="loan_name"
                                required
                                value={formData.loan_name}
                                onChange={handleChange}
                                placeholder="e.g. Home Renovation"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Loan Type</label>
                            <select
                                name="loan_type"
                                value={formData.loan_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="Personal">Personal Loan</option>
                                <option value="Housing">Housing Loan</option>
                                <option value="Car">Car Loan</option>
                                <option value="Education">Education Loan</option>
                                <option value="Gold">Gold Loan</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Principal Amount (₹)</label>
                            <input
                                type="number"
                                name="total_amount"
                                required
                                min="1000"
                                value={formData.total_amount}
                                onChange={handleChange}
                                placeholder="50000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Interest Rate (% p.a)</label>
                            <input
                                type="number"
                                name="interest_rate"
                                required
                                min="0.1"
                                step="0.1"
                                value={formData.interest_rate}
                                onChange={handleChange}
                                placeholder="12.5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tenure (Months)</label>
                            <input
                                type="number"
                                name="tenure_months"
                                required
                                min="1"
                                value={formData.tenure_months}
                                onChange={handleChange}
                                placeholder="12"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                required
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={clsx(
                                "px-6 py-2.5 rounded-lg text-white font-medium shadow-md transition-all",
                                loading
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
                            )}
                        >
                            {loading ? "Processing..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyLoan;
