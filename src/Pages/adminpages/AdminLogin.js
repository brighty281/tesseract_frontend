import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set_Authentication } from '../../Redux/authentication/AuthenticationSlice';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  // const baseURL = 'http://127.0.0.1:8000';
  const baseURL = process.env.REACT_APP_BASE_URL;
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');

    if (!email.trim()) {
      setEmailError('Email is required');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
    }

    try {
      const res = await axios.post(baseURL + '/api/users/admin/admin_login/', formData);
      if (res.status === 200) {
        localStorage.setItem('access', res.data.access_token);
        localStorage.setItem('refresh', res.data.refresh_token);
        console.log("response is given by ",res.status)

        dispatch(
          set_Authentication({
            name: jwtDecode(res.data.access_token).username,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
            isTeacher: res.data.isTeacher,
          })
        );
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Invalid Credentials');
      if (error.response) {
        setLoginError('Invalid Credentials');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="bg-black text-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center font-bold">Admin Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full rounded border border-gray-600 focus:border-green-400 focus:ring focus:ring-green-400 focus:ring-opacity-50 px-3 py-2 bg-black text-white"
            />
            {emailError && <span className="text-green-400 text-sm mt-1">{emailError}</span>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="mt-1 block w-full rounded border border-gray-600 focus:border-green-400 focus:ring focus:ring-green-400 focus:ring-opacity-50 px-3 py-2 bg-black text-white"
            />
            {passwordError && <span className="text-green-400 text-sm mt-1">{passwordError}</span>}
            {loginError && <span className="text-green-400 text-sm mt-1">{loginError}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;



