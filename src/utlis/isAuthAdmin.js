import { jwtDecode } from "jwt-decode";
import axios from 'axios';

// const baseURL = 'http://127.0.0.1:8000';
const baseURL = process.env.REACT_APP_BASE_URL;
// const userid = localStorage.getItem('userid');

const updateAdminToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  console.log('working');

  try {
      const res = await axios.post(baseURL + '/api/users/token/refresh/', {
          'refresh': refreshToken
      });

      if (res.status === 200) {
          console.log('200');
          console.log(res.data)
          const newAccessToken = res.data.access;
          localStorage.setItem('access', newAccessToken);
          console.log('new===', newAccessToken);
          localStorage.setItem('refresh', res.data.refresh);
          return true;
      } else {
          return false;
      }

  } catch (error) {
      console.error('Error updating access token:', error);
      return false;
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


const isAuthAdmin = async () => {
  const accessToken = localStorage.getItem("access");
  console.log('access----',accessToken);

  if (!accessToken) {
      return { name: null, isAuthenticated: false, isAdmin: false };
  }

  const currentTime = Date.now() / 1000;

  let decoded = jwtDecode(accessToken);
  console.log(decoded.exp - currentTime);


  if (decoded.exp > currentTime) {
      let checkAdmin = await fetchisAdmin(); 
      return { name: decoded.username, isAuthenticated: true, isAdmin: checkAdmin };
  } else {
      const updateSuccess = await updateAdminToken();

      if (updateSuccess) {
          let decoded = jwtDecode(accessToken);
          let checkAdmin = await fetchisAdmin(); 
          return { name: decoded.username, isAuthenticated: true, isAdmin: checkAdmin };
      } else {
          return { name: null, isAuthenticated: false, isAdmin: false };
      }
  }
};

export default isAuthAdmin;