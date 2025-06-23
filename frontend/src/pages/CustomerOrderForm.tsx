import { useEffect, useState } from 'react';
import API from '../../components/Axios/axios';

interface Product {
  _id: string;
  title: string;
  minOrderQty: number;
  availableQty: number;
  pricePerUnit: number;
}

export default function CustomerOrderForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    API.get('/products').then((res:any) => setProducts(res.data));
  }, []);

  const handleOrder = async () => {
    const items = Object.entries(quantities).map(([productId, quantity]) => ({ productId, quantity }));
    await API.post('/orders', { items });
    alert('Order placed successfully');
    setQuantities({});
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Place a Bulk Order</h1>
      {products.map((p) => (
        <div key={p._id} className="border-b py-4">
          <p className="font-semibold">{p.title}</p>
          <p className="text-sm">Min: {p.minOrderQty} | Avail: {p.availableQty}</p>
          <input
            type='number'
            placeholder='Quantity'
            className='border p-2 rounded mt-2 w-1/2'
            value={quantities[p._id] || ''}
            onChange={(e) => setQuantities({ ...quantities, [p._id]: parseInt(e.target.value) })}
          />
        </div>
      ))}
      <button onClick={handleOrder} className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'>Submit Order</button>
    </div>
  );
}
