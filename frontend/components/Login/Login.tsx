import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/AuthSlice';
import API from '../Axios/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[error,seterror]=useState<string |null>(null)
 const [loading, setloading]=useState(false);
  


  const navigate = useNavigate();
  const dispatch = useDispatch();

  

  const handleLogin = async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
     seterror(null)
    setloading(true)

     if(!email && !password){
            seterror("email and password is required")
            setloading(false)
            return
        }

        if(!email){
            seterror("Email is required")
            setloading(false)
            return
        }
        if(!password){
            seterror("password is required")
            setloading(false)
            return
        }
        

    try {
      const res = await API.post('/auth/login', { email, password ,timezone});
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
     seterror(err.response?.data?.message ||"Something went wrong")   
  }
  finally {
            setloading(false);
          }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-r from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Login to your account</h2>

        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90"
          onClick={handleLogin}
        >
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );

}
