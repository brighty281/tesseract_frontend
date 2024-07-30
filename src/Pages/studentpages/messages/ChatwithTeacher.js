import React, { useEffect,useState,useRef } from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../style.css'
function ChatwithTeacher() {
    const {course_id,teacher_id}=useParams()
    const user_id=localStorage.getItem('userid')

    // const baseURL="http://127.0.0.1:8000";
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const [mentors,setMentors]=useState([])
   
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [previous,setPrevious]=useState([]);
    // const [userStatus,setuserStatus]=useState([
    //   {studentid:user_id,status:false},
    //   {teacherid:teacher_id,status:false}
    // ]);
    const [userStatus,setuserStatus]=useState({
      is_online:false
    })
    const [currentstatus,setCurrentstatus]=useState('')
    const [selecteduser,setSelectedUser]=useState('')
    const websocket = useRef(null);
    const fetchPurchasedCourse=async()=>{
        try{
        const response=await axios.get(baseURL+'/api/students/enrolled_courses/',{
            headers:{
            Authorization: `Bearer ${token}`
            }
        })
          console.log('purchased course by the student is given by.......',response.data)
          setMentors(response.data)
          const mycourse=response.data.find(obj => obj.course.id === parseInt(course_id))
          console.log('course is.....',mycourse)
          setSelectedUser(mycourse)
          

        }catch(error){
          console.log('error in fetching course purchased courses',error)
        }
        
    }

    useEffect(()=>{
        fetchPurchasedCourse()
      },[course_id])

    useEffect(()=>{
      setMessages([])
    },[course_id])

    useEffect(()=>{
    // Open WebSocket connection
    websocket.current=new WebSocket(`${baseURL}/ws/chat/personal/${user_id}/${course_id}/${user_id}/`);

    // Handle incoming messages
    websocket.current.onmessage=function(event){
        const data=JSON.parse(event.data);
        if(data.message){
          setMessages((prevMessages)=>[...prevMessages,{ message:data.message, sender : data.sender_id, timestamp:data.timestamp }]);
        }else if(data.type === 'user_status'){
          console.log(`User ${data.user_id} is ${data.is_online ? 'online' : 'offline'}`);
          if(data.user_id === parseInt(teacher_id)){
              setuserStatus({is_online:data.is_online})
              console.log('data is.......',data)
          }
        }
        // Cleanup on unmount
    }

    websocket.current.onopen = function () {
      console.log("WebSocket connection opened");
  };

  websocket.current.onclose = function () {
      console.log("WebSocket connection closed");
  };
    return () => {
      websocket.current.close(); 
    };
    },[user_id,course_id,teacher_id]);

    const sendMessage = () => {
    const messageData = {
        message: message
    };

    // Send message to WebSocket
    websocket.current.send(JSON.stringify(messageData));
    setMessage('');
    };

    // fetching the previous chat

    const fetchPreviousChats=async()=>{
      try{
        const response= await axios.get(baseURL+`/api/students/previous_chats/${user_id}/${course_id}/`,{
          headers: {
            'authorization': `Bearer ${token}`,  
          }
        })
        console.log('fetched successfullly')
        console.log('fetched messages are...',response.data)
        setPrevious(response.data)
      }catch(error){
        console.log('errror in fetching previous chats,',error)
      }
    }
    

useEffect(()=>{
  fetchPreviousChats()
},[course_id])

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
},[previous, messages])

  return (
    <div className="flex h-screen font-montserrat font-medium bg-gray-900 text-white">
    {/* Left sidebar for users */}
    <div className="w-1/3 bg-gray-800 flex flex-col">
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
     <div className="flex-1 flex flex-col">
     <div  className="flex flex-col h-screen bg-black text-white">
        <h1 className="text-2xl font-bold p-4 bg-black">Chat with Mentor  {selecteduser && selecteduser.course.course_name}  {(userStatus && userStatus.is_online) ? <span> <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> Online</span>: null}  </h1>
        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto hide-scrollbar">
          {previous.map((msg, index) => (
                <div key={index}>
                  {msg.sender  == user_id ?(
                    <div className="flex justify-end my-2">
                    <div className="p-3 pb-6 rounded-lg bg-yellow-400 text-black max-w-xs relative">
                        {msg.message}
                        <div className="text-gray-700 text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div>
                    </div>
                  </div>
                  ):(
                    <div className="flex justify-start my-2">
                        <div className="p-3 pb-6 rounded-lg bg-gray-700 text-white max-w-xs relative">
                              {msg.message}
                              <div className="text-gray-200 text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div>
                        </div>
                  </div>
                  )}
                </div>
            ))}
            {messages.map((msg, index) => (
                <div key={index}>
                    {msg.sender  == user_id ?(
                    <div className="flex justify-end my-2">
                        <div className="p-3 pb-6 rounded-lg bg-yellow-400 text-black max-w-xs relative">
                            {msg.message}
                            <div className="text-gray-500 text-sm absolute bottom-0 right-0 pr-1">{msg.timestamp}</div>
                        </div>
                    </div>
                    ):(
                    <div className="flex justify-start my-2">
                        <div className="p-3 pb-6 rounded-lg bg-gray-700 text-white max-w-xs relative">
                            {msg.message}
                            <div className="text-gray-100 text-sm absolute bottom-0 right-0 pr-1">{msg.timestamp}</div>
                        </div>
                    </div>
                    )}
                </div>
            ))}
        </div>
        <div className="p-4 bg-black flex">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white mr-2"
            />
            <button onClick={sendMessage} className="p-2 rounded-lg bg-yellow-400 text-black">Send</button>
        </div>
        </div>
      </div>
  </div>
  )
}

export default ChatwithTeacher
