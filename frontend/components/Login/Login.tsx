import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/AuthSlice';
import API from '../Axios/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { accessToken, user } = res.data;
      localStorage.setItem("email",email)
      dispatch(setCredentials({ token: accessToken, role: res.data.user.role ,  id: res.data.user._id, }));
     
    if (user.role === 'vendor') {
      navigate('/vendor/dashboard'); // 👉 redirect vendor to their dashboard
    } else if (user.role === 'customer') {
      navigate('/'); // customer to home
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard'); // if needed
    }
  } catch (err: any) {
    console.error('Login failed:', err);
  }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-blue-500 text-white py-2 rounded" onClick={handleLogin}>
        Login
      </button>
      <p>Dont have account? <a href='/register'>SignUp</a></p>
    </div>
  );
}
