import React,{useEffect} from 'react'
import {Routes,Route} from 'react-router-dom';
import TeacherLanding from '../../Pages/teacherspages/Login-register/TeacherLanding';
import TeacherRegistration from '../../Pages/teacherspages/Login-register/TeacherRegistration';
import Teacherlogin from '../../Pages/teacherspages/Login-register/Teacherlogin';
import Teacherheader from './Teacherheader';
import TeacherHomepage from '../../Pages/teacherspages/Login-register/TeacherHomepage';
import { useDispatch,useSelector } from 'react-redux';
import { set_Authentication } from '../../Redux/authentication/AuthenticationSlice';
import isAuthTeacher from '../../utlis/isAuthTeacher';
import TeacherPrivateRoute from '../PrivateRoutes/TeacherPrivateRoute';
import TeacherNotApproved from '../../Pages/teacherspages/Login-register/TeacherNotApproved';
import TeacherOTP from '../../Pages/teacherspages/Login-register/TeacherOTP';
import TeacherFP from '../../Pages/teacherspages/Login-register/TeacherFP';
import TeacherFPotp from '../../Pages/teacherspages/Login-register/TeacherFPotp';
import TeacherFPnew from '../../Pages/teacherspages/Login-register/TeacherFPnew';
import Teacherprofile from '../../Pages/teacherspages/Profile/Teacherprofile';
import TEditprofile from '../../Pages/teacherspages/Profile/TEditprofile';
import TeacherPersonal from '../../Pages/teacherspages/Login-register/TeacherPersonal';
import TeacherDocuments from '../../Pages/teacherspages/Login-register/TeacherDocuments';
import MyCourses from '../../Pages/teacherspages/courses/MyCourses';
import Addcourse from '../../Pages/teacherspages/courses/Addcourse';
import Addvideos from '../../Pages/teacherspages/courses/Addvideos';
import CourseView from '../../Pages/teacherspages/courses/CourseView';
import CourseSales from '../../Pages/teacherspages/courses/CourseSales';
import TeacherChat from '../../Pages/teacherspages/messages/TeacherChat';
import Conversation from '../../Pages/teacherspages/messages/Conversation';
import Community from '../../Pages/teacherspages/messages/Community';
import CommunityChat from '../../Pages/teacherspages/messages/CommunityChat';
import TeacherChart from '../../Pages/teacherspages/Profile/TeacherChart';


function Teacherwrapper() {
  const dispatch = useDispatch();

  const authentication_user = useSelector(state => state.authentication_user)

  const checkAuth = async () => {
    const isAuthenticated = await isAuthTeacher();
    dispatch(
      set_Authentication({
        name: isAuthenticated.name,
        isAuthenticated: isAuthenticated.isAuthenticated,
        isTeacher:isAuthenticated.isTeacher,
        isAdmin:isAuthenticated.isAdmin
      })
    );
  }
  useEffect(() => {
    if(!authentication_user.name)
    {
      checkAuth();  
    }
  }, [])


  return (
    <div>
        <Teacherheader/>
        <Routes>

            {/* login and registration */}
            <Route path="/" element={<TeacherLanding/>} />
            <Route path="/signup" element={<TeacherRegistration/>} />
            <Route path="/login" element={<Teacherlogin/>}/>
            <Route path="/teacherotp" element={<TeacherOTP/>}/>
            <Route path="/personal_info" element={<TeacherPersonal/>}/>
            <Route path="/teacher_documents" element={<TeacherDocuments/>}/>


            {/* forgot password section */}
            <Route path="/fpassword" element={<TeacherFP/>} />
            <Route path="/fpotp" element={<TeacherFPotp/>} />
            <Route path="/newpassword/:id" element={<TeacherFPnew/>} />
            
            
            {/* {logged in view} */}
            <Route path="/home" element={<TeacherPrivateRoute><TeacherHomepage/></TeacherPrivateRoute>} />   
            <Route path="/notapproved" element={<TeacherPrivateRoute><TeacherNotApproved/></TeacherPrivateRoute>}/>
            <Route path="/profile" element={<TeacherPrivateRoute><Teacherprofile/></TeacherPrivateRoute>}/>
            <Route path="/editprofile" element={<TeacherPrivateRoute><TEditprofile/></TeacherPrivateRoute>} />

            {/* order related urls */}
            <Route path="/teacher_order" element={<TeacherPrivateRoute><CourseSales/></TeacherPrivateRoute>} />
            <Route path="/teacher_dashboard" element={<TeacherPrivateRoute><TeacherChart/></TeacherPrivateRoute>} />

            {/* courses view */}
            <Route path="/course_list" element={<TeacherPrivateRoute><MyCourses/></TeacherPrivateRoute>} />
            
            <Route path="/course_view/:id" element={<TeacherPrivateRoute><CourseView/></TeacherPrivateRoute>}/>
            <Route path="/add_course" element={<TeacherPrivateRoute><Addcourse/></TeacherPrivateRoute>}/>
            <Route path="/add_video/:id" element={<TeacherPrivateRoute><Addvideos/></TeacherPrivateRoute>}/>
            <Route path="/teacher_chat" element={<TeacherPrivateRoute><TeacherChat/></TeacherPrivateRoute>} />
            <Route path="/teacher_conversation/:student_id/:course_id" element={<TeacherPrivateRoute><Conversation/></TeacherPrivateRoute>}/>
            <Route path="/teacher_community" element={<TeacherPrivateRoute><Community/></TeacherPrivateRoute>} />
            <Route path="/teacher_community_chat/:id/:code" element={<TeacherPrivateRoute><CommunityChat/></TeacherPrivateRoute>}/>
        </Routes>
      
    </div>
  )
}

export default Teacherwrapper
