import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Axios/axios';
interface Signupform{
    name:string,
    email:string,
    password:string,
   role:string
    

}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const[loading,setloading]=useState(false)
  const [error, seterror] = useState<Partial<Signupform> & { backend?: string }>({});

  
  const navigate = useNavigate();

  const handleRegister = async () => {
    
    seterror({})
        setloading(true)

        let formErrors:any={}
        let isValid=true
form
        if (!form.name) {
          formErrors.name = "Username is required";
          isValid = false;
      } else if (!/^[A-Za-z ]+$/.test(form.name)) {
          formErrors.name = "Username must only contain letters and spaces.";
          isValid = false;
      }
      
        // Email validation (valid email format)
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!form.email) {
            formErrors.email = 'Email is required.';
            isValid = false;
        } else if (!emailPattern.test(form.email)) {
            formErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }


        // Password validation (at least 6 characters, one uppercase, one lowercase, one special character)
         const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
        if (!form.password) {
            formErrors.password = 'Password is required.';
            isValid = false;
        } else if (!passwordPattern.test(form.password)) {
            formErrors.password = 'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, and one special character.';
            isValid = false;
        }
      

       

        // If any validation fails, set error messages
        seterror(formErrors);

        // If any validation fails, return early
        if (!isValid) {
          setloading(false); 
           return
        }
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration failed:', err);
       seterror((prev) => ({
    ...prev,
    backend: err.response?.data?.message || 'Something went wrong',
  }));
  setloading(false);
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
       {error.name && <p className="text-red-500 text-center text-sm">{error.name}</p>}

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder='Email'
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {error.email && <p className="text-red-500 text-center text-sm">{error.email}</p>}

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder='Password'
        type='password'
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
                   {error.password && <p className="text-red-500 text-center text-sm">{error.password}</p>}
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
      {error.backend && (
  <p className="text-red-500 text-center text-sm mt-2">{error.backend}</p>
)}

    </div>
  );
}
