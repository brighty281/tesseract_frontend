import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
function TeacherFP() {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const navigate=useNavigate()
  const handleEmail=async(event)=>{
      event.preventDefault();
      const email=event.target.email.value;
      try{
        const res=await axios.post(
            baseURL+"/api/users/fpassword/",{
            email : email,
          }
        )

        if(res.status === 200){
          console.log("response is ",res.data);
          const registerdEmail=res.data.email
          console.log(registerdEmail)
          localStorage.setItem('registeredEmail',registerdEmail);
          localStorage.setItem('user_id',res.data.user_id);
          toast.success('email id available#####')
          navigate("/teacher/fpotp")
        }else{

          console.log("email not exist")

        }
      }catch(error){
        console.log("error is while checking the user existance ",error)
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Hello,</h1>
        <h3 className="text-2xl mb-6">Enter your Registered Email</h3>
          <form onSubmit={handleEmail}  className="space-y-4">
            <div>
              <input type="email" name="email" placeholder="Enter your email" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" required />
            </div>
            
            <div>
              <button type="submit" className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
                Verify
              </button>
            </div>
          </form>
        
      </div>
    </div>
  )
}

export default TeacherFP
