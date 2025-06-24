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

  const handleOrderAction = async (orderId: string, action: 'accepted' | 'rejected' | 'shipped' | 'delivered') => {
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
    <ul className="space-y-4">
      {orders.map((o: any) => (
        <li key={o._id} className="bg-white border border-gray-300 rounded-lg shadow p-4">
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-semibold text-gray-600">Customer Name</p>
              <p>{o.customerId?.name || 'Unknown'}</p>

              <p className="mt-2 font-semibold text-gray-600">Order Status</p>
            <p>
              <span
                className={`px-2 py-1 rounded text-white text-sm font-medium ${
                  o.status === 'Accepted'
                    ? 'bg-blue-600'
                    : o.status === 'Rejected'
                    ? 'bg-red-600'
                    : o.status === 'Shipped'
                    ? 'bg-purple-600'
                    : o.status === 'Delivered'
                    ? 'bg-green-600'
                    : 'bg-gray-400'
                }`}
              >
                {o.status}
              </span>
            </p>
              <p className="mt-2 font-semibold text-gray-600">Order Date</p>
              <p>{new Date(o.createdAt).toLocaleString()}</p>

              <p className="mt-2 font-semibold text-gray-600">Total Amount</p>
              <p>₹{o.totalCost}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-600 mb-2">Ordered Items</p>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {o.items.map((item: any, i: number) => (
                  <li key={i}>
                    {item.productId?.title || item.productId} — Qty: {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2">
                {o.status === 'Pending' ? (
                  <>
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleOrderAction(o._id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleOrderAction(o._id, 'rejected')}
                    >
                      Reject
                    </button>
                  </>
                ) : o.status === 'Accepted' || o.status === 'Shipped' ? (
                  <select
                    className="border px-3 py-1 rounded"
                    value=""
                    onChange={(e) => {
                      const nextStatus = e.target.value;
                      if (nextStatus) handleOrderAction(o._id, nextStatus as 'shipped' | 'delivered');
                    }}
                  >
                    <option value="" disabled>Update Status</option>
                    {o.status === 'Accepted' && <option value="shipped">Mark as Shipped</option>}
                    {o.status === 'Shipped' && <option value="delivered">Mark as Delivered</option>}
                  </select>
                ) : (
                  <span className="px-3 py-1 rounded bg-gray-200 text-gray-700 inline-block w-fit">
                    {o.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}