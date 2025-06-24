import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { toast } from 'react-toastify';

export default function FetchVendors() {
  const [vendor, setVendors] = useState([]);

  const fetchVendor = async () => {
    try {
      const res = await axiosInstance.get('/users/getallvendors');
      setVendors(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  

  useEffect(() => {
    fetchVendor();
  }, []);

  
  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await axiosInstance.patch(`/users/${userId}/unblock`);
        
        toast.success('Vendor unblocked');
      } else {
        await axiosInstance.patch(`/users/${userId}/block`);
        toast.success('Vendor blocked');
      }
      fetchVendor();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center">All Vendors</h2>
      <ul className="space-y-4">
        {vendor.map((u: any) => (
          <li
            key={u._id}
            className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-all"
          >
            <div>
              <p className="text-lg font-medium text-gray-800">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <div>
              {u.isBlocked ? (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  onClick={() => handleToggleBlock(u._id, true)}
                >
                  Unblock
                </button>
              ) : (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                  onClick={() => handleToggleBlock(u._id, false)}
                >
                  Block
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}