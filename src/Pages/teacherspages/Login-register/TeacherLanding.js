import React from 'react';

function TeacherLanding() {
  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-blue-500">Welcome to the Teacher's Hub</h1>
        <p className="text-xl mb-4">Empowering educators to inspire and engage students</p>
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Join Our Community</h2>
          <p className="mb-4">
            <span className="text-blue-300 font-bold">Collaborate:</span> Connect with fellow educators to share insights, resources, and best practices.
          </p>
          <p className="mb-4">
            <span className="text-blue-300 font-bold">Innovate:</span> Access the latest tools and technologies to enhance your teaching methods and engage students.
          </p>
          <p className="mb-4">
            <span className="text-blue-300 font-bold">Grow:</span> Participate in professional development workshops and training sessions to advance your career.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Register</h2>
            <p>Become a part of our community by creating an account.</p>
            <button className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
              Sign Up
            </button>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Login</h2>
            <p>Already have an account? Log in to access your dashboard.</p>
            <button className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">
              Log In
            </button>
          </div> */}
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Explore Features</h2>
            <p>Discover the tools and resources available to enhance your teaching experience.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Contact Us</h2>
            <p>Have questions? Get in touch with our support team for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherLanding;


