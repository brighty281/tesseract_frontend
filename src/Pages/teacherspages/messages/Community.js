import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
function Community() {
    // const baseURL="http://127.0.0.1:8000"
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const [courses,setCourse]=useState([])
    const imageURL = 'https://www.tawk.to/wp-content/uploads/2020/08/chat-pages-link.png'; 

    const fetchCourses=async()=>{
        try{
            const response = await axios.get(baseURL+"/teacherapp/my_courses/",{
                headers:{
                    'Authorization': `Bearer ${token}`,
                }
            })
            console.log(response.data)
            setCourse(response.data)
        }
        catch(error){
            console.log('the error in fetching course is....',error)
        }
    }

    useEffect(()=>{
        fetchCourses()
    },[])
  return (
    <div className="flex h-screen bg-gray-900 text-white">
    {/* Left sidebar for users */}
    <div className="w-1/3 bg-black flex flex-col">
      <h1 className="text-2xl font-bold p-4">Your Communities</h1>
      <ul className="overflow-y-auto flex-1">
        {courses.map((course, index) => (
          <Link
            key={index}
            to={`/teacher/teacher_community_chat/${course.id}/${course.course_name}`}
          >
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
                  {course.course_name}-community
            </li>
          </Link>
        ))}
      </ul>
    </div>

    {/* Right section for chat */}
     {/* Right section for chat */}
     <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold p-4 bg-black text-center">
          choose a community and Interact with students.
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

export default Community
