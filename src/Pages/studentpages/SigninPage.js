import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { Axios } from 'axios'
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/authentication/AuthenticationSlice';
import { jwtDecode } from 'jwt-decode';
function SigninPage() {
    const navigate = useNavigate();
    const dispatch=useDispatch();
    // const baseurl='http://127.0.0.1:8000'
    const baseURL = process.env.REACT_APP_BASE_URL;
    const handlesignsubmit=async(e)=>{
        e.preventDefault()
        console.log("form is submitted")
        const formData = new FormData();
        formData.append("username", e.target.username.value);
        formData.append("password", e.target.password.value);
        try{
            const res=await axios.post(`${baseURL}/api/accounts/token/`,formData)
            if(res.status===200){
                console.log(res.data)
                console.log(jwtDecode(res.data.access).username)
                dispatch(
                    set_Authentication({
                        name:jwtDecode(res.data.access).username
                    })
                )
                navigate('/')
                return res
            }
        }
        catch(error){
            console.log(error)
        }


        // if(res.status===200){
        //     navigate('/')
        // }
    }
  return (
    <div>
      <form onSubmit={handlesignsubmit}>
        <input type="text" name="username" placeholder="enter the username"/><br/>
        <input type="password" name="password" placeholder="enter the password"/> <br/>
        <input type="submit"/>
      </form>
    </div>
  )

}

export default SigninPage
