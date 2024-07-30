import React from 'react'
import { Link } from 'react-router-dom'

function Adminsidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
    <nav className="mt-10">
      <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
        Dashboard
      </Link>
      <Link to="/studentlist" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
        Student List
      </Link>
      <Link to="/teacherslist" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
        Teachers List
      </Link>
      <Link to="/orders" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
        Orders
      </Link>
    </nav>
  </div>
  )
}

export default Adminsidebar
