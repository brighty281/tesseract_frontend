import React from 'react'
import { useEffect,useState,useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
function CourseComunity() {
  const {id,code}=useParams()
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // const baseURL = "http://127.0.0.1:8000";
  const baseURL = process.env.REACT_APP_BASE_URL;
  const token=localStorage.getItem('access')
  const [oldchats,setOldchats]=useState([]);

  const websocket = useRef(null);

  const idVal=id.toString()
  const codeVal=code.replace(/\s+/g, '');
  const communityroom=idVal+codeVal
  const user_id=localStorage.getItem('userid')
  
  const fetchCode=async()=>{
    console.log('the id is...',id)
    console.log('the code is the...',code)
    console.log('memememme..',communityroom)
  }

  useEffect(()=>{
    fetchCode()
    fetchPreviousChats()
  },[])

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

  useEffect(()=>{
    // Open WebSocket connection
   websocket.current=new WebSocket(`${baseURL}/ws/chat/${communityroom}/${user_id}/`);

   // Handle incoming messages
   websocket.current.onmessage=function(event){
    const data=JSON.parse(event.data);
    setMessages((prevMessages)=>[...prevMessages,{ message:data.message, owner_id : data.sender, username:data.sender_name }]);
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

  return (
    <div className="flex flex-col h-screen bg-black text-white">
    <h1 className="text-2xl font-bold p-4 bg-yellow-500 text-black">{code} Community Chat </h1>
    <div className="flex-1 p-4 overflow-y-auto">
        {oldchats.map((msg, index) => (
                <div key={index}>
                  {msg.sender  == user_id ?(
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
                        <span className="text-sm text-gray-300 mr-1 mb-1">{msg.username}{msg.is_teacher && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" /> }</span> 
                        <div className="p-3 rounded-lg bg-gray-700 text-white max-w-xs w-auto max-w-full shadow-md break-words">
                              {msg.message}
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
  )
}

export default CourseComunity
