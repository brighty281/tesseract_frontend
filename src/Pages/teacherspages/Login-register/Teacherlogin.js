import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../../Redux/authentication/AuthenticationSlice';
import { toast } from 'react-toastify';

function Teacherlogin() {
  const [formError, setFormError] = useState([]);
  const [message, setMessage] = useState(null);
  // const baseURL = 'http://127.0.0.1:8000';
  const baseURL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);

  useEffect(() => {
    if (authentication_user.isAuthenticated && !authentication_user.isAdmin ) {
      console.log('User is already authenticated. Redirecting...');
      navigate('/teacher/home');
    }
  }, [authentication_user.isAuthenticated, authentication_user.isAdmin, navigate]);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    if (password.length > 0 && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);  

    try {
      const res = await axios.post(`${baseURL}/api/users/teacher/login/`, formData);
      const verified=res.data.isEmailverified
      if (res.status === 200) {
        toast.success('Logged in successfully!');
        console.log("Login successful", res.data);
        localStorage.setItem('access', res.data.access_token);
        localStorage.setItem('refresh', res.data.refresh_token);
        localStorage.setItem('userid', res.data.userid);

        dispatch(
          set_Authentication({
            
            name: jwtDecode(res.data.access_token).username,
            isAuthenticated: true,
            userid: res.data.userid,
            isAdmin: false,
            isTeacher: true,

          })
        );
        if(verified){
          navigate('/teacher/home')
        }
        else{
          navigate('/teacher/notapproved');
        }
        
      
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Invalid credentials');
        setFormError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome back, Teacher</h1>
        <h3 className="text-2xl mb-6">Enter your credentials</h3>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input type="email" name="email" placeholder="Enter your email" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" required />
            {emailError && <span className="text-sm font-bold text-red-500 mt-1">{emailError}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input type="password" name="password" placeholder="Enter the password" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" required />
            {passwordError && <span className="text-sm font-bold text-red-500 mt-1">{passwordError}</span>}
          </div>
          <div>
            <button type="submit" className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
              Login
            </button>
          </div>
        </form>
        {loginError && <span className="text-red-800 text-sm mt-2">{loginError}</span>}
        {message && <span className="text-sm text-red-500 mt-1">{message}</span>}<br/>
        <Link to="/teacher/fpassword"><span>Forgot password</span></Link><br/>
        <span>Don't have an account?</span> <Link to="/teacher/signup"><span>| Sign up</span></Link>
      </div>
    </div>
  );
}

export default Teacherlogin;

