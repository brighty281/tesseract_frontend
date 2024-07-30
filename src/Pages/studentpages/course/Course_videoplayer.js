import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Userimage from '../../../images/user.png'
import moment from 'moment';
import { FaReply } from "react-icons/fa";
import '../../style.css';
function Course_videoplayer() {
  // const baseURL="http://127.0.0.1:8000";
  const baseURL = process.env.REACT_APP_BASE_URL;
  const {id}=useParams()
  const {vid}=useParams()
  const navigate=useNavigate()
  const token = localStorage.getItem('access');
  // chat part modifications
  const user_id=localStorage.getItem('userid');
  const [author_id,setAuthorid]=useState('')
  

  // comments and replies

  const [comment,setComment]=useState('')
  const [comments,setComments]=useState([])
  const [replies,setReplies]=useState([])
  const [repliesMap, setRepliesMap] = useState({});
  const [activereplyField,setActiveReplyField]=useState(null)
  const [replyComment,setReplyComment]=useState('')

  const [videoUrl,setVideoUrl]=useState('')
  const [loading,setLoading]=useState()
  const [course,setCourse]=useState({
    id:'',
    course_name:'',
    user:'',
    description:'',
    level:'',
    benefit1:'',
    benefit2:'',
    benefit3:'',
    original_price:'',
    offer_price:'',
    demo_video:null,
    is_blocked:'',
    is_rejected:'',
    reject_reason:'',
    videos: []

  })

  const fetchVideo=async()=>{
    try{
      const response= await axios.get(baseURL+`/api/students/video_details/${id}/${vid}/`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })

      
      setVideoUrl(response.data.video)
      console.log('fetchvideo.data.',response.data)
      console.log('fetchvideo video....',response.data.video)
      console.log('user_id for chat is...',user_id)

      
    }
    catch(error){
      console.log('error in fetching video,...',error)
    }
    
  }
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const handleVideoLinkClick = (newVideoId) => {

    setVideoUrl(''); 
    setLoading(true); // Set loading state to true when fetching video details
    setSelectedVideoId(newVideoId);
    window.history.pushState(null, null, `/videoplayer/${id}/${newVideoId}`);
    fetchVideo();

};
// tab selection state management

const [activeTab, setActiveTab] = useState('overview');

