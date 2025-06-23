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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">All Users</h2>
      <ul className="space-y-2">
        {users.map((u: any) => (
          <li key={u._id} className="p-3 border rounded shadow-sm">
            <div className="font-medium">{u.name}</div>
            <div className="text-sm text-gray-600">{u.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
