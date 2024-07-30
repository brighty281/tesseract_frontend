import React, { useEffect, useState,useRef} from 'react'
import { useParams,Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../style.css'
function Conversation() {
  const {course_id}=useParams()
  const {student_id}=useParams()
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const websocket = useRef(null);
  const [userStatus,setuserStatus]=useState({
    is_online:false
  })
  const teacher_id=localStorage.getItem('userid')
  // fetch students list

  // const baseURL="http://127.0.0.1:8000"
  const baseURL = process.env.REACT_APP_BASE_URL;
  const token=localStorage.getItem('access')
  const [users,setUsers]=useState([])
  const [chat_user,setchatUser]=useState('')
  const [previous,setPrevious]=useState([])

  const fetchUserData=async()=>{
    try{
        const response=await axios.get(baseURL+"/teacherapp/teacherorders_view/",{
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log('list of students',response.data)
        setUsers(response.data)

        const user = response.data.find(obj => obj.course === parseInt(course_id));
        if (user) {
          setchatUser(user);
        }
        console.log('the user is......',chat_user)
    }catch(error){
        console.log('Error is......',error)
    }
}


useEffect(()=>{
    fetchUserData()
},[course_id])


const fetchPreviousChats=async()=>{
  try{
    const response= await axios.get(baseURL+`/api/students/previous_chats/${student_id}/${course_id}/`,{
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
  

  useEffect(()=>{
    // Open WebSocket connection
   websocket.current=new WebSocket(`ws://localhost:8000/ws/chat/personal/${student_id}/${course_id}/${teacher_id}/`);
    setMessages([])
    // Handle incoming messages
   websocket.current.onmessage=function(event){
     const data=JSON.parse(event.data);
     if(data.message){
      setMessages((prevMessages)=>[...prevMessages,{ message:data.message, owner_id : data.sender_id , timestamp:data.timestamp  }]);
      console.log('the messages are...',messages)
     }else if(data.type === 'user_status'){
         console.log(`User ${data.user_id} is ${data.is_online ? 'online' : 'offline'}`);
          if(data.user_id === parseInt(student_id)){        
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
 },[student_id,course_id]);



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
    <div className="flex h-screen bg-gray-900 text-white">
    {/* Left sidebar for users */}
    <div className="w-1/3 bg-gray-800">
          <h1 className="text-2xl font-bold p-4">Users</h1>
          <ul className="overflow-y-auto">
              
              {users.map((userdet,index)=>(
                  <Link to={`/teacher/teacher_conversation/${userdet.user}/${userdet.course}`} ><li className="p-4 hover:bg-gray-700 cursor-pointer">{userdet.username}-{userdet.course_name}</li></Link>

              ))}
          </ul>
      </div>
    
    {/* Right section for chat */}
    <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold p-4 bg-gray-800">{chat_user.username}-{chat_user.course_name}  {(userStatus && userStatus.is_online) ? <span><FontAwesomeIcon icon={faCheckCircle} className="text-green-500"/> Online </span> : null} </h1>
        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto hide-scrollbar">
        {previous.map((msg, index) => (
              <div key={index}>
                {msg.sender  == teacher_id ?(
                  <div className="flex justify-end my-2">
                  <div className="p-3  pb-6 rounded-lg bg-blue-500 text-white max-w-xs relative">
                      {msg.message}
                      <div className="text-gray-200 text-sm absolute bottom-0 right-0 pr-1">{formatTime(msg.timestamp)}</div>
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
            {msg.owner_id  == teacher_id ?(
              <div className="flex justify-end my-2">
              <div className="p-3 pb-6 rounded-lg bg-blue-500 text-white max-w-xs relative">
                  {msg.message}
                  <div className="text-gray-200 text-sm absolute bottom-0 right-0 pr-1">{msg.timestamp}</div>
              </div>
            </div>
            ):(
              <div className="flex justify-start my-2">
            <div className="p-3 pb-6  rounded-lg bg-gray-700 text-white max-w-xs relative">
                  {msg.message}
                  <div className="text-gray-200 text-sm absolute bottom-0 right-0 pr-1">{msg.timestamp}</div>
            </div>
        </div>
            )}
          </div>
      ))}
        </div>
        <div className="p-4 bg-gray-800 flex">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white mr-2"
            />
            <button onClick={sendMessage} className="p-2 rounded-lg bg-blue-500">Send</button>
        </div>
    </div>
</div>
  )
}

export default Conversation
