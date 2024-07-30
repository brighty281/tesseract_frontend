import React,{useEffect, useState} from 'react'
import axios from 'axios'
function AdminCourses() {
    // const baseURL="http://127.0.0.1:8000"
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const [courses,setCourses]=useState([])

    const blockcourse=(id)=>{
        const confirmblock=window.confirm('Are you sure you want to block this course?');
        if(confirmblock){
          axios.patch(`${baseURL}/adminapp/course_status/${id}/`, { is_blocked: true }
            , {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
            .then((response) => {
                console.log('User blocked successfully', response);
                fetchCourses();

            })
            .catch((error) => {
                console.error('Error blocking course:', error);
            });
        }

    }
    
    const unblockcourse=(id)=>{
      const confirmunblock=window.confirm('Are you sure you want to block this course?');
      if(confirmunblock){
        axios.patch(`${baseURL}/adminapp/course_status/${id}/`, { is_blocked: false }
          , {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
          .then((response) => {
              console.log('User unblocked successfully', response);
              fetchCourses();

          })
          .catch((error) => {
              console.error('Error blocking course:', error);
          });
      }
    }
    const fetchCourses=async()=>{
        try{
        const response=await axios.get( baseURL+'/adminapp/all_courses/',{
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        })
        if(response.data){
            console.log('courses list is....',response.data)
            const sortedCourses = response.data.sort((a, b) => a.id - b.id);
            setCourses(sortedCourses)
        }

        }catch(error){
            console.log('error in...',error)
        }
        
    }
   

    useEffect(()=>{
        fetchCourses()
    },[])
  return (
    <div>
      
      <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Curses</h1>
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Course
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Author
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           created at
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           Offer Price
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                           original Price
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.length === 0 && <tr><td className='m-5'>No Order Found</td></tr>}
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">{course.course_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{course.user}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{course.date_added}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{course.offer_price}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{course.original_price}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            {course.is_blocked ?(
                            <button onClick={()=>unblockcourse(course.id)}   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    Unblock
                            </button>
                            ):(
                                <button onClick={()=>blockcourse(course.id)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Block
                                </button>
                            )
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
    </div>
  )
}

export default AdminCourses
