import React, { useEffect,useState,useRef } from 'react'
import {Link, useParams } from 'react-router-dom'
import axios from 'axios'
import '../../style.css'
function CommunityChat() {
    const {id,code}=useParams()
    const idVal=id.toString()
    const codeVal=code.replace(/\s+/g, '');
    const user_id=localStorage.getItem('userid')
    const communityroom=idVal+codeVal

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [courses,setCourse]=useState([])

    const [oldchats,setOldchats]=useState([]);
    // const baseURL = "http://127.0.0.1:8000";
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')

    const websocket=useRef(null)

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

    useEffect(()=>{
        console.log(id)
        console.log("code is...",code)
        console.log("community code....",communityroom)
        fetchPreviousChats()

        
        setMessages([])

       // Open WebSocket connection
   websocket.current=new WebSocket(`${baseURL}/ws/chat/${communityroom}/${user_id}/`);

   // Handle incoming messages
   websocket.current.onmessage=function(event){
    const data=JSON.parse(event.data);
    setMessages((prevMessages)=>[...prevMessages,{ message:data.message, owner_id : data.sender,username:data.sender_name, timestamp:data.timestamp }]);
    console.log('helloo........')
    console.log('the data is........',data)

    // Cleanup on unmount
  }
  
  return () => {
    websocket.current.close();
  };


    },[id,code])

    const sendMessage = () => {
      const messageData = {
        message: message
      };
  
      // Send message to WebSocket
      websocket.current.send(JSON.stringify(messageData));
      setMessage('');
    };



    const fetchPreviousChats=async()=>{
      try{
        const response=await axios.get(baseURL+`/api/students/previous_community_chats/${communityroom}`,{
          headers: {
            'authorization': `Bearer ${token}`,  
          }
        })
        console.log('response is....', response.data)
        setOldchats(response.data)
        
  
      }catch(error){
        console.log('error in fetching previous chats',error)
      }
      
      
    }

    function formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    const chatRef=useRef(null)
    useEffect(()=>{
      if(chatRef.current){
        chatRef.current.scrollTop=chatRef.current.scrollHeight;
      }
    })

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
        <header className="text-2xl font-bold p-4 bg-gray-800 text-white">
        {code} Community Chat
      </header>
      <main ref={chatRef} className="flex-1 p-4 overflow-y-auto bg-gray-900 hide-scrollbar">
      {oldchats.map((msg, index) => (
          <div key={index} className="my-2">
            {msg.sender == user_id ? (
              <div className="flex justify-end">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-300">You</span> 
                    <div className="p-3 pb-6  rounded-lg bg-blue-500 text-white max-w-xs shadow-md w-auto max-w-full shadow-md break-words relative">
                      {msg.message}
                      <div className="text-white text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div>
                    </div>
                 </div> 
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-300">{msg.username}</span> 
                    <div className="p-3 pb-6  rounded-lg bg-gray-700 text-white max-w-xs shadow-md w-auto max-w-full shadow-md break-words relative">
                      {msg.message}
                      <div className="text-white text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div>
                    </div>
                </div>
              </div>

            )}
          </div>
        ))}
        {messages.map((msg, index) => (
          <div key={index} className="my-2">
            {msg.owner_id == user_id ? (
              <div className="flex justify-end">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-300">You</span> 
                  <div className="p-3 pb-6 rounded-lg bg-blue-500 text-white max-w-xs shadow-md relative">
                    {msg.message}
                    {/* <div className="text-white text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div> */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-300">{msg.username}</span> 
                  <div className="p-3 pb-6 rounded-lg bg-gray-700 text-white max-w-xs shadow-md relative">
                    {msg.message}
                    {/* <div className="text-white text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
  
      <footer className="p-4 bg-gray-800 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-lg bg-gray-700 text-white mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={sendMessage} className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          Send
        </button>
      </footer>
      </div>

    </div>
  )
}

export default CommunityChat
