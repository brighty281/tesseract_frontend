import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
function Mycourses() {

    // const baseUrl = 'http://127.0.0.1:8000';
    const baseURL = process.env.REACT_APP_BASE_URL;
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('access');

    useEffect(() => {
        const fetchPurchasedCourses = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/students/enrolled_courses/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const filterCourse = response.data
                console.log(filterCourse);
                setCourses(filterCourse);
                setTimeout(() => {
                    setIsLoading(false);
                  }, 3000);
            } catch (error) {
                console.error('Error fetching purchased courses:', error);
                setTimeout(() => {
                    setIsLoading(false);
                  }, 3000);
            }
        };

        fetchPurchasedCourses();
    }, [token]);
  return (
    <div className="bg-black text-yellow-500 px-10 min-h-screen">
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
        <div className="col-span-4 sm:col-span-12">
          <div className="bg-gray-900 shadow rounded-lg p-6">
            <div className="bg-gray-900 rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className='flex justify-between'>
                <h3 className="text-4xl font-bold m-2 text-yellow-500">My Courses</h3>
              </div>
              <div className="grid gap-2 gap-y-2 text-sm grid-cols-1 lg:grid-cols-1">
                {/* Display loader when isLoading is true */}
                {isLoading && Array.from({ length: 2 }).map((_, index) => (
                  <div key={index}>
                    <div className="relative my-10 block p-8 overflow-hidden border bg-gray-800 border-gray-700 rounded-lg ml-6 mr-6">
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-400 rounded"></div>
                            <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                          </div>
                        </div>
                        <div className="rounded-full bg-gray-400 h-12 w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Render courses once loaded */}
                {!isLoading && courses.length === 0 && <tr><td>No Courses Purchased</td></tr>}
                {!isLoading && courses.map((purchase) => (
                  <div key={purchase.course.id}>
                    <Link to={`/course_view/${purchase.course.id}`}>
                      {/* Render course details */}
                      <span className="relative my-10 block p-8 overflow-hidden border bg-gray-800 border-gray-700 rounded-lg ml-6 mr-6">
                        <div className="justify-between sm:flex">
                          <div>
                            <h5 className="text-2xl font-bold text-yellow-500">
                              {purchase.course.course_name}
                            </h5>
                            <p className="mt-1 text-xl font-medium text-yellow-400">By  {purchase.course.user} </p>
                          </div>
                          <div className="flex-shrink-0 hidden ml-3 sm:block">
                            <img
                              className="object-cover w-100 h-16 rounded-lg shadow-sm"
                              src={purchase.course.thumbnail}
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="mt-4 sm:pr-8">
                          <p className="text-md text-yellow-300">
                            {purchase.course.description}
                          </p>
                        </div>
                        <dl className="flex justify-between mt-6">
                          <div className="flex">
                            <div className="flex flex-col-reverse">
                              <dt className="text-sm font-medium text-yellow-400">Published</dt>
                              <dd className="text-xs text-yellow-300"> {purchase.date_purchased}</dd>
                            </div>
                            <div className="flex flex-col-reverse ml-3 sm:ml-6">
                              <dt className="text-sm font-large text-yellow-400">Level</dt>
                              <dd className="text-xs text-yellow-300">{purchase.course.level}</dd>
                            </div>
                            <div className="flex flex-col-reverse ml-3 sm:ml-6 mx-20">
                              <dd className="text-md text-yellow-400"><strike>Rs {purchase.course.original_price}</strike></dd>
                              <dd className="text-xl text-yellow-500">Rs {purchase.course.offer_price}</dd>
                            </div>
                          </div>
                        </dl>
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Mycourses
