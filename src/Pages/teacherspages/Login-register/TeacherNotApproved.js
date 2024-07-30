import React from 'react'

function TeacherNotApproved() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-blue-600 text-white p-12 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105" style={{ width: '600px', height: '200px' }}>
        <h3 className="text-2xl font-bold mb-4 text-center">
          Kindly wait for the approval
        </h3>
        <h3 className="text-center">Team Tesseract will inform you.</h3>
      </div>
    </div>
  )
}

export default TeacherNotApproved
