import { Tab } from '@headlessui/react';
import FetchUsers from './FetchUser';
import FetchOrders from './FetchOrder';
import FetchProducts from './FetchProducts';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-2 bg-blue-100 p-2 rounded-lg">
          {['Manage Products', 'Orders', 'Users'].map((tab) => (
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
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
