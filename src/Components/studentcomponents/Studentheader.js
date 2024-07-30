import React from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { set_Authentication } from '../../Redux/authentication/AuthenticationSlice'

function Studentheader() {
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const logout=()=>{
    localStorage.clear()
    dispatch(
      set_Authentication({
        name:null,
        isAuthenticated:null,
        isAdmin:false,
      })
    )
    navigate('/')
  }

  const authentication_user=useSelector(state=> state.authentication_user)
  return (
    <div className='flex items-center font-montserrat text-white bg-black font-medium h-24 max-w-[1240px] mx-auto px-4 justify-between'>
    <div className='flex-1'>
      <h1 className='text-5xl font-bold'>tesseract</h1>
    </div>
    <div className='flex-1 mr-3 flex justify-center'>
    { (authentication_user.isAuthenticated && !authentication_user.isTeacher && !authentication_user.isAdmin) ? (
      <ul className='flex space-x-4'>
        <Link to="/"><li className='p-4'>Home</li></Link>
        <Link to="/all_course" ><li className='p-4 '>Courses</li></Link>
        <Link to="/my_courses"><li className='p-4 whitespace-nowrap'>My Courses</li></Link>
        <Link to="/chat_teacherslist"><li className='p-4'>Chats</li></Link>
        <Link to="/communitylist"><li className='p-4'>Community</li></Link>
      </ul>
      ):(
        <ul className='flex space-x-4'>
        <Link to="/home"><li className='p-4'>Home</li></Link>
        <Link to="/all_course" ><li className='p-4 '>Courses</li></Link>
        {/* <Link to="/my_courses"><li className='p-4 whitespace-nowrap'>My Courses</li></Link>
        <Link to="/chat_teacherslist"><li className='p-4'>Chats</li></Link>
        <Link to="/communitylist"><li className='p-4'>Community</li></Link> */}
      </ul>
      )}
    </div>
    
    <div className='flex-1 flex justify-end space-x-4 items-center'>
        { (authentication_user.isAuthenticated && !authentication_user.isTeacher && !authentication_user.isAdmin) ? (
         
           <>
           <Link to="/profile"><h3 className='self-center'>{authentication_user.name}</h3></Link>
           <button onClick={logout} className='bg-yellow-500 text-black px-4 py-2 rounded'>Logout</button>
         </>
        ) : (
          <>
          <button onClick={() => navigate('/login')} className='bg-blue-500 text-white px-4 py-2 rounded'>Login</button>
          <button onClick={() => navigate('/signup')} className='bg-green-500 text-white px-4 py-2 rounded'>Signup</button>
        </>
        )}
    </div>
  </div>
  )
}

export default Studentheader
