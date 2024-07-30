import React, { useEffect,useState } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom'


function ChatTeacherslist() {
  // const baseURL="http://127.0.0.1:8000";
  const baseURL = process.env.REACT_APP_BASE_URL;
  const token=localStorage.getItem('access')
  const [mentors,setMentors]=useState([])
  const imageURL = 'https://www.tawk.to/wp-content/uploads/2020/08/chat-pages-link.png'; 
  const fetchPurchasedCourse=async()=>{
    try{
      const response=await axios.get(baseURL+'/api/students/enrolled_courses/',{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log('purchased course by the student is given by.......',response.data)
      setMentors(response.data)
    }catch(error){
      console.log('eror in fetching course purchased courses',error)
    }
    
  }
  useEffect(()=>{
    fetchPurchasedCourse()
  },[])

  return (
    // <div>
    //   <h3>this is the chat_teachers list</h3>
    //   {mentors.map((mentor,index)=>(
    //     <div key={index}>
    //       <Link to={`/chat_with_teacher/${mentor.course.id}`}><p>{mentor.course.course_name}-mentor</p></Link>
    //     </div>
    //   ))}
    // </div>
    <div className="flex h-screen bg-gray-900 text-white">
    {/* Left sidebar for users */}
    <div className="w-1/3 bg-black flex flex-col">
      <h1 className="text-2xl font-bold p-4">Your mentors</h1>
      <ul className="overflow-y-auto flex-1">
        {mentors.map((mentor, index) => (
          <Link
            key={index}
            to={`/chat_with_teacher/${mentor.course.id}/${mentor.course.author}`}
          >
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              {mentor.course.course_name}-mentor
            </li>
          </Link>
        ))}
      </ul>
    </div>

    {/* Right section for chat */}
     {/* Right section for chat */}
     <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold p-4 bg-black text-center">
          You can ask your doubts directly to the mentors
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

export default ChatTeacherslist
