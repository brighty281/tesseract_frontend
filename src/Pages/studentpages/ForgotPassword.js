import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function ForgotPassword() {
  const navigate=useNavigate()
  const baseURL = process.env.REACT_APP_BASE_URL;
    const handleEmail=async(event)=>{
        event.preventDefault();
        const email=event.target.email.value;
        try{
          const res=await axios.post(
            baseURL + '/api/users/fpassword/',{
              email : email,
            }
          )

          if(res.status === 200){
            console.log("response is ",res.data);
            const registerdEmail=res.data.email
            console.log(registerdEmail)
            localStorage.setItem('registeredEmail',registerdEmail);
            localStorage.setItem('user_id',res.data.user_id);
            toast.success('email id available')
            navigate("/FPotp")
          }else{

            console.log("email not exist")

          }
        }catch(error){
          console.log("error is while checking the user existance ",error)
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
  <div className="bg-gray-800 rounded-lg p-8">
    <div className="text-center mb-6">
      <h3 className="font-semibold text-3xl text-yellow-500">Forgot Password</h3>
    </div>
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <h2 className="text-lg font-medium text-gray-400">Enter your registered email</h2>
      <form onSubmit={handleEmail} className="w-full max-w-md space-y-4">
        <input
          type="email"
          name="email"
          required
          className="w-full p-4 text-black rounded-xl border border-yellow-500 bg-yellow-500 focus:bg-yellow-400 focus:outline-none"
          style={{ maxWidth: '100%' }} // Increased length for the email input field
        /><br/>
        <input
          type="submit"
          value="Submit"
          className="py-4 px-8 bg-yellow-500 text-black font-semibold rounded-xl shadow-sm cursor-pointer hover:bg-yellow-400 focus:bg-yellow-400 focus:outline-none"
          style={{ width: 'auto' }} // Normal-length submit button
        />
      </form>
    </div>
  </div>
</div>


  )
}

export default ForgotPassword