const handleTabClick = (tab) => {
  setActiveTab(tab);
};


  const fetchCourse=async()=>{
    try{
      const response=await axios.get(baseURL+`/api/students/course_details/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      console.log('course response is......',response.data)
      console.log('course description response is......',response.data.course.description)
      const data=response.data
      setCourse({
        id:data.course.id,
        course_name: data.course.course_name,
        user: data.course.user,
        description: data.course.description,
        benefit1: data.course.benefit1,
        level: data.course.level,
        benefit2: data.course.benefit2,
        benefit3: data.course.benefit3,
        demo_video: data.course.demo_video,
        original_price: data.course.original_price,
        offer_price: data.course.offer_price,
        videos: data.videos,
        is_blocked: data.course.is_blocked,
        is_accepted: data.course.is_accepted,
        is_rejected: data.course.is_rejected,
        reject_reason: data.course.reject_reason,
  
  })
    console.log('videos are...',course.videos)
    setLoading(false); 
    setAuthorid(response.data.course.author)
    console.log(response.data.course.author)
    console.log(author_id)

    }
    catch(error){
      console.log('Error in fetching details')
    }
  }

  

  //useEffect section////////////////////////////////////////////

  useEffect(()=>{
    fetchVideo()
    fetchVideoComments();
  },[id,vid])


  useEffect(()=>{
    fetchCourse()
    
  },[id])

  // commments related function

  

  const handleSubmit=async(event)=>{
    event.preventDefault()
    console.log('comments submitted')
    try{
      const response=await axios.post(baseURL+'/api/students/add_comment/',{
        user:user_id,
        course:id,
        video:vid,
        comment: comment
      },{headers: {
        'authorization': `Bearer ${token}`,  
      }})
      console.log('Comment added successfully:', response.data);
      setComment('');
      fetchVideoComments();
    }catch(error){
      console.log('error in adding comments',error)
    }
    
  }

  const fetchVideoComments = async () => {

    try {
        const response = await axios.get(baseURL+`/api/students/video_comments/${vid}/`);
        const comments = response.data;
        setComments(response.data);
        console.log('Comments:', comments);

    } catch (error) {
        console.error('Error fetching video comments:', error);
    }
};

useEffect(()=>{
  fetchTeacherDetails()
},[author_id])


const handleReplyClick=(commentId)=>{
  console.log('set active field')
  setActiveReplyField((prevCommentId)=>(prevCommentId === commentId ? null :commentId));
}


  const handleReplySubmit=async(event,commentid)=>{
    event.preventDefault()
    try{
      console.log('reply added.....',replyComment)
      console.log('reply comment id is.....',commentid)
      const response=await axios.post(baseURL +`/api/students/replycomment/${commentid}/`,{
        'reply_text':replyComment,
        'comment':commentid
      },{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      })
      setReplyComment('')
      console.log('reply submitted')
    }catch(error){
      console.log('error in submitting...',error)

    }
  }

  const fetchReplies=async(comment_id)=>{
    try{
      console.log('comment id.....',comment_id)
      const response=await axios.get(baseURL+`/api/students/getreply/${comment_id}/`)
      console.log("replies are........",response.data)
      setRepliesMap((prevReplies) => ({
        ...prevReplies,
        [comment_id]: response.data
      }));

    }
    catch(error){
      console.log('error in fetching errors..',error)
    }
  }

  //  fetch teacher description
  const [teacherInfo,setTeacherInfo]=useState('')
  
  const fetchTeacherDetails=async()=>{
    try{
      const response=await axios.get(baseURL+`/api/students/getteacher_details/${author_id}`)
      console.log('teacher details..is given byyyy',response.data)
      setTeacherInfo(response.data)
    }
    catch(error){
      console.log('error in fetching teacher...details',error)
    }
  }

  
  return (
    <div className='bg-black font-montserrat font-medium text-lg text-white min-h-screen flex flex-col items-center'>
      <div className='container bg-black mx-auto py-8'>
        {/* Video Player and Playlist Section */}
        <div className='flex flex-col lg:flex-row mb-8'>
          <div className='w-full lg:w-2/3 flex justify-center items-center mb-4 lg:mb-0'>
            {videoUrl && (
              <div className='w-full'>
                <video className='w-full' controls>
                  <source src={baseURL + videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
          <div className='w-full lg:w-1/3 lg:ml-8'>
            <div className='bg-yellow-500 text-black p-4 rounded' >
              <h2 className='text-lg font-semibold mb-4 text-center lg:text-left'>Playlist</h2>
              <div className='overflow-y-auto max-h-96 hide-scrollbar'>
                {course.videos.map((video) => (
                  <div key={video.id} className={`mb-4 cursor-pointer ${selectedVideoId === video.id ? 'bg-yellow-300' : 'bg-yellow-500'} hover:bg-yellow-600 rounded p-2`}>
                    <span onClick={() => handleVideoLinkClick(video.id)} className='cursor-pointer'>
                      <Link to={`/video_player/${id}/${video.id}`} className='text-black hover:underline'>
                        {video.video_name}
                      </Link>
                    </span><br />
                    <span className='text-sm text-black'>{video.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex justify-center'>
          <button
            className={`mr-4 px-4 py-2 rounded focus:outline-none ${activeTab === 'overview' ? 'bg-yellow-500 text-black' : 'bg-black text-white'}`}
            onClick={() => handleTabClick('overview')}
          >
            Overview
          </button>
          <button
            className={`mr-4 px-4 py-2 rounded focus:outline-none ${activeTab === 'comments' ? 'bg-yellow-500 text-black' : 'bg-black text-white'}`}
            onClick={() => handleTabClick('comments')}
          >
            Comments
          </button>
          <button
            className={`mr-4 px-4 py-2 rounded focus:outline-none ${activeTab === 'teacher' ? 'bg-yellow-500 text-black' : 'bg-black text-white'}`}
            onClick={() => handleTabClick('teacher')}
          >
            Know About mentor
          </button>

          <button onClick={()=>navigate(`/chat_with_teacher/${course.id}/${author_id}`)} className={`mr-4 px-4 py-2 rounded focus:outline-none 'bg-black text-white'`}>Chat with Mentor</button>

          <button 
            className={`mr-4 px-4 py-2 rounded focus:outline-none 'bg-black text-white'`}
            onClick={()=>navigate(`/community_conversation/${course.id}/${course.course_name}`)}> 
             {course.course_name} community
          </button>
        </div> 

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className='mb-8 mt-4 flex justify-center w-full lg:w-4/5 mx-auto bg-yellow-400  text-black p-8 rounded-lg'>
            {/* Placeholder content for overview */} 
            <p> Hey Fellow Learner, <br/> <br/> This is a comprehensive package to learn about the course. Here, {course.description} {course.benefit1}. {course.benefit2} {course.benefit3} <br/><br/> Here you can clear all your doubts in chat with mentor section where we provide 24 x 7 support. <br/> We also provide add you into a community group where you can meet your fellow aspirants. </p>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className='mb-8 mt-4 flex justify-center w-full lg:w-4/5 mx-auto bg-yellow-400  text-black p-4 rounded-lg'>
          {/* Placeholder content for overview */}
          
          <div className="flex flex-col mx-auto items-center justify-center w-full max-w-2xl p-6 bg-black rounded-lg shadow-lg">

              <form onSubmit={handleSubmit} className="w-full bg-yellow-400 rounded-lg p-4 shadow-md">
                  <h2 className="px-4 pt-3 pb-2 text-black text-lg">Add a new comment</h2>
                  <div className="w-full px-3 mb-2 mt-2">
                    <textarea
                      className="bg-black rounded border text-yellow-400 border-gray-800 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-gray-800"
                      name="body"
                      placeholder="Type Your Comment"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="w-full flex items-start px-3">
                    <div className="-mr-1">
                      <input
                        type="submit"
                        className="bg-black text-yellow-500 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-700"
                        value="Post Comment"
                      />
                    </div>
                  </div>
              </form>
              
              <div className="w-full bg-yellow-400">
                {comments.length === 0 && <div className='items center justify-center'><p>Be the first to comment</p></div>}
                {comments.map((mycomment) => (
                  <div key={mycomment.id} className="bg-yellow-400 p-3 mb-2">
                     <div className="flex items-center mb-2">
                        <img src={Userimage} alt="Profile" className="w-6 h-6 rounded-full mr-3" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-black">{mycomment.username}</span>
                          <span className="text-gray-600 text-sm">{moment(mycomment.date_added).fromNow()}</span>
                        </div>
                      </div>
                    <span className="text-black ml-9">{mycomment.comment}</span> <br/>
                    <div className="flex items-center ml-14  mt-2 text-sm cursor-pointer" onClick={()=>handleReplyClick(mycomment.id)}>
                           <span>Reply</span>
                           <FaReply className="ml-1" />
                    </div>

                    <div className='ml-9 mt-2'>
                      <span className="text-black cursor-pointer text-sm" onClick={() => fetchReplies(mycomment.id)}>View replies</span><br/>
                      {repliesMap[mycomment.id] && repliesMap[mycomment.id].map((reply) => (
                        <div key={reply.id} className="bg-yellow-400 p-2 mt-2 rounded-md">
                          <div className="flex items-center mb-1">
                            <img src={Userimage} alt="Profile" className="w-4 h-4 rounded-full mr-2" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-black text-sm">{reply.username}</span>
                              <span className="text-gray-600 text-xs">{moment(reply.date_added).fromNow()}</span>
                            </div>
                          </div>
                          <span className="text-black ml-6 text-sm">{reply.reply_text}</span>
                        </div>
                      ))}
                    </div>
                    
                  

                    {activereplyField === mycomment.id && (
                      <form onSubmit={(event)=>handleReplySubmit(event,mycomment.id)} className="ml-14 mt-2">
                        <textarea 
                          placeholder="enter yout reply"
                          value={replyComment}
                          onChange={(event)=>setReplyComment(event.target.value)}
                          className="w-full p-2 border rounded-md bg-black text-white"
                        />
                        <button type="submit" className="mt-2 px-4 py-2 bg-black text-yellow-500 rounded-md">Submit</button>
                      </form>
                    ) }

    
                  </div>
                ))}
              </div>
        
              
            </div>

          </div>
        )}

        {activeTab === 'teacher' && (
          <div className='mb-8 mt-4 flex justify-center  w-full lg:w-4/5 mx-auto bg-yellow-400  text-black p-4 rounded-lg'>
          {/* Placeholder content for overview */}
          
          <div className='flex max-w-4xl mx-auto mt-10 p-6 bg-yellow-500 shadow-lg rounded-lg'>
          <div className='w-1/3 flex'>
              <img src={Userimage} alt='userimg'/>
          </div>
          <div className="w-2/3 pl-8 rounded-lg mt-3">
              <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                  <span className='bg-black text-yellow-400 rounded-lg w-1/5 flex  p-1'>Name</span>
                  <span className='ml-3'>{course.user}</span>
              </div>
              <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                  <span className=' bg-black text-yellow-400 rounded-lg w-1/5 flex  p-1'>Age</span>
                  <span className='ml-3'>{teacherInfo.age}</span>
              </div>
              <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                  <span className='bg-black text-yellow-400 rounded-lg w-1/5 flex  p-1'>Email</span>
                  <span className='ml-3'>brightybabu2001@gmail.com</span>
              </div>
              <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                  <span className='bg-black text-yellow-400 rounded-lg w-1/5 flex  p-1'>Experience</span>
                  <span className='ml-3'>{teacherInfo.experience} years</span>
              </div>
              
          </div>

          
                        

        </div>
        </div>
        )}
      </div>
    </div>
    
  )
}

export default Course_videoplayer
