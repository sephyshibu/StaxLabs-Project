import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { toast } from 'react-toastify';

export default function FetchProducts() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleBlock = async (productId: string, block: boolean) => {
    try {
      if (block) {
        await axiosInstance.patch(`/products/${productId}/block`);
        toast.success('Product blocked');
      } else {
        await axiosInstance.patch(`/products/${productId}/unblock`);
        toast.success('Product unblocked');
      }
      fetchProducts();
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Products</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: any) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
              {p.isBlocked && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  Blocked
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-1">
              ₹{p.pricePerUnit} per unit
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Available Qty: {p.availableQty}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Vendor: <span className="font-medium">{p.vendorId?.name || 'N/A'}</span>
            </p>

            <div className="flex">
              {p.isBlocked ? (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm rounded transition"
                  onClick={() => handleToggleBlock(p._id, false)}
                >
                  Unblock
                </button>
              ) : (
                <button
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 text-sm rounded transition"
                  onClick={() => handleToggleBlock(p._id, true)}
                >
                  Block
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
