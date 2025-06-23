import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Axios/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder='Name'
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder='Email'
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder='Password'
        type='password'
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <select
        className="w-full border p-2 mb-4 rounded"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value='customer'>Customer</option>
        <option value='vendor'>Vendor</option>
        <option value='admin'>Admin</option>
      </select>
      <button className="w-full bg-green-500 text-white py-2 rounded" onClick={handleRegister}>
        Signup
      </button>
    </div>
  );
}
