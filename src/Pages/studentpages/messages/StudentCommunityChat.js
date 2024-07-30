import React from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect,useState,useRef } from 'react'
import { useParams } from 'react-router-dom'
import '../../style.css'
function StudentCommunityChat() {
    // const baseURL="http://127.0.0.1:8000";
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const user_id=localStorage.getItem('userid')
    const [communitylist,setCommunityList]=useState([])
    const imageURL = 'https://www.tawk.to/wp-content/uploads/2020/08/chat-pages-link.png'; 

    const {id,code}=useParams()
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [oldchats,setOldchats]=useState([]);
    const websocket = useRef(null);
    const idVal=id.toString()
    const codeVal=code.replace(/\s+/g, '');
    const communityroom=idVal+codeVal



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


    
    
    
    const fetchCode=async()=>{
      console.log('the id is...',id)
      console.log('the code is the...',code)
      console.log('memememme..',communityroom)
    }
  
    useEffect(()=>{
      fetchCode()
      fetchPreviousChats()
      setMessages([])
    },[id,code])
  
    const fetchPreviousChats=async()=>{
      try{
        const response=await axios.get(baseURL+`/api/students/previous_community_chats/${communityroom}`,{
          headers: {
            'authorization': `Bearer ${token}`,  
          }
        })
        console.log('response is....', response.data)
        setOldchats(response.data)
        console.log('user_id is.....',user_id)
  
      }catch(error){
        console.log('error in fetching previous chats',error)
      }
      
      
    }
  
    useEffect(()=>{
      // Open WebSocket connection
     websocket.current=new WebSocket(`ws://localhost:8000/ws/chat/${communityroom}/${user_id}/`);
    
     // Handle incoming messages
     websocket.current.onmessage=function(event){
      const data=JSON.parse(event.data);
      setMessages((prevMessages)=>[...prevMessages,{ message:data.message, owner_id : data.sender, username:data.sender_name, timestamp:data.timestamp }]);
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
        <div className="flex flex-col h-screen bg-black text-white">
            <h1 className="text-2xl font-bold p-4 bg-yellow-500 text-black">{code} Community Chat </h1>
            <div ref={chatRef} className="flex-1 p-4 overflow-y-auto hide-scrollbar">
                {oldchats.map((msg, index) => (
                        <div key={index}>
                        {msg.sender  == user_id ?(
                            <div className="flex justify-end my-2">
                            <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-300 mr-1 mb-1">You</span> 
                            <div className="p-3 pb-6 rounded-lg bg-yellow-400 text-black max-w-xs w-auto max-w-full shadow-md break-words relative">
                                {msg.message}
                                <div className="text-black text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div>
                            </div>
                        </div>
                        </div>
                        ):(
                            <div className="flex justify-start my-2">
                            <div className="flex flex-col items-start">
                                <span className="text-sm text-gray-300 mr-1 mb-1">{msg.username}{msg.is_teacher && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> }</span> 
                                <div className="p-3 pb-6 rounded-lg bg-gray-700 text-white max-w-xs w-auto max-w-full shadow-md break-words relative">
                                    {msg.message}
                                    <div className="text-white text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div>
                                </div>
                            </div>
                            </div>
                        )}
                        </div>
                    ))}
                {messages.map((msg, index) => (
                    <div key={index}>
                    {msg.owner_id  == user_id ?(
                        <div className="flex justify-end my-2">
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-300 mr-1 mb-1">You</span> 
                            <div className="p-3 rounded-lg bg-yellow-400 text-black max-w-xs w-auto max-w-full shadow-md break-words">
                                {msg.message}
                            </div>
                            </div>  

                    </div>
                    ):(
                        <div className="flex justify-start my-2">
                        <div className="flex flex-col items-start">
                            <span className="text-sm text-gray-300 ml-2 mb-1">{msg.username} {msg.is_staff && <span>***</span> } </span>
                            <div className="p-3 rounded-lg bg-gray-700 text-white max-w-xs w-auto max-w-full shadow-md break-words">
                                    {msg.message}
                            </div>
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
                <button onClick={sendMessage} className="p-2 rounded-lg bg-yellow-500 text-black">Send</button>
            </div>
        </div>
    
      </div>
  </div>
  )
}

export default StudentCommunityChat
