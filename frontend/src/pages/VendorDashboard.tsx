import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { Tab } from '@headlessui/react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../../components/features/AuthSlice';
import { persistor } from '../../components/app/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import IncomingOrders from './VendorOrders';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function VendorDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendorId = localStorage.getItem('userId');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});

 const [loading, setloading]=useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    pricePerUnit: '',
    minOrderQty: '',
    availableQty: '',
  });

  const fetchProducts = async () => {
    const res = await axiosInstance.get(`/products/${vendorId}`);
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axiosInstance.get('/orders/incoming');
    setOrders(res.data);
  };

 useEffect(() => {
   if (!vendorId) {
    navigate('/login', { replace: true });
  }
  fetchProducts();
  fetchOrders();

  // Prevent back navigation after login
  window.history.pushState(null, "", window.location.href);
  const handlePopState = () => {
    window.history.pushState(null, "", window.location.href);
  };
  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, [vendorId]);


  const handleLogout = async () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('email')
    dispatch(clearCredentials());
    await persistor.purge();
    navigate('/login');
  };

  const openAddModal = () => {
    setForm({ title: '', description: '', pricePerUnit: '', minOrderQty: '', availableQty: '' });
    setIsEditMode(false);
    setEditingProductId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setForm({
      title: product.title,
      description: product.description,
      pricePerUnit: product.pricePerUnit,
      minOrderQty: product.minOrderQty,
      availableQty: product.availableQty,
    });
    setIsEditMode(true);
    setEditingProductId(product._id);
    setIsModalOpen(true);
  };

  const handleSubmitProduct = async () => {
   
   setError({});
  setloading(true);

  let formErrors: Record<string, string> = {};
  let isValid = true;

  if (!form.title.trim()) {
    formErrors.title = "Title is required";
    isValid = false;
  } else if (!/^[A-Za-z ]+$/.test(form.title)) {
    formErrors.title = "Title must only contain letters and spaces.";
    isValid = false;
  }

  if (!form.description.trim()) {
    formErrors.description = "Description is required";
    isValid = false;
  }

  if (!form.pricePerUnit) {
    formErrors.pricePerUnit = "Price is required";
    isValid = false;
  } else if (isNaN(Number(form.pricePerUnit))) {
    formErrors.pricePerUnit = "Price must be a number";
    isValid = false;
  }

  if (!form.minOrderQty) {
    formErrors.minOrderQty = "Minimum quantity is required";
    isValid = false;
  } else if (isNaN(Number(form.minOrderQty))) {
    formErrors.minOrderQty = "Minimum quantity must be a number";
    isValid = false;
  }

  if (!form.availableQty) {
    formErrors.availableQty = "Available quantity is required";
    isValid = false;
  } else if (isNaN(Number(form.availableQty))) {
    formErrors.availableQty = "Available quantity must be a number";
    isValid = false;
  }

  setError(formErrors);

  if (!isValid) {
    setloading(false);
    return;
  }


    try {
      if (isEditMode && editingProductId) {
        await axiosInstance.patch(`/products/${editingProductId}`, form);
        toast.success("Product updated");
      } else {
        await axiosInstance.post('/products', form);
        toast.success("Product added");
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingProductId(null);
      setForm({ title: '', description: '', pricePerUnit: '', minOrderQty: '', availableQty: '' });
      fetchProducts();
    } catch(err:any) {
      toast.error(isEditMode ? "Update failed" : "Add failed");
       setError(err.response?.data?.message ||"Something went wrong")   
    }
  };
  const confirmDeleteProduct = (productId: string) => {
  setProductToDelete(productId);
  setShowDeleteModal(true);
};

const handleDeleteConfirmed = async () => {
  if (!productToDelete) return;

  try {
    await axiosInstance.delete(`/products/${productToDelete}`);
    toast.success("Product deleted");
  } catch {
    toast.error("Delete failed");
  } finally {
    setShowDeleteModal(false);
    setProductToDelete(null);
    await fetchProducts();
  }
};


  return (
<div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white py-4 px-6 text-2xl font-bold text-center">
        Bulk Base
      </header>
    <div className="max-w-5xl mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <div className="flex gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
            onClick={openAddModal}
          >
            <PlusIcon className="w-4 h-4" /> Add Product
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 bg-blue-100 p-1 rounded">
          {['My Products', 'Incoming Orders'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded',
                  selected ? 'bg-white shadow' : 'text-blue-500 hover:bg-white/[0.12]'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
<Tab.Panel>
  <ul className="space-y-4">
    {products.map((p: any) => (
      <li key={p._id} className="bg-white border border-gray-300 rounded-lg shadow p-4">
        <div className="flex items-start space-x-4">
         
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">Product Name</p>
                <p>{p.title}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Item Price</p>
                <p>₹{p.pricePerUnit}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Stock Quantity</p>
                <p>
                  {p.availableQty === 0 ? (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  ) : (
                    p.availableQty
                  )}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Min. Order Qty</p>
                <p>{p.minOrderQty}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-gray-600">Product Description</p>
              <p className="text-gray-700 text-sm">{p.description}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => openEditModal(p)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => confirmDeleteProduct(p._id)}
              >
                Delete
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = e.currentTarget.email.value;
                const price = e.currentTarget.price.value;
                try {
                  await axiosInstance.patch(`/products/${p._id}/custom-pricing`, {
                    email,
                    price,
                  });
                  toast.success('Custom pricing updated');
                  fetchProducts();
                } catch {
                  toast.error('Failed to update');
                }
              }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <input
                name="email"
                required
                className="border p-2 rounded text-sm"
                placeholder="Customer Email"
              />
              <input
                name="price"
                type="number"
                required
                className="border p-2 rounded text-sm"
                placeholder="Custom Price"
              />
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full"
                >
                  Set Custom Price
                </button>
              </div>
            </form>

            {Object.entries(p.customPricing || {}).length > 0 && (
              <div className="mt-3 text-sm">
                <p className="font-semibold">Custom Prices:</p>
                <ul className="list-disc ml-5">
                  {Object.entries(p.customPricing).map(([email, price]) => (
                    <li key={email}>
                      <span className="text-gray-700">Email ID: {email}</span>
                      <br />
                      <span className="text-gray-600">Price: ₹{price as any}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </li>
    ))}
  </ul>
</Tab.Panel>

          <Tab.Panel>
            <IncomingOrders />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {isModalOpen && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white border shadow-lg rounded p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{isEditMode ? 'Edit Product' : 'Add Product'}</h3>
            <button onClick={() => setIsModalOpen(false)}>
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-3">
            <input className="w-full border p-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            {error.title && <p className="text-red-500 text-sm">{error.title}</p>}

            <textarea className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {error.description && <p className="text-red-500 text-sm">{error.description}</p>}

            <input className="w-full border p-2 rounded" placeholder="Price" value={form.pricePerUnit} onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })} />
            {error.pricePerUnit && <p className="text-red-500 text-sm">{error.pricePerUnit}</p>}

            <input className="w-full border p-2 rounded" placeholder="Minimum Order Qty" value={form.minOrderQty} onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })} />
            {error.minOrderQty && <p className="text-red-500 text-sm">{error.minOrderQty}</p>}

            <input className="w-full border p-2 rounded" placeholder="Available Qty" value={form.availableQty} onChange={(e) => setForm({ ...form, availableQty: e.target.value })} />
           {error.availableQty && <p className="text-red-500 text-sm">{error.availableQty}</p>}

          </div>
          <div className="mt-4 text-right">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmitProduct}>
              {isEditMode ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}
     {showDeleteModal && (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-xl border p-6 w-full max-w-sm z-50">
      <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p className="mb-4">Are you sure you want to delete this product?</p>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleDeleteConfirmed}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


    </div>
    </div>
    
  );
}
