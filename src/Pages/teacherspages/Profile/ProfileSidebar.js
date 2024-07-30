import React from 'react'
import { useSelector } from 'react-redux';
import userimg from '../../../images/user.png';
import { Link } from 'react-router-dom';

function ProfileSidebar() {
    const profileDetails = useSelector((state) => state.profile_details);
    // teacher sidebar
    
  return (

      <div className="col-span-4 sm:col-span-3">
      <div className="bg-blue-700 shadow rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            src={profileDetails && profileDetails.profile_pic ? profileDetails.profile_pic : userimg}
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
            alt="Profile"
          />
          <h1 className="text-xl font-bold text-white ">{profileDetails.username}</h1>
          <p className="text-white">{    profileDetails.email}</p>
        </div>

        <hr className="my-6 border-t border-gray-300" />
        <Link to="/teacher/profile">
          <div className="flex flex-col items-center mb-4">
            <span className="text-white text-lg font-bold tracking-wider mb-2">Dashboard</span>
          </div>
        </Link>

        <hr className="my-6 border-t border-gray-300" />
          <div className="flex flex-col items-center mb-4">
            <span className="text-white text-lg font-bold tracking-wider mb-2">Enrolled Courses</span>
          </div>
       

        <hr className="my-6 border-t border-gray-300" />
        <Link to="/teacher/editprofile">
          <div className="flex flex-col items-center mb-4">
            <span className="text-white text-lg font-bold tracking-wider mb-2">Edit Profile</span>
          </div>
        </Link>
      </div>
    </div>

  )
}

export default ProfileSidebar
