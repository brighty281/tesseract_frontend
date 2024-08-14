import React,{useEffect,useRef,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userimg from '../../../images/user.png';
import { set_profile_details } from '../../../Redux/authentication/ProfileSlice';
import { set_Authentication } from '../../../Redux/authentication/AuthenticationSlice';
function TEditprofile() {
  // const baseUrl = 'http://127.0.0.1:8000/';
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('access');
    const dispatch=useDispatch()
    const authentication_user = useSelector(state => state.authentication_user);
    const profileDetails = useSelector(state => state.profile_details);
    const navigate = useNavigate();

    const imagePreviewRef = useRef(null);

    const [formData, setFormData] = useState({
        username: '',
        email:'',
        phone: '',
        linkedinurl: '',
        fburl: '',
        about: '',
        profilePic: null,
    });

    const fileInputRef = useRef(null);


    const fetchUserData=async()=>{
        try{
            const res=await axios.get(baseURL+ '/api/students/user_details/',{
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const userData = res.data; 
            let profilePic = null;
            if (userData.user_profile.profile_pic instanceof File) {
                profilePic = userData.user_profile.profile_pic;
            } else {
                profilePic = userData.user_profile.profile_pic ? baseURL + userData.user_profile.profile_pic : null;
            }

            setFormData({
                username: userData.user.username,
                email:userData.user.email,
                phone: userData.user_profile.phone,
                linkedinurl: userData.user_profile.social_link1,
                fburl: userData.user_profile.social_link2,
                about: userData.user_profile.about,
                profilePic: profilePic,
            });
        }catch (error) {
            console.log('Error fetching user data:', error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = () => {
        const file = fileInputRef.current.files[0];
        setFormData({ ...formData, profilePic: file });
    
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviewRef.current.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Create FormData object
        const form_data = new FormData();
    
        // Add non-empty fields to FormData
        if (formData.username && formData.username.trim()) {
            form_data.append('username', formData.username.trim());
        }
        if (formData.phone && formData.phone.trim()) {
            form_data.append('phone', formData.phone.trim());
        }
        if (formData.linkedinurl && formData.linkedinurl.trim()) {
            form_data.append('social_link1', formData.linkedinurl.trim());
        }
        if (formData.fburl && formData.fburl.trim()) {
            form_data.append('social_link2', formData.fburl.trim());
        }
        if (formData.about && formData.about.trim()) {
            form_data.append('about', formData.about.trim());
        }
        
        // Add profile picture if it exists
        if (formData.profilePic instanceof File) {
            form_data.append('profile_pic', formData.profilePic);
        }
    
        try {
            const res = await axios.post(baseURL + '/api/students/user_details_update/', form_data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'authorization': `Bearer ${token}`,
                },
            });
            if (res.status === 200) {
                toast.success('Profile saved successfully!')
                dispatch(
                    set_Authentication({
                        name: formData.username,
                        isAuthenticated: true,
                        isAdmin: false,
                        isTeacher: false
                    })
                );
                dispatch(set_profile_details({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    linkedinurl: formData.linkedinurl,
                    fburl: formData.fburl,
                    about: formData.about,
                    profile_pic: formData.profilePic instanceof File ? URL.createObjectURL(formData.profilePic) : formData.profilePic
                }));
                navigate('/teacher/profile'); // Navigate to profile page after successful save
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };
    






    useEffect(() => {
        fetchUserData();
    }, []);


  return (
    <>
    <div className="bg-black text-white px-10">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <ProfileSidebar />
          <div className="col-span-4 sm:col-span-9">
            <form onSubmit={handleSubmit}>
              <div className="bg-blue-700 shadow rounded-lg p-6 flex">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-first-name">
                    Username
                  </label>
                  <input type="text" placeholder="Username"
                    name='username'
                    value={formData.username ? formData.username : authentication_user.name}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-black text-whiteborder border-white rounded py-3 px-4 mb-3" id="grid-first-name" />
                </div>
                <div className="md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Mobile No.
                  </label>
                  <input type="number" placeholder="+91 "
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-black text-white border border-white rounded py-3 px-4" id="grid-last-name" />
                </div>
              </div>
  
              <div className="bg-blue-700 shadow rounded-lg p-6 flex">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-first-name">
                    LinkedIn Link
                  </label>
                  <input type="text" name='linkedinurl' placeholder="Paste your Linkedin url here "
                    value={formData.linkedinurl}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-black text-white border border-white rounded py-3 px-4 mb-3" id="grid-first-name" />
                </div>
                <div className="md:w-1/2 px-3">
                  <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-last-name">
                    FaceBook
                  </label>
                  <input type="text" name='fburl' placeholder="Paste your facebook url here "
                    value={formData.fburl}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-black text-white border border-white rounded py-3 px-4" id="grid-last-name" />
                </div>
              </div>
  
              <div className="bg-blue-700 shadow rounded-lg p-6 flex">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="grid-first-name">
                    About You
                  </label>
                  <textarea type="text" name='about' placeholder="Add About you"
                    value={formData.about}
                    onChange={handleChange}
                    className="appearance-none block w-full bg-black text-white border border-white rounded py-3 px-4 mb-3" id="grid-first-name" />
                </div>
              </div>
  
              <div className="bg-blue-700 shadow rounded-lg p-6 mt-3 mb-4">
                <div className="mx-10 rounded-lg">
                  <img
                    ref={imagePreviewRef}
                    src={
                      formData.profilePic instanceof File
                        ? URL.createObjectURL(formData.profilePic)
                        : formData.profilePic
                          ? formData.profilePic
                          : userimg
                    }
                    className="rounded-full img-fluid"
                    style={{ width: '200px' }}
                    alt='img'
                  />
                </div>
                <div className="flex justify-between">
                  <label htmlFor="fileInput" className="mt-5 mx-20 text-white text-md font-bold cursor-pointer">
                    Edit Your Profile
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <div>
                    <button type='submit' className='bg-black hover:bg-yellow-600 text-white py-2 px-4 rounded'>Save Changes</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default TEditprofile
