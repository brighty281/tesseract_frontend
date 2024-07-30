import React,{useState} from 'react'
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';

function Addcourse() {
    // const baseURL='http://127.0.0.1:8000'
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('access');
    const navigate=useNavigate()
    const [nameError,setNameError]=useState('')
    const [descError,setDescError]=useState('')
    const [levelError,setLevelError]=useState('')
    const [opriceError,setOpriceError]=useState('')
    const [ofpriceError,setOfpriceError]=useState('')
    const [demoError,setDemoError]=useState('')
    const [thumbError,setThumbError]=useState('')

    const [formData, setFormData] = useState({
        course_name: '',
        description: '',
        level: '',
        demo_video:null,
        thumbnail:null,
        benefit1:'',
        benefit2:'',
        benefit3:'',
        original_price:'',
        offer_price:'',
        added_by:null

      });

      const handleChange=(e)=>{
        if (e.target.name==='demo'){
            setFormData({
                ...formData,
                demo_video: e.target.files[0] 
              });
        }else if (e.target.name === 'thumbnail') {
            setFormData({
              ...formData,
              thumbnail: e.target.files[0] 
            });
        }else if (e.target.name === 'level') {  
            setFormData({
              ...formData,
              level: e.target.value
            });
        }else {
            setFormData({
              ...formData,
              [e.target.name]: e.target.value
            });
          }
      }


    const handleSubmit=async(event)=>{
        event.preventDefault()
        console.log('form submitted............')
        console.log(formData)



        setNameError('')
        setDescError('')
        setLevelError('')
        setOfpriceError('')
        setOpriceError('')
        setDemoError('')
        setThumbError('')
  
      if (!formData.course_name.trim()) {
          setNameError('name is required')
          return
      }
  
      if (!formData.description.trim()) {
          setDescError('Description required is required');
          return
      }
  
      if (!formData.level.trim()) {
        setLevelError('level required is required');
        return
    }
  
  
    if (!formData.original_price.trim()) {
      setOpriceError('original price required is required');
      return

  }

  if (formData.offer_price>formData.original_price){
    console.log("say helloo")
    setOfpriceError('offer price must less than Original price')
    return
  }

 

  if (!formData.demo_video) {
    setDemoError('Demo video is required');
    return
}


if (!formData.thumbnail) {
  setThumbError('Thumbnail is required');
    return
}

try{
    const response=await axios.post(baseURL+'/teacherapp/add_course/',formData,{
        headers: {  
            'content-type': 'multipart/form-data',
            'authorization': `Bearer ${token}`,  
          }
    })
    if (response.status===201){
        navigate(`/teacher/add_video/${response.data.id}`);
        console.log('Course added successfully:', response.data);
    }
}catch (error) {
    console.error('Error adding course:', error);
  }
  

    }
  return (
    <div className="relative p-6 items-center flex justify-center bg-black text-white min-h-screen">
        <div className="w-full max-w-3xl">
            <h3 className="text-2xl font-bold mb-6">Add the Course Here</h3>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-8" encType='multipart/form-data'>
                    <div>
                        <p className="text-lg mb-2">Please fill the following fields</p>
                        <p className="text-lg text-gray-400">Course Details</p>
                    </div>
                    <div>
                        <label htmlFor="courseName" className="block text-sm font-medium text-gray-300">Course Name</label>
                        <input type="text"  name="course_name" placeholder="Enter the course name" onChange={handleChange} className="w-full mt-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {nameError && <span className="text-md text-red-800 mt-1 mb-5">{nameError}</span>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea id="description" name="description" onChange={handleChange} placeholder="Enter the description" className="w-full mt-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        {descError && <span className="text-md text-red-800 mt-1 mb-5">{descError}</span>}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-300">Course Level</p>
                        <div className="flex items-center mt-2">
                            <input type="radio" id="Beginner" onChange={handleChange} checked={formData.level === 'Beginner'} value="Beginner" name="level" className="text-blue-500 focus:ring-0" />
                            <label htmlFor="Beginner" className="ml-2 text-sm text-gray-300">Beginner</label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input type="radio" id="intermediate" checked={formData.level === 'Intermediate'} onChange={handleChange} value="Intermediate" name="level" className="text-blue-500 focus:ring-0" />
                            <label htmlFor="intermediate" className="ml-2 text-sm text-gray-300">Intermediate</label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input type="radio" id="Advanced" value="Advanced"  checked={formData.level === 'Advanced'} onChange={handleChange} name="level" className="text-blue-500 focus:ring-0" />
                            <label htmlFor="Advanced" className="ml-2 text-sm text-gray-300">Advanced</label>
                        </div>
                        {levelError && <span className="text-md text-red-800 mt-1 mb-5">{levelError}</span>}
                    </div>
                    <div>
                        <label htmlFor="demo">Add Demo Video</label><br/>
                        <input type='file' name="demo" onChange={handleChange} />
                        {demoError && <span className="text-md text-red-800 mt-1 mb-5">{demoError}</span>}

                    </div>

                    <div>
                        <label htmlFor="thumbnail">Add thumbnail</label><br/>
                        <input type='file' name="thumbnail" onChange={handleChange} />
                        {thumbError && <span className="text-md text-red-800 mt-1 mb-5">{thumbError}</span>}
                    </div>

                    <div>
                        <p className="text-lg text-gray-400">Benefits</p>
                    </div>

                    <div>
                        <label htmlFor="benefit1" className="block text-sm font-medium text-gray-300">Benefit 1</label>
                        <input type="text" id="benefit1" name="benefit1"  value={formData.benefit1} onChange={handleChange} placeholder="Enter benefit 1" className="w-full mt-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="benefit2" className="block text-sm font-medium text-gray-300">Benefit 2</label>
                        <input type="text" id="benefit2" name="benefit2" value={formData.benefit2} onChange={handleChange} placeholder="Enter benefit 2" className="w-full mt-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="benefit3" className="block text-sm font-medium text-gray-300">Benefit 3</label>
                        <input type="text" id="benefit3" name="benefit3"  value={formData.benefit3} onChange={handleChange} placeholder="Enter benefit 3" className="w-full mt-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <p className="text-lg text-gray-400">Offer section</p>
                    </div>
                    <div>
                        <label>Original Price</label><br/>
                        <input type="number" name="original_price" value={formData.original_price} onChange={handleChange}  placeholder='Enter the Original Price' className="w-full mt-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {opriceError && <span className="text-md text-red-800 mt-1 mb-5">{opriceError}</span>}

                    </div>
                    <div>
                        <label>Offer Price</label><br/>
                        <input type="number" name="offer_price" value={formData.offer_price} onChange={handleChange} placeholder='Enter the Offer price' className="w-full mt-1 p-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {ofpriceError && <span className="text-md text-red-800 mt-1 mb-5">{ofpriceError}</span>}
                    </div>
                    <div>
                        <input type="submit" value="Save and Next" className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer" />
                    </div>

                </form>
            </div>
        </div>
    </div>

  )
}

export default Addcourse
