import React,{useEffect} from 'react'
import {Routes,Route} from'react-router-dom'
import AdminLogin from '../../Pages/adminpages/AdminLogin'
import AdminDashboard from '../../Pages/adminpages/AdminDashboard'
import Adminheader from './Adminheader'
import { useDispatch, useSelector } from 'react-redux'
import { set_Authentication } from '../../Redux/authentication/AuthenticationSlice'
import isAuthAdmin from '../../utlis/isAuthAdmin'
import AdminStudentlist from '../../Pages/adminpages/AdminStudentlist'
import AdminTeacherslist from '../../Pages/adminpages/AdminTeacherslist'
import AdminTeacherRequests from '../../Pages/adminpages/AdminTeacherRequests'
import AdminPrivateRoutes from '../PrivateRoutes/AdminPrivateRoutes';
import AdminTeacherVerify from '../../Pages/adminpages/AdminTeacherVerify'
import AdminOrders from '../../Pages/adminpages/AdminOrders'
import AdminCourses from '../../Pages/adminpages/AdminCourses'
import SalesReportToday from '../../Pages/adminpages/salesreport/SalesReportToday'
import SalesReportMonth from '../../Pages/adminpages/salesreport/SalesReportMonth'
import SalesReportWeekly from '../../Pages/adminpages/salesreport/SalesReportWeekly'
import SalesReportYear from '../../Pages/adminpages/salesreport/SalesReportYear'
function Adminwrapper() {
  const dispatch=useDispatch()
  const authentication_user=useSelector(state=>state.authentication_user)


  const checkAuthAndFetchUserData = async () => {

      const isAuthenticated = await isAuthAdmin();
      
      dispatch(
        set_Authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
        })
      );


    }

  useEffect(() => {
    if (!authentication_user.name) {
      checkAuthAndFetchUserData();
    }

  },[]);

  

  return (
    <div>
        <Adminheader/>
        <Routes>
            <Route path="/" element={<AdminLogin/>}/>

            <Route path="/dashboard" element={<AdminPrivateRoutes><AdminDashboard/></AdminPrivateRoutes>}/>
            <Route path="/studentslist" element={<AdminPrivateRoutes><AdminStudentlist/></AdminPrivateRoutes>}/>
            <Route path="/teacherslist" element={<AdminPrivateRoutes><AdminTeacherslist/></AdminPrivateRoutes>}/>
            <Route path="/teachers_requests" element={<AdminPrivateRoutes><AdminTeacherRequests/></AdminPrivateRoutes>}/>

            <Route path="/verify_document/:id" element={<AdminPrivateRoutes><AdminTeacherVerify/></AdminPrivateRoutes>}/>
            <Route path="/orders" element={<AdminPrivateRoutes><AdminOrders/></AdminPrivateRoutes>} />

            <Route path="/all_courses" element={<AdminPrivateRoutes><AdminCourses/></AdminPrivateRoutes>}/>

            <Route path="/salesreport_today" element={<AdminPrivateRoutes><SalesReportToday/></AdminPrivateRoutes>} />
            <Route path="/salesreport_monthly" element={<AdminPrivateRoutes><SalesReportMonth/></AdminPrivateRoutes>} />
            <Route path="salesreport_weekly" element={<AdminPrivateRoutes><SalesReportWeekly/></AdminPrivateRoutes>} />
            <Route path="/salesreport_yearly" element={<AdminPrivateRoutes><SalesReportYear/></AdminPrivateRoutes>} />
            
        </Routes>
      
    </div>
  )
}

export default Adminwrapper
