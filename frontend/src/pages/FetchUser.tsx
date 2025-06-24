import { useEffect, useState } from 'react';
import axiosInstance from '../../components/Axios/axios';
import { toast } from 'react-toastify';

export default function FetchUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await axiosInstance.patch(`/users/${userId}/unblock`);
        
        toast.success('User unblocked');
      } else {
        await axiosInstance.patch(`/users/${userId}/block`);
        toast.success('User blocked');
      }
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">All Users</h2>
      <ul className="space-y-2">
        {users.map((u: any) => (
          <li key={u._id} className="p-3 border rounded shadow-sm">
          <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
            <div>
              {u.isBlocked ? (
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleToggleBlock(u._id, true)}
                >
                  Unblock
                </button>
              ) : (
                <button
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
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
