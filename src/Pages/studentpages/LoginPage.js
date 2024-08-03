import React,{useState,useEffect,useCallback} from 'react'
import axios from 'axios';
import { useNavigate,Link, useLocation } from 'react-router-dom';
import  { jwtDecode } from "jwt-decode";
import { useDispatch,useSelector } from 'react-redux';
import { set_Authentication } from '../../Redux/authentication/AuthenticationSlice';
import { toast } from 'react-toastify';

function LoginPage() {
  const [formError, setFormError] = useState([])
  const [message, setmessage] = useState(null)
  const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_URL } =process.env;
  const location = useLocation();
  // const baseURL='http://127.0.0.1:8000'
  const baseURL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')

  const authentication_user=useSelector(state=>(state.authentication_user))

  console.log('auth admin',authentication_user.isAdmin);
  console.log('auth teacher',authentication_user.isTeacher);
  console.log('name',authentication_user.name);


  useEffect(() => {
    if ((authentication_user.isAuthenticated &&!authentication_user.isAdmin && !authentication_user.isTeacher)) {
      console.log('User is already authenticated. Redirecting...');
      navigate('/home');
    }
  }, [authentication_user.isAuthenticated,authentication_user.isAdmin,authentication_user.Teacher]);

  const handleLoginSubmit =async(event)=>{
    event.preventDefault();
    setEmailError('')
    setPasswordError('')
    setLoginError('')

    const email = event.target.email.value
    const password = event.target.password.value

    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!password.trim()) {
        setPasswordError('Password is required');
        return
    }

    if (password.length > 0 && password.length < 8) {
        setPasswordError('Password must be at least 8 characters');
        return
    }

    const formData = new FormData();
    formData.append("email", event.target.email.value);
    formData.append("password", event.target.password.value);
    try {
        const res = await axios.post(`${baseURL}/api/users/login/`, formData)
        console.log('Response',res)
        if(res.status === 200){
          console.log(res.data);
          console.log(jwtDecode(res.data.access_token).username)
          console.log("user login success")
          toast.success("logged in successfully!");

          localStorage.setItem('access', res.data.access_token);
          localStorage.setItem('refresh', res.data.refresh_token);
          localStorage.setItem('userid', res.data.userid);

          dispatch(
            set_Authentication({
              name:jwtDecode(res.data.access_token).username,
              isAuthenticated:true,
              userid:res.data.userid,
              isAdmin:false,
              isTeacher:false,
            })

          )

          navigate('/home')
        }    
    }




    catch (error) {
        console.log(error);
        if (error.response &&error.response.status===401)
        {  
          toast.error("Invalid credentials")
          setFormError(error.response.data)
        }
        else
        {
          console.log(error);
    
        }
    }

  
  }



  const onGoogleLoginSuccess = ()=>{
    const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const REDIRECT_URI = 'api/users/auth/google/'
    const scope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = {
        response_type: 'code',
        client_id: REACT_APP_GOOGLE_CLIENT_ID,
        redirect_uri: `${REACT_APP_BASE_URL}/${REDIRECT_URI}`,
        prompt: 'select_account',
        access_type: 'offline',
        scope
    };

    const urlParams = new URLSearchParams(params).toString();
    window.location = `${GOOGLE_AUTH_URL}?${urlParams}`;

}
useEffect(() => {
  const query = new URLSearchParams(location.search);
  const message = query.get('message')
  if (message) {
      toast.error('This account is no longer accessible', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          style: { backgroundColor: 'red', color: 'black' },
      })
      setTimeout(() => {
          navigate('/googleauth')
      }, 2000);
  }

}, [location])

useEffect(()=>{
    const query = new URLSearchParams(location.search);
    const access = query.get('access');
    const refresh = query.get('refresh');
    if (access && refresh){
        console.log('access token is given by...',access)
        console.log('access token is given by...',refresh)
        
        const decodeToken = jwtDecode(access);
        console.log('username.....',decodeToken.username)
        console.log('user_id is.....',decodeToken.user_id) 
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh); 
        localStorage.setItem('userid',decodeToken.user_id)
        toast.success("logged in successfully!");
        dispatch(
            set_Authentication({
              name:decodeToken.username,
              isAuthenticated:true,
              userid:decodeToken.user_id,
              isAdmin:false,
              isTeacher:false,
            })

          )

        navigate('/home')

    }
},[location])
  return (
    <div className="min-h-screen flex">
      {/* Left side - Advertising Image */}
      <div className="w-1/2 flex items-center justify-center bg-black">
        <img src="https://www.scnsoft.com/education-industry/elearning-portal/elearning-portals-cover-picture.svg" alt="Advertising" className="max-w-full max-h-full" />
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-black">
        <div className="max-w-md w-full bg-yellow-400 shadow-md rounded-lg p-8">
          
          <form onSubmit={handleLoginSubmit}>
          <h1 className="text-gray-800 font-bold text-2xl mb-1">Hello Again!</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-8">Welcome Back</h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 bg-black text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              {emailError && <span className="text-md text-red-800 mt-1 mb-5">{emailError}</span>}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-black text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 bg-black text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            {passwordError ? (<>
              {passwordError && <span className="text-md text-red-800 " >{passwordError}</span>}
            </>):(<>
              {loginError && <span className="text-md text-red-800 " >{loginError}</span>}
            </>)}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-black hover:bg-gray-700  text-white font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
          </form>
          <Link to="/fpassword"><span>Forgot password</span></Link><br/>
        <span>Don't have an account?</span> <Link to="/signup"><span>| Sign up</span></Link>
        <button 
          onClick={onGoogleLoginSuccess}
        className="bg-white text-gray-800 font-bold py-2 px-4 border rounded-lg shadow  focus:outline-none mt-3" >
           <div className="flex items-center justify-center">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 48 48"
               width="48px"
               height="48px"
             >
               <path
                 fill="#FFC107"
                 d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
               />
               <path
                 fill="#FF3D00"
                 d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
               />
               <path
                 fill="#4CAF50"
                 d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
               />
               <path
                 fill="#1976D2"
                 d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
               />
             </svg>
             Sign in with Google
           </div>
         </button>  
        </div>
        
      </div>
    </div>
  );
}

export default LoginPage
