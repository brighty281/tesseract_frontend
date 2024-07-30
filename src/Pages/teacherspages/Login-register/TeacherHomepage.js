import React from 'react';
import { useSelector } from 'react-redux';

function TeacherHomepage() {
  const authentication_user = useSelector((state) => state.authentication_user);
  console.log(authentication_user.name);

  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      <div className="max-w-3xl w-full p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-blue-500">Welcome {authentication_user.name} to tesseract-teacher</h1>
      
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Exclusive Features for Teachers</h2>
          <p className="mb-4">
            <span className="text-blue-300 font-bold">Manage Your Courses:</span> Easily create, update, and manage your courses with our intuitive course management system.
          </p>
          <p className="mb-4">
            <span className="text-blue-300 font-bold">Connect with Students:</span> Engage with your students through our integrated messaging system and provide them with the support they need.
          </p>
          <p className="mb-4">
            <span className="text-blue-300 font-bold">Track Progress:</span> Monitor student progress and performance with our comprehensive analytics and reporting tools.
          </p>
          <p className="mb-4">
            <span className="text-blue-300 font-bold">Enhance Your Skills:</span> Access a wide range of professional development resources to help you stay ahead in your teaching career.
          </p>
        </div>
        
      </div>
    </div>
  );
}

export default TeacherHomepage;



