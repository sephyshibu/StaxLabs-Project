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
      {error && <p className="text-red-500 text-center text-sm">{error}</p>}
      <button className="w-full bg-blue-500 text-white py-2 rounded" onClick={handleLogin}>
        {loading ? "Logging in..." : "LOGIN"}
      </button>
      <p>Dont have account? <a href='/register'>SignUp</a></p>
    </div>
  );
}
