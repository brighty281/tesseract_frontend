import React,{useState} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function F_enterpassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const baseURL = process.env.REACT_APP_BASE_URL;
  const handlePasswordReset = async (event) => {
    event.preventDefault();

   
    const formData = new FormData();
    formData.append('password', event.target.fpassword.value);


    try {
      const response = await axios.post(
        `${baseURL}/api/users/changepassword/${id}/`,
        formData
      );

      if (response.data.success) {
        navigate("/login");
        toast.success(' Password Reset Successfull');
        localStorage.clear()
      } else {
        // Handle unsuccessful password reset
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };
return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black">
  <h2 className="text-3xl font-bold mb-6 text-yellow-500">Please enter the new password</h2>
  <form onSubmit={handlePasswordReset} method="post" className="max-w-lg bg-yellow-500 rounded-xl p-8 shadow-lg">
    <div className="mb-6">
      <div className="flex items-center border-2 py-2 px-3 rounded-2xl bg-yellow-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <input className="pl-2 w-full outline-none border-none bg-yellow-200" type="password" name="fpassword" id="fpassword" placeholder="Enter New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
    </div>

    <div className="mb-6">
      <div className="flex items-center border-2 py-2 px-3 rounded-2xl bg-yellow-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <input className="pl-2 w-full outline-none border-none bg-yellow-200" type="password" name="password" id="spassword" placeholder="Confirm your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
    </div>

    <div className="flex items-center justify-center">
      <button className="w-full py-3 bg-black text-yellow-500 rounded-xl shadow-lg hover:bg-yellow-600 transition duration-300" type="submit">
        Confirm
      </button>
    </div>
  </form>
</div>
)
}

export default F_enterpassword
