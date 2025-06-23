import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { toast } from 'react-toastify';
import moment from 'moment-timezone'

export default function FetchOrders() {
  const [orders, setOrders] = useState([]);
  const [userTimezone, setUserTimezone] = useState('UTC');

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

      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };
    const formatTime = (time: string, timezone: string) => {
    return moment.tz(time, timezone).format('YYYY-MM-DD hh:mm A z');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">All Orders</h2>
      <ul className="space-y-4">
        {orders.map((order: any) => (
          <li key={order._id} className="p-4 border rounded shadow-sm">
            <div className="font-medium mb-1">Order #{order._id}</div>
            <div className="text-sm text-gray-700">
              <strong>Vendor:</strong> {order.vendorId?.name || 'N/A'} <br />
              <strong>Customer:</strong> {order.customerId?.name || 'N/A'} <br />
              <strong>Status:</strong> {order.status} <br />
              <strong>Total:</strong> ₹{order.totalCost}
               <strong>Created At:</strong> {order.createdAt} <br />
              <strong>Updated At:</strong> {order.updatedAt}
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-semibold mb-1">Items:</h4>
              <ul className="ml-4 list-disc text-sm text-gray-700 space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx}>
                    {item.productId?.title || 'Product'} — ₹{item.productId?.pricePerUnit} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
