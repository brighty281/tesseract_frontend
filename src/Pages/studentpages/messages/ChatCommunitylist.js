import React, { useEffect,useState } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom'

function ChatCommunitylist() {
  // const baseURL="http://127.0.0.1:8000";
  const baseURL = process.env.REACT_APP_BASE_URL;
  const token=localStorage.getItem('access')
  const user_id=localStorage.getItem('user_id')
  const [communitylist,setCommunityList]=useState([])
  const imageURL = 'https://www.tawk.to/wp-content/uploads/2020/08/chat-pages-link.png'; 
  const fetchPurchasedCourse=async()=>{
    try{
      const response=await axios.get(baseURL+'/api/students/enrolled_courses/',{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log('purchased course by the student is given by.......',response.data)
      setCommunityList(response.data)
    }catch(error){
      console.log('eror in fetching course purchased courses',error)
    }
    
  }
  
  useEffect(()=>{
    fetchPurchasedCourse()
  },[])
  return (
    // <div>
    //   <h3>this is the chat with community list</h3>
    //   {communitylist.map((community)=>(
    //       <Link to={`/course_community/${community.course.id}/${community.course.course_name}`}><p>{community.course.course_name}-community</p></Link> 
    //   ))}
    // </div>
    <div className="flex h-screen font-montserrat font-medium bg-gray-900 text-white">
    {/* Left sidebar for users */}
    <div className="w-1/3 bg-gray-800 flex flex-col">
      <h1 className="text-2xl font-bold p-4">Your Communities</h1>
      <ul className="overflow-y-auto flex-1">
        {communitylist.map((community, index) => (
          <Link
            key={index}
            to={`/community_conversation/${community.course.id}/${community.course.course_name}`}
          >
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              {community.course.course_name}-community
            </li>
          </Link>
        ))}
      </ul>
    </div>

    {/* Right section for chat */}
     {/* Right section for chat */}
     <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold p-4 bg-gray-800 text-center">
          share your thoughts and doubts in community
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

export default ChatCommunitylist
