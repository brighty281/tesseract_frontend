import React, { useEffect, useState } from 'react'
import axios from 'axios'

function AdminOrders() {
    // const baseURl="http://127.0.0.1:8000"
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const [orders,setOrders]=useState([])

    const fetchOrders=async()=>{
        try{
            const response=await axios.get(baseURL+'/adminapp/all_orders/',{
                headers:{
                    'Authorization': `Bearer ${token}`,

                }
            })
            if(response.data){
                console.log("fetched the orders....",response.data)
                setOrders(response.data)
            }
            
        }catch(error){
            console.log('error in fetching orders',error)
        }
    }

    useEffect(()=>{
        fetchOrders();
    },[])
  return (
    <div>
      
      <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h1>
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Date Bought
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 && <tr><td className='m-5'>No Order Found</td></tr>}
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center">
                              <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">{order.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{order.course_name}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{order.author}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{order.price}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{order.date_purchased}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
    </div>
  )
}

export default AdminOrders
