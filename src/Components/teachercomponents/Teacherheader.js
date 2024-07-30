import React from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { set_Authentication } from '../../Redux/authentication/AuthenticationSlice'
function Teacherheader() {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const authentication_user=useSelector(state=> state.authentication_user)

  const logout=()=>{
    localStorage.clear()
    dispatch(
      set_Authentication({
        name:null,
        isAuthenticated:null,
        isAdmin:false,
        isTeacher: false,
      })
    )
    navigate('/teacher')
  }
  
  return (
    <div>
       <div className='flex items-center font-montserrat text-white font-medium h-24 max-w-[1240px] mx-auto px-4 justify-between'>
    <div className='flex-1'>
      <h1 className='text-5xl font-bold'>tesseract</h1>
    </div>
    <div className='flex-1 flex justify-center'>
      <ul className='flex space-x-4'>
      {( authentication_user.isAuthenticated && authentication_user.isTeacher)  &&
      <>
        <Link to="/teacher/teacher_dashboard"><li className='p-4'>Home</li></Link>
        <Link to="/teacher/course_list"><li className='p-4'>Courses</li></Link> 
        <Link to="/teacher/teacher_order" ><li className='p-4'>Orders</li></Link>
        <Link to="/teacher/teacher_chat"><li className='p-4'>Chats</li></Link>
        <Link to="/teacher/teacher_community"><li className='p-4'>Community</li></Link>
      </>
       }
      </ul>
    </div>
    
    <div className='flex-1 flex justify-end space-x-4 items-center'>
        {( authentication_user.isAuthenticated && authentication_user.isTeacher) ? (
          
           <>
            <Link to="/teacher/profile"><h3 className='self-center'>{authentication_user.name}</h3></Link> 
            <button onClick={logout} className='bg-yellow-500 text-black px-4 py-2 rounded'>Logout</button>
           </>
        ) : (
            <>
            <button onClick={()=>navigate('/teacher/login')}  className='bg-blue-500 text-white px-4 py-2 rounded'>Login</button>
            <button onClick={()=>navigate('/teacher/signup')}  className='bg-green-500 text-white px-4 py-2 rounded'>Signup</button>
          </>
        )}
      </div>
  </div>
    </div>
  )
}

export default Teacherheader
