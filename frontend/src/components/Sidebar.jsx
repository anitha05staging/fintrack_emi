import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, CreditCard, Bell, AlertTriangle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: "/", label: "Dashboard", icon: LayoutDashboard },
        { path: "/loans", label: "My Loans", icon: Wallet },
        { path: "/payments", label: "Payments", icon: CreditCard },
        { path: "/reminders", label: "Reminders", icon: Bell },
        { path: "/overdue", label: "Overdue", icon: AlertTriangle },
    ];

    return (
        <div className="flex flex-col h-screen w-64 bg-slate-900 text-white shadow-lg fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary tracking-wide">FinTrack</h1>
            </div>

            <nav className="flex-1 mt-4 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center px-4 py-3 rounded-lg transition-colors group",
                                isActive ? "bg-primary text-white" : "text-gray-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon size={20} className={clsx("mr-3", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} className="mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
