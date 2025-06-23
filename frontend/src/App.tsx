import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../components/app/store';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Products from './pages/Product';
import VendorOrders from './pages/VendorOrders';
import CustomerOrderForm from './pages/CustomerOrderForm';
import VendorDashboard from './pages/VendorDashboard';
import { ToastContainer } from 'react-toastify';
function App() {
  const { token, role } = useSelector((state: RootState) => state.auth);

  return (
    <>
          <ToastContainer position="top-right" />
          <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Common route (accessible to all roles) */}
        <Route path="/" element={<Products />} />

        {/* Customer-only route */}
        <Route
          path="/order"
          element={
            !token ? (
              <Navigate to="/login" />
            ) : role !== 'customer' ? (
              <Navigate to="/" />
            ) : (
              <CustomerOrderForm />
            )
          }
        />

        {/* Vendor-only route */}
        <Route
          path="/vendor/orders"
          element={
            !token ? (
              <Navigate to="/login" />
            ) : role !== 'vendor' ? (
              <Navigate to="/" />
            ) : (
              <VendorOrders />
            )
          }
        />

        <Route
          path="/vendor/dashboard"
          element={
            !token ? (
              <Navigate to="/login" />
            ) : role !== 'vendor' ? (
              <Navigate to="/" />
            ) : (
              <VendorDashboard />
            )
          }
        />
      </Routes>
    </Router>

    </>
    
  );
}

export default App;
