import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';

export default function FetchOrders() {
  const [orders, setOrders] = useState([]);
  const [userTimezone, setUserTimezone] = useState('UTC');

  const formatTime = (time: string, timezone: string) => {
    return moment.tz(time, timezone).format('YYYY-MM-DD hh:mm A z');
  };

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      setUserTimezone(timezone);

      const formattedOrders = res.data.map((order: any) => ({
        ...order,
        createdAt: formatTime(order.createdAt, order.timezone || timezone),
        updatedAt: formatTime(order.updatedAt, order.timezone || timezone),
      }));

      setOrders(formattedOrders);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Orders</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order: any) => (
          <div key={order._id} className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1 mb-3">
              <p><strong>Vendor:</strong> {order.vendorId?.name || 'N/A'}</p>
              <p><strong>Customer:</strong> {order.customerId?.name || 'N/A'}</p>
              <p><strong>Total:</strong> ₹{order.totalCost}</p>
              {/* <p><strong>Created:</strong> {order.createdAt}</p>
              <p><strong>Updated:</strong> {order.updatedAt}</p> */}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Items:</h4>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx}>
                    {item.productId?.title || 'Product'} — {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
