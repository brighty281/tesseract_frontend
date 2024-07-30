import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import userimg from '../../images/user.png' 
function AdminTeacherVerify() {
  const {id}=useParams()
  // const baseURL="http://127.0.0.1:8000"
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [userData,setuserdata]=useState(null)

  const [showModal0, setShowModal0] = useState(false);
  const [show_idmodal,set_idmodal]=useState(false)
  const [show_photomodal,set_photomodal]=useState(false)
  const [show_tenthmodal,set_tenthmodal]=useState(false)
  const [show_twelthmodal,set_twelthmodal]=useState(false)
  const [show_graduationmodal,set_graduationmodal]=useState(false)
  const [show_experienceodal,set_experiencemodal]=useState(false)
  const fetchdata=async()=>{
    try{
       const response=await axios.get(`${baseURL}/adminapp/teachers/teacher_details/${id}/`,{
        headers:{
          'authorization':`Bearer ${localStorage.getItem('access')}`,
          'Accept':'application/json',
          'Content-Type': 'application/json'
        }
       });
       setuserdata(response.data)
       console.log(userData.user.username)
       
    }
    catch(error){
      console.log('this is the error',error)
    }
  }

  const verify_document = (id, fieldName) => {
    console.log('id is...', id);
    console.log('fieldname is.....', fieldName);
    console.log('Token:', localStorage.getItem('access'));
    console.log("verify there thankyou");
  
    const payload = {};
    payload[fieldName] = true;
  
    axios.patch(`${baseURL}/adminapp/teachers/document_verify/${id}/`, payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      console.log(`${fieldName} verified successfully`, response);
      setuserdata(prevUserData => ({
        ...prevUserData,
        teacher_documents: {
          ...prevUserData.teacher_documents,
          [fieldName]: true
        }
      }));
    })
    .catch((error) => {
      console.error(`Error verifying ${fieldName}:`, error);
    });
  }
  
  const acceptUser = (userId) => {
    console.log("user_id is given by...",userId)

    axios.patch(`${baseURL}/adminapp/teachers/accept/${userId}/`, { is_email_verified: true },{
      headers: {
        'authorization': `Bearer ${localStorage.getItem('access')}`,
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
    }
  })
      .then((response) => {
        console.log('teacher accepted successfully', response);
        setShowModal0(false)
        setuserdata(prevUserData => ({
          ...prevUserData,
          user: {
              ...prevUserData.user,
              is_email_verified: true
          }
      }));
      })
      .catch((error) => {
        console.error('Error accepting user:', error);
      });
};


  
  
  useEffect(()=>{
    fetchdata()
  },[])

  if (!userData) {
    return <div>Loading...</div>;
}

  return (
  
      <div className='bg-black text-white min-h-screen transition-all-main'>
        <div className='flex max-w-4xl mx-auto mt-10 p-6 bg-gray-600 shadow-lg rounded-lg'>
          <div className='w-1/3 flex'>
              <img src={userimg} alt='userimg'/>
          </div>
          <div className="w-2/3 pl-8 rounded-lg mt-3">
            <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                <span className='bg-gray-400 rounded-lg w-1/5 flex  p-1'>Name</span>
                <span className='ml-3'>{userData.user.username}</span>
            </div>
            <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                <span className='bg-gray-400 rounded-lg w-1/5 flex  p-1'>Age</span>
                <span className='ml-3'>{userData.teacher_details.age}</span>
            </div>
            <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                <span className='bg-gray-400 rounded-lg w-1/5 flex  p-1'>Email</span>
                <span className='ml-3'>{userData.user.email}</span>
            </div>
            <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                <span className='bg-gray-400 rounded-lg w-1/5 flex  p-1'>Experience</span>
                <span className='ml-3'>{userData.teacher_details.experience}</span>
            </div>
            <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                <span className='bg-gray-400 rounded-lg w-1/5 flex  p-1'>Phone</span>
                <span className='ml-3'>{userData.teacher_details.number}</span>
            </div>
            <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                <span className='bg-gray-400 rounded-lg w-1/5 flex  p-1'>Address</span>
                <span className='ml-3'>{userData.teacher_details.address}</span>
            </div>
            <div>
            
                                <>
                                    {userData.user.is_email_verified ? (
                                        <div className="flex rounded-lg h-9 mt-2 bg-white text-black">
                                        <span className='bg-gray-400 rounded-lg w-1/4 flex  p-1'>Teacher-Status</span>
                                        <span className='text-green-500 ml-5 mt-1 font-bold'> Accepted</span>
                                    </div>
                                        
                                    ) : (
                                    
                                        <button onClick={() => setShowModal0(true)} className="mt-3 bg-green-500 px-4 py-2 text-white rounded-md mt-4 font-semibold">
                                            Accept Teacher
                                        </button>
                                    )}

                        {showModal0 && (
                              <>    
                                <div style={{zIndex:99999}} className="fixed z-9999 inset-0 overflow-y-auto" aria-modal="true" aria-labelledby="modal-headline" >
                                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                    <div className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                            
                                          </div>
                                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                              Accept Teacher
                                            </h3>
                                            <div className="mt-2">
                                              <p className="text-sm text-gray-500">
                                                Are you sure you want to Accept ?
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                          onClick={() => acceptUser(id)}
                                          type="button"
                                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          onClick={() => setShowModal0(false)}
                                          type="button"
                                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                              )}
                                </>
                
                        </div>



          </div>

          
                        

        </div>

        <div className='flex max-w-4xl mx-auto mt-10 p-6 bg-gray-600 shadow-lg rounded-lg'> 
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Document
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                      <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">Id Proof</p>
                      </div>
                      </div>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                        href={`http://localhost:8000${userData.teacher_documents.id_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        View Document
                    </a>
                  </td>

                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">photo Proof</p>
                        </div>
                      </div>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                        href={`http://localhost:8000${userData.teacher_documents.photo_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        View Document
                    </a>
                  </td>

                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">Tenth Proof</p>
                        </div>
                      </div>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                        href={`http://localhost:8000${userData.teacher_documents.tenth_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        View Document
                    </a>
                  </td>
                 
                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">12th Proof</p>
                        </div>
                      </div>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                        href={`http://localhost:8000${userData.teacher_documents.plustwo_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        View Document 
                    </a>
                  </td>
                  
                </tr>

                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">Graduation Proof</p>
                        </div>
                      </div>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                        href={`http://localhost:8000${userData.teacher_documents.graduation_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        View Document 
                    </a>
                  </td>

                 
                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">Experience Proof</p>
                        </div>
                      </div>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a
                        href={`http://localhost:8000${userData.teacher_documents.experience_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        View Document 
                    </a>
                  </td>

                 
                </tr>
              </tbody>


            </table>
          </div>
          
        </div>
      </div>
        
                     
    
  )
}

export default AdminTeacherVerify
