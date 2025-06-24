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
        <li key={o._id} className="p-4 border rounded shadow-sm">
          <div className="flex justify-between">
            <div>
              <h2 className="font-semibold">Customer: {o.customerId?.name || 'Unknown'}</h2>
              <p>Status: <span className="font-medium">{o.status}</span></p>
              <p>Total: ₹{o.totalCost}</p>
              <p>Ordered: {new Date(o.createdAt).toLocaleString()}</p>

              <div className="mt-2">
                <h4 className="font-medium">Items:</h4>
                <ul className="list-disc ml-5 text-sm">
                  {o.items.map((item: any, i: number) => (
                    <li key={i}>
                      {item.productId?.title || item.productId} — Qty: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-start gap-2">
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
              ) :o.status === 'Accepted' || o.status === 'Shipped' ?(
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
                <span className="px-3 py-1 rounded bg-gray-200 text-gray-700">{o.status}</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}