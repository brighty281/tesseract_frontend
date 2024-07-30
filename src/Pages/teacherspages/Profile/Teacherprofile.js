import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { set_profile_details } from '../../../Redux/authentication/ProfileSlice';
import ProfileSidebar from './ProfileSidebar';
function Teacherprofile() {
  const profileDetails = useSelector((state) => state.profile_details);
  // const baseUrl = 'http://127.0.0.1:8000/';
  const baseURL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('access');
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    linkedinurl: '',
    fburl: '',
    about: '',
    profilePic: null,
  });

  const fetchUserData = async () => {
    try {
      const res = await axios.get(baseURL + 'api/students/user_details/', {
        headers: {
          authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const userData = res.data;

      let profilePic = null;
        if (userData.user_profile.profile_pic instanceof File) {
            profilePic = userData.user_profile.profile_pic;
        } else {
            profilePic = userData.user_profile.profile_pic ? baseURL + userData.user_profile.profile_pic : null;
        }
      setFormData({
        username: userData.user.username,
        email: userData.user.email,
        phone: userData.user_profile.phone,
        linkedinurl: userData.user_profile.social_link1,
        fburl: userData.user_profile.social_link2,
        about: userData.user_profile.about,
        profilePic: profilePic,
      });

      dispatch(
        set_profile_details({
          username: userData.user.username,
          email: userData.user.email,
          phone: userData.user_profile.phone,
          linkedinurl: userData.user_profile.social_link1,
          fburl: userData.user_profile.social_link2,
          about: userData.user_profile.about,
          profile_pic: profilePic,
        })
      );
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-950 text-white px-10">
  <div className="container mx-auto py-8">
    <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
      <ProfileSidebar />
      <div className="col-span-4 sm:col-span-9">
        <div className="bg-blue-700 shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-white">About Me</h2>
          <p className="text-white mb-5 mx-20">
            {formData.about ? formData.about : 'Not Set Yet'}
          </p>

          <h2 className="text-lg font-bold mb-4  text-white">Phone Number</h2>
          <p className="text-white mx-20 mb-5">
            {formData.phone ? formData.phone : 'Not Set Yet'}
          </p>

          <h3 className="font-semibold text-center mt-3 -mb-2  text-white">Find me on</h3>
          <div className="flex justify-center items-center gap-6 my-6">
            <a
              href={formData.linkedinurl ? `${formData.linkedinurl}` : '#'}
              className="text-gray-400 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="h-6 text-gray-950"
              >
                <path
                  fill="currentColor"
                  d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                ></path>
              </svg>
            </a>
            {/* Add other social media icons here */}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );

}

export default Teacherprofile
