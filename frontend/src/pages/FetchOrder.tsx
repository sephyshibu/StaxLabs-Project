import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { toast } from 'react-toastify';

export default function FetchOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders');
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">All Orders</h2>
      <ul className="space-y-2">
        {orders.map((o: any) => (
          <li key={o._id} className="p-3 border rounded shadow-sm">
            <div className="font-medium">Order #{o._id}</div>
            <div className="text-sm text-gray-600">Status: {o.status} | Total: ₹{o.totalAmount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
