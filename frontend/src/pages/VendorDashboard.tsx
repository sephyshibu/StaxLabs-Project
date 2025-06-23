import { useEffect, useState, Fragment } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../../components/features/AuthSlice'; // update path if needed
import { persistor } from '../../components/app/store'; // adjust path if needed
import { useNavigate } from 'react-router-dom';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    pricePerUnit: '',
    minOrderQty: '',
    availableQty: '',
  });
  const handleLogout = async () => {
    localStorage.removeItem('userId');
    dispatch(clearCredentials());
    await persistor.purge(); // clear redux-persist data
    navigate('/login');
  };

  const fetchProducts = async () => {
    const res = await axiosInstance.get(`/products/${vendorId}`);
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axiosInstance.get('/orders/incoming');
    setOrders(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject') => {
    await axiosInstance.patch(`/orders/${orderId}/${action}`);
    fetchOrders();
  };

  const handleAddProduct = async () => {
    await axiosInstance.post('/products', form);
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="w-4 h-4" /> Add Product
        </button>
        <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
            >
            Logout
            </button>

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
            <ul className="space-y-3">
              {products.map((p: any) => (
                <li
                  key={p._id}
                  className="border p-4 rounded shadow-sm flex justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <p>{p.description}</p>
                    <p>Price: ${p.pricePerUnit}</p>
                    <p>Available: {p.availableQty}</p>
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add Product
                  </Dialog.Title>
                  <div className="mt-2 space-y-3">
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="Title"
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <textarea
                      className="w-full border p-2 rounded"
                      placeholder="Description"
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="Price"
                      onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })}
                    />
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="Minimum Order Qty"
                      onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })}
                    />
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="Available Qty"
                      onChange={(e) => setForm({ ...form, availableQty: e.target.value })}
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      onClick={handleAddProduct}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
