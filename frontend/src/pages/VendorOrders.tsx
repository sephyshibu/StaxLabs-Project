// src/components/vendor/IncomingOrders.tsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { toast } from 'react-toastify';

export default function IncomingOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders/incoming');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject') => {
    try {
      await axiosInstance.patch(`/orders/${orderId}/${action}`);
      toast.success(`Order ${action}ed`);
      fetchOrders();
    } catch (err) {
      toast.error(`Failed to ${action} order`);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return <p className="text-gray-500">No incoming orders.</p>;
  }

  return (
    <ul className="space-y-3">
      {orders.map((o: any) => (
        <li
          key={o._id}
          className="border p-4 rounded shadow-sm flex justify-between"
        >
          <div>
            <h2 className="text-md font-semibold">
              Customer: {o.customerId?.name || 'Unknown'}
            </h2>
            <p>Status: {o.status}</p>
            <p>Total: ₹{o.totalCost}</p>
            <p>Ordered: {new Date(o.createdAt).toLocaleString()}</p>

            <div className="mt-2">
              <h3 className="font-medium">Items:</h3>
              <ul className="list-disc ml-5 text-sm">
                {o.items.map((item: any, i: number) => (
                  <li key={i}>
                    Product: {item.productId?.title || item.productId} — Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-x-2 self-start">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => handleOrderAction(o._id, 'accept')}
            >
              Accept
            </button>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => handleOrderAction(o._id, 'reject')}
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
