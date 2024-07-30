import axios from 'axios'
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
function TeacherRegistration() {
  // const baseURL='http://127.0.0.1:8000';
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [usernameError, setUsernameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [cpasswordError, setCPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')

  const navigate=useNavigate()


  const handleformsubmit=async(event)=>{
    event.preventDefault();
    const username=event.target.username.value;
    const email=event.target.email.value;
    const password=event.target.password.value;
    const cpassword=event.target.cpassword.value;
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
    formData.append('username', event.target.username.value);
    formData.append('email', event.target.email.value);
    formData.append('password', event.target.password.value);

    try{
      const res=await axios.post(baseURL + '/api/users/teacher/signup/',formData)
      if (res.status === 200){
        console.log("server response :",res.data);
        const registeredEmail=res.data.email;
        localStorage.setItem('registeredEmail', registeredEmail);
        localStorage.setItem('user_id',res.data.user_id)
        toast.success('otp sent successfully')
        navigate('/teacher/teacherotp');
      }
    }
    catch (error){
      if (error.response && error.response.status=== 406){
        toast.error("registration failed")
      }else if(error.response &&error.response.status === 400){
        const errorData = error.response.data;
        if (errorData.email) {
          setEmailError(errorData.email);
          
        }
        toast.error("Registration failed");
      }
      else{
        console.log(error)
      }
    }

  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl mb-6">Please fill the fields for registration</h3>
        <form onSubmit={handleformsubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input type="text" name="username" placeholder="Enter your name" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
            {usernameError && <span className="text-sm font-bold text-red-500 mt-1">{usernameError}</span>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input type="email" name="email" placeholder="Enter email" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
            {emailError && <span className="text-sm font-bold text-red-500 mt-1">{emailError}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input type="password" name="password" placeholder="Enter the password" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
            {passwordError && <span className="text-sm font-bold text-red-500 mt-1">{passwordError}</span>}
          </div>
          <div>
            <label htmlFor="cpassword" className="block text-sm font-medium">Confirm your password</label>
            <input type="password" name="cpassword" placeholder="Re-enter the password" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
            {cpasswordError && <span className="text-sm font-bold text-red-500 mt-1">{cpasswordError}</span>}
          </div>
          <div>
            <input type="submit" value="Register Now" className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer" />
          </div>
        </form>
        {loginError && <span className="text-red-800 text-sm">{loginError}</span>}
      </div>
    </div>
  )
}

export default TeacherRegistration
