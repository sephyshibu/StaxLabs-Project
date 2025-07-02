import { Tab } from '@headlessui/react';
import FetchUsers from './FetchUser';
import FetchOrders from './FetchOrder';
import FetchProducts from './FetchProducts';
import FetchVendors from './FetchVendors';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {persistor}from '../../components/app/store'
import { clearCredentials } from '../../components/features/AuthSlice';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminDashboard() {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const adminId=localStorage.getItem('userId')

      useEffect(() => {
         if (!adminId) {
          navigate('/login', { replace: true });
        }
        window.history.pushState(null, "", window.location.href);
        
        const handlePopState = () => {
          window.history.pushState(null, "", window.location.href);
        };
        window.addEventListener("popstate", handlePopState);

        return () => {
          window.removeEventListener("popstate", handlePopState);
        };
      }, [adminId]);

    const handleLogout =async () => {
        localStorage.clear(); // or remove only specific keys like localStorage.removeItem('token');
         dispatch(clearCredentials());
            await persistor.purge();
            navigate('/login');
    };
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white py-4 px-6 text-2xl font-bold text-center">
        Bulk Base
      </header>
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>

      <Tab.Group>
        <Tab.List className="flex space-x-2 bg-blue-100 p-2 rounded-lg">
          {['Manage Products', 'Orders', 'Users', 'Vendor'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'w-full py-2 text-sm font-medium rounded-lg',
                  selected ? 'bg-white shadow text-blue-700' : 'text-blue-500 hover:bg-white/50'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-4">
          <Tab.Panel><FetchProducts /></Tab.Panel>
          <Tab.Panel><FetchOrders /></Tab.Panel>
          <Tab.Panel><FetchUsers /></Tab.Panel>
          <Tab.Panel><FetchVendors /></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
    </div>
  );
}
