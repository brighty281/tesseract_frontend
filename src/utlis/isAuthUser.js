import axios from "axios";
import {jwtDecode} from 'jwt-decode'

// const baseURL = 'http://127.0.0.1:8000';
const baseURL = process.env.REACT_APP_BASE_URL;
const userid = localStorage.getItem('userid');

const updateToken = async () => {
    const refreshToken = localStorage.getItem('refresh');

    try {
        const res = await axios.post(baseURL + '/api/users/token/refresh/', {
            'refresh': refreshToken
        });

        if (res.status === 200) {
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            return true;
            // let decoded = jwtDecode(res.data.access_token);
            // return {name: decoded.username, isAuthenticated: true,isTeacher:false, isAdmin:false};
        } else {
            return false
        }
    } catch (error) {
        return false
    }
};

const fetchisAdmin = async () => {
    const token = localStorage.getItem('access');
   
    
    try {
        const res = await axios.get(baseURL + '/api/users/userdetails/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
  
         console.log('issuperuser-isauthadmin',res.data.is_superuser);
        return res.data.is_superuser;
  
    } catch (error) {
        return false;
    }
  };

  const fetchisTeacher = async () => {
    const token = localStorage.getItem('access');
   
    
    try {
        const res = await axios.get(baseURL + '/api/users/userdetails/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
  
        //  console.log('issuperuser-isauthadmin',res.data.is_superuser);
        return res.data.is_staff;
  
    } catch (error) {
        return false;
    }
  };
  

const isAuthUser = async () => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
        return { name: null, isAuthenticated: false, isAdmin: false };
    }

    const currentTime = Date.now() / 1000;

    let decoded = jwtDecode(accessToken);


    if (decoded.exp > currentTime) {
            const [checkAdmin, checkTeacher] = await Promise.all([fetchisAdmin(), fetchisTeacher()]);
            return { userid:userid, name: decoded.username, isAuthenticated: true, isAdmin: checkAdmin, isTeacher: checkTeacher };
       
    } else {
        const updateSuccess = await updateToken();

        if (updateSuccess) {
            let decoded = jwtDecode(accessToken);

            const [checkAdmin, checkTeacher] = await Promise.all([fetchisAdmin(), fetchisTeacher()]);
            return { userid:userid,name: decoded.username, isAuthenticated: true, isAdmin: checkAdmin, isTeacher: checkTeacher };

  
        } else {
            return { name: null, isAuthenticated: false,isAdmin:false };
        }
    }
};

export default isAuthUser ;