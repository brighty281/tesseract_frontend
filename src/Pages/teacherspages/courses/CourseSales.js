import React, { useState, useEffect } from 'react'
import axios from 'axios';

function CourseSales() {
    // const baseURl="http://127.0.0.1:8000"
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const [orders,setOrders]=useState([])

    const fetchOrders=async()=>{
        try{
            const response=await axios.get(baseURL+"/teacherapp/teacherorders_view/",{
            headers: {
              'Authorization': `Bearer ${token}`,
            }
            });

            if (response.data){
                console.log("response is given by...",response.data)
                setOrders(response.data)
            }else{
                console.log("error in logging data",response.data)
            }
            
            
        }catch(error){
            console.log("error is given by....",error)
        }
    }
    useEffect(()=>{
        fetchOrders()
    },[])
    
  return (
    <div className="bg-black text-white p-4 min-h-screen">
      <h3 className="text-2xl font-bold mb-4">All orders</h3>
      {orders.length===0 && <tr><td>No orders Available</td></tr>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Course Name</th>
              <th className="px-4 py-2 text-left">Date Purchased</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-gray-700">
                <td className="border px-4 py-2">{order.course_name}</td>
                <td className="border px-4 py-2">{order.date_purchased}</td>
                <td className="border px-4 py-2">{order.username}</td>
                <td className="border px-4 py-2">{order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CourseSales
