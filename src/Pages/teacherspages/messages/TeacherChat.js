import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

function TeacherChat() {
    // const baseURL="http://127.0.0.1:8000"
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    // const author_id=localStorage.getItem('userid')
    const [users,setUsers]=useState([])
    const imageURL = 'https://www.tawk.to/wp-content/uploads/2020/08/chat-pages-link.png'; 
    const fetchUserData=async()=>{
        try{
            const response=await axios.get(baseURL+"/teacherapp/teacherorders_view/",{
                headers:{
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(response.data)
            setUsers(response.data)
        }catch(error){
            console.log('Error is......',error)
        }
    }


    useEffect(()=>{
        fetchUserData()
    },[])
  return (
    
    <div className="flex h-screen bg-gray-900 text-white">
    {/* Left sidebar for users */}
    <div className="w-1/3 bg-gray-800 flex flex-col">
      <h1 className="text-2xl font-bold p-4">Users</h1>
      <ul className="overflow-y-auto flex-1">
        {users.map((obj, index) => (
          <Link
            key={index}
            to={`/teacher/teacher_conversation/${obj.user}/${obj.course}`}
          >
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              {obj.username}-{obj.course_name}
            </li>
          </Link>
        ))}
      </ul>
    </div>

    {/* Right section for chat */}
     {/* Right section for chat */}
     <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold p-4 bg-gray-800 text-center">
          Choose a student to start a conversation
        </h1>
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={imageURL}
            alt="Choose a student"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            style={{ maxWidth: '500px', maxHeight: '400px' }}
          />
        </div>
      </div>
  </div>
  )
}

export default TeacherChat
