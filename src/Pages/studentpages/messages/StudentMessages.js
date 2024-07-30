import React,{useEffect,useState,useRef} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
function StudentMessages() {
    const {user_id}=useParams()
    const {teacher_id}=useParams()
    // const baseURL = "http://127.0.0.1:8000";

    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const [previous,setPrevious]=useState([])
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const websocket = useRef(null);
   

    const fetchPreviousChats=async()=>{
      try{
        const response= await axios.get(baseURL+`/api/students/previous_chats/${user_id}/${teacher_id}/`,{
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
      console.log('user id is..........,',user_id)
      console.log('mentor id is........,',teacher_id)
      fetchPreviousChats()

    },[])



    useEffect(()=>{
        // Open WebSocket connection
       websocket.current=new WebSocket(`ws://localhost:8000/ws/chat/personal/${user_id}/${teacher_id}/`);
   
        // Handle incoming messages
   websocket.current.onmessage=function(event){
    const data=JSON.parse(event.data);
    setMessages((prevMessages)=>[...prevMessages,{ message:data.message, owner_id : data.sender }]);
    console.log(messages)
    // Cleanup on unmount
  }
  return () => {
    websocket.current.close();
  };
},[user_id,teacher_id]);

const sendMessage = () => {
   const messageData = {
     message: message
   };

   // Send message to WebSocket
   websocket.current.send(JSON.stringify(messageData));
   setMessage('');
 };

 return (
  <div className="flex flex-col h-screen bg-gray-800 text-white">
  <h1 className="text-2xl font-bold p-4 bg-black">Chat with Mentor </h1>
  <div className="flex-1 p-4 overflow-y-auto">

      {previous.map((msg, index) => (
              <div key={index}>
                {msg.sender  == user_id ?(
                  <div className="flex justify-end my-2">
                  <div className="p-3 rounded-lg bg-yellow-400 text-black max-w-xs">
                      {msg.message}
                  </div>
                </div>
                ):(
                  <div className="flex justify-start my-2">
                <div className="p-3 rounded-lg bg-gray-700 text-white max-w-xs">
                      {msg.message}
                </div>
            </div>
                )}
              </div>
          ))}

      {messages.map((msg, index) => (
          <div key={index}>
            {msg.owner_id  == user_id ?(
              <div className="flex justify-end my-2">
              <div className="p-3 rounded-lg bg-yellow-400 text-black max-w-xs">
                  {msg.message}
              </div>
            </div>
            ):(
              <div className="flex justify-start my-2">
            <div className="p-3 rounded-lg bg-gray-700 text-white max-w-xs">
                  {msg.message}
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
 )
}

export default StudentMessages
