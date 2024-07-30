import React,{useState,useEffect} from 'react'
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios';
function MyCourses() {
   const navigate=useNavigate()
  //  const baseURL="http://127.0.0.1:8000";
    const baseURL = process.env.REACT_APP_BASE_URL;
   const [courses, setCourses] = useState([]);
   const token=localStorage.getItem('access')

   const fetchCourses=()=>{
    axios.get(baseURL+"/teacherapp/my_courses/",{
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }).then((response)=>{
      if (response.data && Array.isArray(response.data)) {        
        console.log(response.data);
        setCourses(response.data);
      } else {
        console.error("Error fetching course: Data is not an array or undefined", response);
      }
    })
    .catch((error) => {
      console.error("Error fetching courses:", error);
    });
   }

   const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

   useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-2xl font-bold">All Courses</h3>
      <button
        onClick={() => navigate('/teacher/add_course')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg">
        <thead>
          <tr>
            <th className="py-3 px-4 text-left">Course Name</th>
            <th className="py-3 px-4 text-left">Thumbnail</th>
            <th className="py-3 px-4 text-left">Date Added</th>
            <th className="py-3 px-4 text-left">Original Price</th>
            <th className="py-3 px-4 text-left">Offer Price</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 && (
            <tr>
              <td colSpan="7" className="py-4 text-center">No courses available</td>
            </tr>
          )}
          {courses.map((course) => (
            <tr key={course.id} className="border-t border-gray-700">
              <td className="py-3 px-4">
                 {capitalizeFirstLetter(course.course_name)}
                
              </td>
              <td className="py-3 px-4">
                <img
                  src={course.thumbnail}
                  alt={course.course_name}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
              <td className="py-3 px-4">{course.date_added}</td>
              <td className="py-3 px-4">Rs.{course.original_price}</td>
              <td className="py-3 px-4">Rs.{course.offer_price}</td>
              <td className="py-3 px-4">
                {course.is_blocked ? <span>Blocked</span> : <span>active</span>}
                </td>
              <td className="py-3 px-4">
                <Link to={`/teacher/course_view/${course.id}/`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default MyCourses
