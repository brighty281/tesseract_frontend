import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function TeacherPersonal() {
    const [loginError,setLoginError]=useState('')
    // const baseURL='http://127.0.0.1:8000'
    const baseURL = process.env.REACT_APP_BASE_URL;
    const navigate=useNavigate()

    const handleSubmit=async(event)=>{
        event.preventDefault()
        console.log("hello")
        const formData=new FormData();
        formData.append('number',event.target.phone.value)
        formData.append('experience',event.target.experience.value)
        formData.append('age',event.target.age.value)
        formData.append('address',event.target.address.value)
        formData.append('user',localStorage.getItem('user_id'))
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }

        try{
          const res= await axios.post(baseURL+'/api/users/teacher/teacher_details/',formData)
          if(res.status===200){
            console.log("request to backend is succesfull")
      
            navigate('/teacher/teacher_documents')
            console.log('after navigate')
            
          }
          else{
            console.log(res.error)
          }
          }catch(error){
            console.log(error);
              if (error.response && error.response.status===401)
              {  
                console.log('Error:', error.response.data);
              }
              else
              {
                console.log(error);
              }
          }
      
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl mb-6">Personal Details</h3>
        <form onSubmit={handleSubmit}  className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Phone Number</label>
            <input type="number" name="phone" placeholder="Enter Phone Number" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium">Experience (in Years) </label>
            <input type="number" name="experience" placeholder="Enter the password" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium">Age</label>
            <input type="number" name="age" placeholder="Enter the age" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium">Address </label>
            <input type="text" name="address" placeholder="Enter the address" className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white" />
          </div>
          <div>
            <input type="submit" value="Continue" className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer" />
          </div>
        </form>
        {loginError && <span className="text-red-800 text-sm">{loginError}</span>}
      </div>
    </div>
  )
}

export default TeacherPersonal
