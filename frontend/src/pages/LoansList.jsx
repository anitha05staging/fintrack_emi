import { useEffect, useState } from "react";
import api from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const LoansList = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await api.get("/api/loans/");
                setLoans(response.data);
            } catch (error) {
                console.error("Failed to fetch loans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, []);

    if (loading) return <div className="p-8">Loading loans...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Loans</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your active and closed loans.</p>
                </div>
                <Link to="/loans/apply" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center">
                    + Apply New Loan
                </Link>
            </div>

            {loans.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">You have no loans yet.</p>
                    <button className="text-indigo-600 font-medium hover:underline">Apply for your first loan</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {loans.map((loan) => (
                        <Link
                            to={`/loans/${loan.id}`}
                            key={loan.id}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all flex justify-between items-center group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
                                    <span className="font-bold text-xl">{loan.loan_name.charAt(0)}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{loan.loan_name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <span className="capitalize">{loan.loan_type}</span>
                                        <span className="mx-2">•</span>
                                        <span>Started {formatDate(loan.start_date)}</span>
                                    </div>
                                    <div className="mt-3 flex gap-3 text-xs">
                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                                            Principal: {formatCurrency(loan.total_amount)}
                                        </span>
                                        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md font-medium">
                                            {loan.interest_rate}% Interest
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex items-center">
                                <div className="mr-6 hidden sm:block">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Tenure</p>
                                    <p className="font-bold text-gray-700">{loan.tenure_months} Months</p>
                                </div>
                                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                                    <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LoansList;
