import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LoansList from "./pages/LoansList";
import ApplyLoan from "./pages/ApplyLoan";
import LoanDetails from "./pages/LoanDetails";
import Payments from "./pages/Payments";
import Reminders from "./pages/Reminders";
import Overdue from "./pages/Overdue";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/loans" element={<LoansList />} />
              <Route path="/loans/apply" element={<ApplyLoan />} />
              <Route path="/loans/:id" element={<LoanDetails />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reminders" element={<Reminders />} />
              {/* Overdue Page can reuse LoanDetails/List logic or added later */}
              <Route path="/overdue" element={<Overdue />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
