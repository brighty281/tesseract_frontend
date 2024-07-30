import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
function Registrationpage() {
    // const baseURL='http://127.0.0.1:8000';
    const baseURL = process.env.REACT_APP_BASE_URL;
    const navigate=useNavigate();

    const [usernameError, setUsernameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [cpasswordError, setCPasswordError] = useState('')
    const [loginError, setLoginError] = useState('')

    const authentication_user=useSelector(state=>(state.authentication_user))

    useEffect(()=>{
        if((authentication_user.isAuthenticated && !authentication_user.isAdmin && !authentication_user.isTeacher)){
            console.log('user is authenticated...')
            navigate('/home');
        }
    })
    
    const handleRegistration=async(event)=>{
        event.preventDefault();
        const username=event.target.username.value;
        const email=event.target.email.value;
        const password=event.target.password.value;
        const cpassword=event.target.password_confirm.value;
        const alphabeticRegex = /^[A-Za-z]+$/;

        if (!username.trim()) {
            setUsernameError('Username is required *')
         
          }
    
          if (!alphabeticRegex.test(username)) {
            setUsernameError('Username must contain only alphabetic characters');
            return;
          }
    
          if (username.length > 0 && username.length < 4) {
            setUsernameError('length must be atleast 4 characters *')
          }
    
          if (!email.trim()) {
            setEmailError('Email is required *')
          }
      
          if (!password.trim()) {
            setPasswordError('Password is required *');
          }
    
          if (password.length > 0 && password.length < 8) {
            setPasswordError('Password must be at least 8 characters *');
          }
    
    
          if (!cpassword.trim()) {
            setCPasswordError('Confirm Password is required *');
            return
          }
    
          if (cpassword.length > 0 && cpassword.length < 8) {
            setCPasswordError('Confirm Password must be at least 8 characters *');
            return
          }
    
          if  (String(cpassword) !== String(password)){
            setCPasswordError('Passwords are not matching!!');
            setPasswordError('Passwords are not matching!!');
            return
          }


        const formData=new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        try {
            const res=await axios.post(baseURL+'/api/users/signup/', formData);

            if (res.status===200){
                console.log('Server Response:', res.data);
                const registeredEmail=res.data.email;
                localStorage.setItem('registeredEmail', registeredEmail);
                toast.success('otp sent successfully')
                navigate('/otp');
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 406) {
                alert('Registration failed');
            } else {
                console.log(error);
                setLoginError('An error occured while login')
            }
        }
    }

    return (
    
        <div className="bg-black px-20  " >
        <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-0 mr-auto mb-0 ml-auto max-w-7xl xl:px-5 lg:flex-row">
          <div className="flex flex-col items-center w-full pt-5 pr-10 pb-20 pl-10  lg:flex-row">
            {/* Left Section (Image) */}
            <div className="w-full bg-cover relative max-w-md lg:max-w-2xl lg:w-7/12">
              <div className="flex flex-col items-center justify-center w-full h-full relative lg:pr-10 mr-10" >
                <img src="https://www.freepikcompany.com/img/designers.svg" alt="Health Run" className="btn-"  style={{marginRight:100}}/>
              </div>
            </div>
  
            {/* Right Section (Sign-up Form) */}
            <div className="w-full mt-10 mr-0 mb-0 ml-0 relative z-10 max-w-2xl lg:mt-0 lg:w-5/12">
              <div className="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-yellow-400 shadow-2xl rounded-xl relative z-10">
                <p className="w-full text-4xl font-medium text-center text-black leading-snug font-serif">Sign up for an account</p>
  
                {/* Form Inputs */}
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                <div className="bg-yellow-400 p-6 rounded-lg">
                    <form onSubmit={handleRegistration} className="space-y-4">
                        <div className="relative">
                        <label htmlFor="username" className="block font-medium text-black">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your name"
                            className="w-full mt-1 p-2 bg-black text-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                         {usernameError && <span className="text-sm font-bold text-red-500 mt-1 mb-5">{usernameError}</span>}
                        </div>
                        
                        <div className="relative">
                        <label htmlFor="email" className="block font-medium text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter the email"
                            className="w-full mt-1 p-2 bg-black text-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {emailError && <span className="text-sm font-bold text-red-500 mt-1 mb-5">{emailError}</span>}
                        </div>
                        
                        <div className="relative">
                        <label htmlFor="password" className="block font-medium text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter the password"
                            className="w-full mt-1 p-2 bg-black text-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {passwordError && <span className="text-sm font-bold text-red-500 mt-1 mb-5">{passwordError}</span>}
                        </div>
                        
                        <div className="relative">
                        <label htmlFor="password_confirm" className="block font-medium text-black">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="password_confirm"
                            name="password_confirm"
                            placeholder="Re-enter the password"
                            className="w-full mt-1 p-2 bg-black text-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        {cpasswordError && <span className="text-sm font-bold text-red-500 mt-1 mb-5">{cpasswordError}</span>}

                        </div>
                        
                        <div className="relative">
                        <input
                            type="submit"
                            value="Submit"
                            className="w-full mt-1 p-2 bg-blue-500 text-white font-medium rounded-md cursor-pointer hover:bg-blue-600"
                        />
                        </div>
                    </form>
                    </div>


                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

    
    )
}

export default Registrationpage;

