import React,{useRef,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function TeacherOTP() {
    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const inputRefs = useRef(Array.from({ length: 4 }, () => React.createRef()));
    // const baseURL='http://127.0.0.1:8000'
    const baseURL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const registeredEmail = localStorage.getItem('registeredEmail')
    console.log(registeredEmail)

    const handleVerification=async(e)=>{
        e.preventDefault()
        const enteredotp=otpValues.join('');
        console.log(enteredotp)
        console.log('Request payload:', { email: registeredEmail, otp: enteredotp });
        try{

            const res=await axios.post(baseURL + '/api/users/otpverify/',{
                email : registeredEmail,
                otp : enteredotp,

            })

            if(res.status === 200){
                console.log("account created successfully ")
                navigate('/teacher/personal_info');
                // localStorage.clear()
                toast.success("account created successfully ")
    
            }else{
                console.log('verification failed')
                
            }
        }catch(error){

            console.error('Error during OTP verification:', error);
        }
        
    }

    const handleInputChange=(index,value)=>{
        const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
  
      if (value !== '' && index < otpValues.length - 1 && inputRefs.current[index + 1]?.current) {
        inputRefs.current[index + 1].current.focus();
      }
    }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
    <div className="flex flex-col items-center justify-center text-center space-y-2 mb-10">
      <div className="font-semibold text-3xl text-yellow-500">
        <p>Email Verification</p>
      </div>
      <div className="flex flex-row text-sm font-medium text-gray-400">
        <p>We have sent a code to your email {registeredEmail}</p>
      </div>
    </div>
  
    <form onSubmit={handleVerification} method="post" className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
          {otpValues.map((value, index) => (
            <div key={index} className="w-16 h-16 border border-solid border-blue-700 rounded-xl">
              <input
                type="text"
                name={`otp${index + 1}`}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-blue-700 text-lg bg-blue-700 text-white focus:bg-blue-700 focus:ring-1 ring-yellow-700"
                ref={inputRefs.current[index]}
              />
            </div>
          ))}
        </div>
  
        {/* <ul className='text-red-500 mx-10'>
            {error['error'] && <li>{error['error']}</li>}
        </ul> */}
  
        <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
          Verify Account
        </button>
  
        {/* <div className="flex flex-col items-center justify-center">
            {timer === 0 ? (
                <span className="text-center text-red-500" onClick={handleResendOTP}>Resend OTP</span>
            ) : (
                <span className="text-center text-blue-500">Time remaining: <span className="text-red-500">{timer}</span> seconds</span>
            )}
        </div> */}
      </div>
    </form>
  </div>
  
  )
}

export default TeacherOTP

