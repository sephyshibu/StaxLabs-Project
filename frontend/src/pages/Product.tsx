import { useEffect, useState } from 'react';
import API from '../../components/Axios/axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../../components/features/AuthSlice';
import { persistor } from '../../components/app/store';
import { useNavigate } from 'react-router-dom';

interface Vendor {
  _id: string;
  name: string;
}
interface Productid{
  _id:string,
  title:string,
  pricePerUnit:number
}

interface Product {
  _id: string;
  title: string;
  description: string;
  pricePerUnit: number;
  minOrderQty: number;
  availableQty: number;
  vendorId: Vendor;
  customPricing?: Record<string, number>;
}

interface CartItem {
  productId: Productid;
  quantity: number;
  vendorId: string;
}

interface Order {
  _id: string;
  items: CartItem[];
  vendorId: string;
  totalCost: number;
  status: string;
  createdAt: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'marketplace' | 'orders' | 'cart'>('marketplace');
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const navigate = useNavigate();




  useEffect(() => {
    if (!userId) {
    navigate('/login', { replace: true });
    
    
  }
  
    if (tab === 'marketplace') {
      fetchProducts();
      fetchCart();
    } else if (tab === 'orders') {
      fetchOrders();
    }
    // Prevent back navigation after login
  window.history.pushState(null, "", window.location.href);
  const handlePopState = () => {
    window.history.pushState(null, "", window.location.href);
  };
  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
  }, [tab]);

  const handleLogout = async () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    dispatch(clearCredentials());
    await persistor.purge();
    navigate('/login');
  };

  const fetchProducts = async () => {
    const res = await API.get('/products/userside');
    setProducts(res.data);
    const initial: Record<string, number> = {};
    res.data.forEach((p: Product) => {
      initial[p._id] = p.minOrderQty;
    });
    setQuantities(initial);
  };

  const fetchCart = async () => {
    try {
      const res = await API.get(`/orders/cart/${userId}`);
      setCart(res.data.items);
      console.log("cart",res.data.items)
    } catch (err) {
      console.error('Error fetching cart', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/user/${userId}`);
      setOrders(res.data);
      console.log("ordersd", res.data)
    } catch (err) {
      toast.error('Failed to load orders');
    }
  };

  const handleAddToCart = async (product: Product, qty: number) => {
    if (qty < product.minOrderQty) {
      toast.warning(`Minimum quantity is ${product.minOrderQty}`);
      return;
    }
   const alreadyInCart = cart.some((item) => item.productId._id === product._id);

    if (alreadyInCart) {
      toast.info('Product already in cart');
      return;
    }
    try {
      await API.patch('/orders/cart', {
        productId: product._id,
        quantity: qty,
        vendorId: product.vendorId,
      });
      toast.success('Product added to cart');
      fetchCart();
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      await API.post('/orders', { items: cart, timezone });
      toast.success('Order placed!');
      setCart([]);
      fetchCart();
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  const groupCartByVendor = () => {
    const grouped: Record<string, CartItem[]> = {};
    for (const item of cart) {
      if (!grouped[item.vendorId]) grouped[item.vendorId] = [];
      grouped[item.vendorId].push(item);
    }
    return grouped;
  };

  const groupedCart = groupCartByVendor();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white py-4 px-6 text-2xl font-bold text-center">
        Bulk Base
      </header>

      <div className="flex justify-center space-x-4 bg-white py-3 shadow-md">
        <button onClick={() => setTab('marketplace')} className={`px-6 py-2 rounded-full font-semibold ${tab === 'marketplace' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
          Products
        </button>
        <button onClick={() => setTab('orders')} className={`px-6 py-2 rounded-full font-semibold ${tab === 'orders' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
          My Orders
        </button>
        <button onClick={() => setTab('cart')} className={`px-6 py-2 rounded-full font-semibold ${tab === 'cart' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
          My Cart
        </button>
        <button onClick={handleLogout} className="ml-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>

      {tab === 'marketplace' && (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold mb-1">{p.title}</h2>
                <p className="text-sm text-gray-600 mb-1">{p.description}</p>
                <p className="text-sm">Min Qty: {p.minOrderQty}</p>
                <p className="text-sm">Available: {p.availableQty}</p>
                <p className="text-sm text-gray-600">Vendor: {typeof p.vendorId === 'object' ? p.vendorId.name : p.vendorId}</p>
                <p className="mt-1 text-green-600 font-semibold">
                  ₹{(() => {
                    const userEmail = localStorage.getItem('email');
                    const encodedEmail = userEmail?.replace(/\./g, '%2E') ?? '';
                    return p.customPricing?.[encodedEmail] ?? p.pricePerUnit;
                  })()} /unit
                </p>
              </div>
              <div className="mt-3 space-y-2">
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  min={p.minOrderQty}
                  max={p.availableQty}
                  value={quantities[p._id] ?? p.minOrderQty}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const limited = Math.min(value, p.availableQty);
                    setQuantities((prev) => ({ ...prev, [p._id]: limited }));
                  }}
                />
                <button
                  onClick={() => handleAddToCart(p, quantities[p._id] ?? p.minOrderQty)}
                   disabled={p.availableQty <= 0}
                    className={`w-full py-2 rounded 
                      ${p.availableQty <= 0 
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    {p.availableQty <= 0 ? 'Out of Stock' : 'Add to cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cart' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">🛒 Cart (Grouped by Vendor)</h2>
          {Object.entries(groupedCart).map(([vendorId, items]) => (
            <div key={vendorId} className="mb-4 p-4 border rounded bg-white shadow">
              <h3 className="font-bold mb-2">Vendor ID: {vendorId}</h3>
              <ul>
                {items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center mb-1">
                    <span>
                        {(() => {
                          const product = products.find(p => p._id === item.productId._id);
                          if (!product) return null;
                          const userEmail = localStorage.getItem('email');
                          const encoded = userEmail?.replace(/\./g, '%2E') ?? '';
                          const customPrice = product.customPricing?.[encoded];
                          const priceToShow = customPrice ?? product.pricePerUnit;

                          return (
                            <>
                              Product: {item.productId.title} | Qty: {item.quantity} | 
                              Price: ₹{priceToShow} x {item.quantity} = ₹{priceToShow * item.quantity}
                            </>
                          );
                        })()}
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          await API.delete(`/orders/cart/${item.productId._id}`);
                          toast.success('Removed from cart');
                          fetchCart();
                        } catch (err) {
                          toast.error('Failed to remove');
                        }
                      }}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-lg font-semibold mb-2">
        Total: ₹{
          cart.reduce((total, item) => {
            const product = products.find(p => p._id === item.productId._id);
            if (!product) return total;
            const userEmail = localStorage.getItem('email');
            const encoded = userEmail?.replace(/\./g, '%2E') ?? '';
            const price = product.customPricing?.[encoded] ?? product.pricePerUnit;
            return total + price * item.quantity;
          }, 0)
        }
      </p>

          {cart.length > 0 && (
            <button
              onClick={handlePlaceOrder}
              className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded"
            >
              Place Order
            </button>
          )}
        </div>
      )}


{tab === 'orders' && (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>
    {orders.length === 0 ? (
      <p className="text-center text-gray-600">No orders yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-blue-50 text-blue-900 text-sm font-semibold">
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Vendor</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Order Date & Time</th>
             
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="mb-1">
                      <p className="text-sm font-medium">
                        {item.productId.title} <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      </p>
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4">Vendor {order.vendorId}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Returned' ? 'bg-red-100 text-red-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{order.status}</span>
                </td>
                <td className="py-3 px-4">{new Date(order.createdAt).toLocaleString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
    </div>
  );
}