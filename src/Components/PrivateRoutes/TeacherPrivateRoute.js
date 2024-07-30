import React,{useEffect,useState} from 'react'
import { Navigate } from 'react-router-dom';
import isAuthTeacher from '../../utlis/isAuthTeacher';
function TeacherPrivateRoute({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState({
        is_authenticated: false,
        userid:null,
        is_admin: false,
        is_teacher:false
      });
    
      const [isLoading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchData = async () => {
          const authInfo = await isAuthTeacher();
          console.log(authInfo);
          setIsAuthenticated({
            'is_authenticated' : authInfo.isAuthenticated,
            'is_admin' : authInfo.isAdmin,
            'is_teacher' : authInfo.isTeacher,
            'userid':authInfo.userid
          });
          setLoading(false);
        };
        fetchData();
      }, []);
    
      console.log('iii',isAuthenticated.is_teacher);
    
      if (isLoading) {
        return <div>Loading...</div>;
      }
      
      if (!isAuthenticated.is_teacher){
        return <Navigate to="/teacher/login" />;
      }
      
    
      if (!isAuthenticated.is_authenticated) {
        return <Navigate to="/teacher/login" />;
      }
    
      
      if ((isAuthenticated.is_admin || !isAuthenticated.is_teacher)) {
        return <Navigate to="/teacher/login" />;
      }
    
      console.log('lllllll',isAuthenticated.is_teacher);
    
      return children;
}

export default TeacherPrivateRoute
