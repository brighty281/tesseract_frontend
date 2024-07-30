import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function TeacherDocuments() {
    // const baseURL = 'http://127.0.0.1:8000/';
    const baseURL = process.env.REACT_APP_BASE_URL;
    const navigate=useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
    
        const id_proof = event.target.id_proof.files[0];
        formData.append('id_proof', id_proof);
    
        const photo_proof = event.target.photo_proof.files[0];
        formData.append('photo_proof', photo_proof);
    
        const tenth_proof = event.target.tenth_proof.files[0];
        formData.append('tenth_proof', tenth_proof);
    
        const plustwo_proof = event.target.plustwo_proof.files[0];
        formData.append('plustwo_proof', plustwo_proof);
    
        const graduation_proof = event.target.graduation_proof.files[0];
        formData.append('graduation_proof', graduation_proof);
    
        const experience_proof = event.target.experience_proof.files[0];
        formData.append('experience_proof', experience_proof);
    
        const user_id = localStorage.getItem('user_id');
        formData.append('user', user_id);
        
        try {
            const res = await axios.post(baseURL+'/api/users/teacher/teacher_documents', formData);
            if (res.status === 200) {
                console.log('document received backend successfully');
                navigate('/teacher/login')
            }
        } catch (error) {
            console.log(error);
            console.log("hello this is error")
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl mb-6">Personal Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          
            <div className="md:col-span-6 mb-3 ">
                <label htmlFor="soda" className='mr-10 mt-2'>Id Proof (voter id or driving license adhar)</label>
                <div className="h-10 w-150 bg-gray-700 flex border border-gray-600   rounded items-center mt-1">
                    <input type='file' name="id_proof" className="px-2 text-center appearance-none outline-none text-gray-400 w-full bg-transparent"  />
                </div>
            </div>

            <div className="md:col-span-6 mb-3 ">
                <label htmlFor="soda" className='mr-10 mt-2'>Photo (passport size photo of user)</label>
                <div className="h-10 w-150 bg-gray-700 flex border border-gray-600   rounded items-center mt-1">
                    <input type='file' name="photo_proof" className="px-2 text-center appearance-none outline-none text-gray-400 w-full bg-transparent"  />
                </div>
            </div>

            <div className="md:col-span-6 mb-3 ">
                <label htmlFor="soda" className='mr-10 mt-2'>10 th Certificate</label>
                <div className="h-10 w-150 bg-gray-700 flex border border-gray-600   rounded items-center mt-1">
                    <input type='file' name="tenth_proof" className="px-2 text-center appearance-none outline-none text-gray-400 w-full bg-transparent"  />
                </div>
            </div>

            <div className="md:col-span-6 mb-3 ">
                <label htmlFor="soda" className='mr-10 mt-2'>12 th Certificate </label>
                <div className="h-10 w-150 bg-gray-700 flex border border-gray-600   rounded items-center mt-1">
                    <input type='file' name="plustwo_proof" className="px-2 text-center appearance-none outline-none text-gray-400 w-full bg-transparent"  />
                </div>
            </div>
            
            <div className="md:col-span-6 mb-3 ">
                <label htmlFor="soda" className='mr-10 mt-2'>Graduation Certificate </label>
                <div className="h-10 w-150 bg-gray-700 flex border border-gray-600   rounded items-center mt-1">
                    <input type='file' name="graduation_proof" className="px-2 text-center appearance-none outline-none text-gray-400 w-full bg-transparent"  />
                </div>
            </div>

            <div className="md:col-span-6 mb-3 ">
                <label htmlFor="soda" className='mr-10 mt-2'>Experience Certificate </label>
                <div className="h-10 w-150 bg-gray-700 flex border border-gray-600   rounded items-center mt-1">
                    <input type='file' name="experience_proof" className="px-2 text-center appearance-none outline-none text-gray-400 w-full bg-transparent"  />
                </div>
            </div>

          <div>
            <input type="submit" value="Finish" className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer" />
          </div>
        </form>
        {/* {loginError && <span className="text-red-800 text-sm">{loginError}</span>} */}
      </div>
    </div>
  )
}

export default TeacherDocuments
