import React from 'react';
import { useNavigate } from 'react-router-dom';

function Mylandingpage() {
  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col items-center justify-center font-inter">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-2xl font-medium mb-8">Your journey to knowledge and excellence starts here.</p>
        <button onClick={()=>navigate('/signup')} className="bg-yellow-500 text-black py-2 px-6 rounded-md text-xl font-semibold hover:bg-yellow-600">
          Get Started
        </button>
      </div>
      <div className="mt-16 text-center p-8">
        <h2 className="text-4xl font-bold mb-4">Features</h2>
        <p className="text-xl mb-4">✓ Learn from top educators</p>
        <p className="text-xl mb-4">✓ Access a wide range of courses</p>
        <p className="text-xl mb-4">✓ Track your progress</p>
        <p className="text-xl mb-4">✓ Connect with peers</p>
      </div>
    </div>
  );
}

export default Mylandingpage;

