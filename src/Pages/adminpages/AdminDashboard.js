import React from 'react';
import AdminHomeCards from './dashboardcomponents/AdminHomeCards';
import AdminChartOrder from './dashboardcomponents/AdminChartOrder';

function AdminDashboard() {
  return (
    <div>
      <div class="w-full items-center justify-center bg-gray-200 min-h-screen transition-all main">
          <div  className='p-6'>
            <AdminHomeCards/> 
            <AdminChartOrder/>
          </div>
        </div>
    </div>
  );
}

export default AdminDashboard;
