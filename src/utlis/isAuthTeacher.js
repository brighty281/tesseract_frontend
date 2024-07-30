import axios from "axios";
import {jwtDecode} from 'jwt-decode'

// const baseURL = 'http://127.0.0.1:8000';
const baseURL = process.env.REACT_APP_BASE_URL;
const userid = localStorage.getItem('userid');

const updateToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    
    console.log('refresh--',refreshToken);
    console.log('updating');


    try {
    
        const res = await axios.post(baseURL+'/api/users/token/refresh/', {
            'refresh': refreshToken
        });

        if (res.status === 200) {
            console.log('200');
            localStorage.setItem('access', res.data.access);
            console.log('new_access',res.data.access);

            localStorage.setItem('refresh', res.data.refresh);
            // let decoded = jwtDecode(res.data.access_token);
            // return {name: decoded.username, isAuthenticated: true,isTeacher:true};
            return true
        } else {
            console.log('fail')
            return false
            
        }
    } catch (error) {
        console.log('fail2')
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




const isAuthTeacher = async () => {
    const accessToken = localStorage.getItem("access");

    console.log('access----',accessToken);

    if (!accessToken) {
        return { name: null, isAuthenticated: false, isTeacher: false };
    }

    const currentTime = Date.now() / 1000;

    let decoded = jwtDecode(accessToken);
    console.log(decoded.exp - currentTime);


    if (decoded.exp > currentTime) {
        let checkAdmin = await fetchisAdmin(); 
        return {  userid:userid,name: decoded.username, isAuthenticated: true,isTeacher:true ,isAdmin:checkAdmin};
    } else {
        const updateSuccess = await updateToken();

        if (updateSuccess) {
            let decoded = jwtDecode(accessToken);
            let checkAdmin = await fetchisAdmin(); 
            return { userid:userid, name: decoded.username,   isAuthenticated: true,isTeacher: true,isAdmin:checkAdmin };
        } else {
            return { name: null, isAuthenticated: false ,isTeacher: false};
        }
    }
};






export default isAuthTeacher ;