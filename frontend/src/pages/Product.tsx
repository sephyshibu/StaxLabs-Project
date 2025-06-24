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
  productId: string;
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
  const [tab, setTab] = useState<'marketplace' | 'orders'>('marketplace');
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === 'marketplace') {
      fetchProducts();
      fetchCart();
    } else {
      fetchOrders();
    }
  }, [tab]);

  const handleLogout = async () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    dispatch(clearCredentials());
    await persistor.purge();
    navigate('/login');
  };
  const fetchProducts = async () => {
    const res = await API.get('/products');
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
    } catch (err) {
      console.error('Error fetching cart', err);
    }
  };

  const fetchOrders = async () => {
    try {

      const res = await API.get(`/orders/user/${userId}`,);
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    }
  };

  const handleAddToCart = async (product: Product, qty: number) => {
    if (qty < product.minOrderQty) {
      toast.warning(`Minimum quantity is ${product.minOrderQty}`);
      return;
    }
    const alreadyInCart = cart.some((item) => item.productId === product._id);
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
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setTab('marketplace')}
            className={`px-4 py-2 rounded ${tab === 'marketplace' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            My Orders
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {tab === 'marketplace' && (
        <>
          <h1 className="text-2xl font-bold mb-4">Available Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="border rounded p-4 shadow">
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <span className="text-sm text-gray-500">Vendor: {typeof p.vendorId === 'object' ? p.vendorId.name : p.vendorId}</span>

                <p>{p.description}</p>
                <p className="text-sm text-gray-600">Min Qty: {p.minOrderQty}</p>
                <p className="text-sm text-gray-600">Available: {p.availableQty}</p>
                {p.availableQty === 0 ? (
                  <span className="text-red-600 font-bold">Out of Stock</span>
                ) : (
                  <p className="text-green-600 font-bold">
                    ₹
                    {(() => {
                      const userEmail = localStorage.getItem('email');
                      const encodedEmail = userEmail?.replace(/\./g, '%2E') ?? '';
                      return p.customPricing?.[encodedEmail] ?? p.pricePerUnit;
                    })()}
                    /unit
                  </p>
                )}
                <input
                  type="number"
                  className="border mt-2 p-1 w-full"
                  min={p.minOrderQty}
                  max={p.availableQty}
                  value={quantities[p._id] ?? p.minOrderQty}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const limited = Math.min(value, p.availableQty);
                    setQuantities((prev) => ({
                      ...prev,
                      [p._id]: limited,
                    }));
                  }}
                />
                <button
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded w-full"
                  onClick={() => handleAddToCart(p, quantities[p._id] ?? p.minOrderQty)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">🛒 Cart (Grouped by Vendor)</h2>
              {Object.entries(groupedCart).map(([vendorId, items]) => (
                <div key={vendorId} className="mb-4 p-4 border rounded bg-gray-50">
                  <h3 className="font-bold mb-2">Vendor ID: {vendorId}</h3>
                  <ul>
                    {items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center mb-1">
                        <span>
                          Product ID: {item.productId} | Qty: {item.quantity}
                        </span>
                        <button
                          onClick={async () => {
                            try {
                              await API.delete(`/orders/cart/${item.productId}`);
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
              <button
                onClick={handlePlaceOrder}
                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded"
              >
                Place Order
              </button>
            </div>
          )}
        </>
      )}

      {tab === 'orders' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">My Orders</h1>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="border p-4 rounded bg-white shadow">
                  <p><strong>Status:</strong> {o.status}</p>
                  <p><strong>Total:</strong> ₹{o.totalCost}</p>
                  <p><strong>Created:</strong> {new Date(o.createdAt).toLocaleString()}</p>
                  <ul className="mt-2">
                    {o.items.map((i, idx) => (
                      <li key={idx}>
                        Product ID: {i.productId} | Qty: {i.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
