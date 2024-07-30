import React,{useState,useRef} from 'react';
import { useParams,useNavigate, redirect } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
function Addvideos() {
  // const baseURL='http://127.0.0.1:8000';
  const baseURL = process.env.REACT_APP_BASE_URL;
  const {id}=useParams()
  const navigate=useNavigate()
  const [nameError,setNameError]=useState('')
  const [descError,setDescError]=useState('')
  const [videoError,setVideoError]=useState('')
  const [videoData, setVideoData] = useState({
    video_name: '',
    description: '',
    video: null,
    course: id || '',
  });

  const fileInputRef = useRef(null);

  const handleinputChange=(e)=>{
    const {name,value}=e.target
    setVideoData({...videoData,[name]:value})
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoData({ ...videoData, video: file });
  };

  const handleSubmit=async(e,redirect)=>{
    e.preventDefault()
    console.log('the form is submitted')
    console.log(videoData)


    // validation part

    setNameError('')
    setDescError('')
    setVideoError('')


    if (!videoData.video_name.trim()) {
      setNameError('name is required')
  }

  if (!videoData.description.trim()) {
      setDescError('Description  is required');
  }

  if (!videoData.video) {
    setVideoError(' video is not selected');
    return
  }
    const formData = new FormData();
    formData.append('video_name', videoData.video_name);
    formData.append('description', videoData.description);
    formData.append('video', videoData.video);
    formData.append('course', parseInt(videoData.course));

    try{
      const response = await axios.post(baseURL+'/teacherapp/add_video/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })

      if(response.status===201){
        console.log('Video uploaded successfully:', response.data);
        if(redirect === 'add_course'){
          navigate(`/teacher/course_view/${id}`)
        }else{
          setVideoData({
            video_name: '',
            description: '',
            video: null,
            course: id || '',
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input field
          }
          toast.success('New Video Added');
          navigate(`/teacher/add_video/${id}`);
        }
          
      }
    }catch (error) {
      console.error('Error uploading video:', error);
    }


  }

  return (
    <div className='bg-gray-900 text-white min-h-screen flex justify-center items-center'>
      <div className='bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2'>
        <h3 className='text-2xl mb-6 font-semibold text-center'>Upload the Course Video and Fill the Fields</h3>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-2 text-sm font-medium'>Video Name</label>
            <input 
              name="video_name"
              value={videoData.video_name}
              type="text" 
              onChange={handleinputChange}
              placeholder='Enter the video name' 
              className='w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {nameError && <span className="text-md text-red-800 mt-1 mb-5">{nameError}</span>}
          </div>
          <div>
            <label className='block mb-2 text-sm font-medium'>Video Description</label>
            <textarea 
              name="description"
              value={videoData.description}
              onChange={handleinputChange}
              placeholder="Enter the video description" 
              className='w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {descError && <span className="text-md text-red-800 mt-1 mb-5">{descError}</span>}
          </div>
          <div>
            <label className='block mb-2 text-sm font-medium'>Video File</label>
            <input 
              type="file" 
              name="video"
              onChange={handleFileChange}
              ref={fileInputRef}
              className='w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {videoError && <span className="text-md text-red-800 mt-1 mb-5">{videoError}</span>}
          </div>
          <div className='text-center'>
            <button 
              onClick={(e) => handleSubmit(e, 'add_course')}
              className='px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Submit Course
            </button>
            <button 
              onClick={(e) => handleSubmit(e, 'add_another')}
              className='px-6 py-3 ml-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Add more
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Addvideos
