import React from 'react';
import { useSelector } from 'react-redux';

function Homepage() {
  const authentication_user = useSelector(state => state.authentication_user);
  console.log(authentication_user.name);
  
  return (
    <div className="min-h-screen bg-black text-yellow-400 flex items-center justify-center font-inter">
      <div className="max-w-2xl w-full p-8 bg-gray-900 rounded-lg shadow-lg text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome, {authentication_user.name}</h1>
        <h3 className="text-2xl font-medium">Empower your learning journey with us!</h3>
        <p className="text-lg mt-4">Explore new courses, track your progress, and connect with educators.</p>
        <div className="mt-8">
          <button className="bg-yellow-500 text-black py-2 px-4 rounded-md font-semibold hover:bg-yellow-600">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;

