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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">All Products</h2>
      <ul className="space-y-2">
        {products.map((p: any) => (
          <li key={p._id} className="p-3 border rounded shadow-sm">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">₹{p.pricePerUnit} | Qty: {p.availableQty}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
