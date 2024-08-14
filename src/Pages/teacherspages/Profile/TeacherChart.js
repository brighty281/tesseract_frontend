import React ,{useEffect,useRef,useState} from 'react'
import Chart from 'chart.js/auto';
import axios from 'axios';
function TeacherChart() {
    // const baseURL='http://127.0.0.1:8000'
    const baseURL = process.env.REACT_APP_BASE_URL;
    const token=localStorage.getItem('access')
    const chartRef = useRef(null);
    const [orderdata, setOrderdata] = useState({orders:[]});
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Orders per Month',
            data: [],
            fill :true,
            borderWidth: 1,
            pointBackgroundColor: 'rgb(16, 185, 129)',
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            tension: .2,
        }]
    });

    useEffect(()=>{
        const ordergraph=async()=>{
            try{
                const response=await axios.get(baseURL+'/teacherapp/teacherdashboard_graphview/',{
                    headers:{
                        'authorization': `Bearer ${token}`,
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                if (response.status === 200) {
                    const data = response.data; 
                    console.log('data', data);
                    const { labels, data: chartData } = constructChartData(data);
                    setChartData({
                        labels,
                        datasets: [{
                            label: 'monthly',
                            data: chartData,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill:true,
                            pointBackgroundColor: 'rgba(255, 255, 255, 0.7)', // White point color
                            pointBorderColor: 'rgba(255, 255, 255, 0.7)', // White point border color
                        }]
                    });
                }

            }catch(error){
                console.log('error in fetching data....',error)
            }
           
        }

        ordergraph()

    },[])

    const getMonthName = (month) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthNames[month - 1]; 
    };


    const constructChartData = (data) => {
        const labels = [];
        const chartData = [];


            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; 

            for (let i = 5; i >= 0; i--) {
                let year = currentYear;
                let month = currentMonth - i;
                if (month <= 0) {
                    year--;
                    month += 12;
                }
                labels.push(`${getMonthName(month)}/${String(year).slice(2)}`); // Add the month/year label to the labels array
                const key = `${year}-${String(month).padStart(2, '0')}`;  // Construct the key in the format 'YYYY-MM'
                const monthData = data.find(item => item.year_month === key); // Find the corresponding month data in the 'data' array
                chartData.push(monthData ? monthData.total_orders : 0); // If month data exists, push its total_orders to chartData, otherwise, push 0
 
        } 
        
        return { labels,  data:chartData };
    };

    useEffect(() => {
        if (chartRef.current && chartData.labels.length > 0) {
            const ctx = chartRef.current.getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: chartData.datasets
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: 'white' // White color for Y-axis labels
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.4)' // Light grid lines for better contrast
                            }
                        },
                        x: {
                            ticks: {
                                color: 'white' // White color for X-axis labels
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.4)' // Light grid lines for better contrast
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white' // White color for legend text
                            }
                        }
                    },
                    layout: {
                        padding: 20 // Optional padding around the chart for better readability
                    },
                    backgroundColor: 'rgb(0, 0, 0)', // Black background color
                    tension: 0.2,
                }
            });
            return () => {
                myChart.destroy();
            };
        }
    }, [chartData]);





    useEffect(()=>{
        const fetchOrderdata=async()=>{
          const res =await axios.get(baseURL+'/teacherapp/teacherdashboard_orderdata/',{
            headers: {
              'authorization': `Bearer ${token}`,
              'Accept' : 'application/json',
              'Content-Type': 'application/json'
          }
          });
            
            console.log('orderdata',res.data);
            setOrderdata(res.data)
        }
        fetchOrderdata()
    },[])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 bg-black">
            <div className="bg-black border border-black shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                 <span className='text-white text-3xl'>Teacher Dashboard</span>
                <div className="py-5">
                    <main className="h-full overflow-y-auto">
                        <div className="container mx-auto grid">
                            
                            <div className="grid gap-6 mb-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                                <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                                    <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                    </svg>
                                    </div>
                                    <div>
                                    <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400 sm:text-base md:text-lg">
                                        Total Students
                                    </p>
                                    <p className="text-lg font-semibold text-gray-100 dark:text-gray-200 sm:text-xl md:text-2xl">
                                        {orderdata.total_students}
                                    </p>
                                    </div>
                                </div>
                            
                            {/* Card */}
                                <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                                    <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
                                    <img className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"  alt=''/>
                                    </div>
                                    <div>
                                    <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400 sm:text-base md:text-lg">
                                        Available Courses
                                    </p>
                                    <p className="text-lg font-semibold text-gray-100 dark:text-gray-200 sm:text-xl md:text-2xl">
                                            {orderdata.total_course}
                                    </p>
                                    </div>
                                </div>
                            {/* Card */}
                                <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                                    <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
                                    <img className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"  alt=''/>
                                    </div>
                                    <div>
                                    <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400 sm:text-base md:text-lg">
                                        Total Revenue
                                    </p>
                                    <p className="text-lg font-semibold text-gray-100 dark:text-gray-200 sm:text-xl md:text-2xl">
                                            {orderdata.total_amount}
                                    </p>
                                    </div>
                                </div>
                            {/* Card */}
                            
                            </div>

                            <div className="grid gap-6 mb-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                                <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                                    <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                                    </svg>
                                    </div>
                                    <div>
                                    <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400 sm:text-base md:text-lg">
                                        All Orders
                                    </p>
                                    <p className="text-lg font-semibold text-gray-100 dark:text-gray-200 sm:text-xl md:text-2xl">
                                            {orderdata.total_order}
                                    </p>
                                    </div>
                                </div>
                            
                            {/* Card */}
                                <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                                    <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
                                    <img className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"  alt=''/>
                                    </div>
                                    <div>
                                    <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400 sm:text-base md:text-lg">
                                        Blocked Courses
                                    </p>
                                    <p className="text-lg font-semibold text-gray-100 dark:text-gray-200 sm:text-xl md:text-2xl">
                                            {orderdata.total_blocked_courses}
                                    </p>
                                    </div>
                                </div>
                                {/* Card */}
                                <div className="flex items-center p-4 bg-gray-800 rounded-lg shadow-xs dark:bg-gray-800 hover:translate-y-2 transition-transform duration-300 ease-in-out">
                                    <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
                                    <img className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"  alt=''/>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-sm font-medium text-gray-100 dark:text-gray-400 sm:text-base md:text-lg">
                                            Total Lectures
                                        </p>
                                        <p className="text-lg font-semibold text-gray-100 dark:text-gray-200 sm:text-xl md:text-2xl">
                                                {orderdata.total_videos}
                                        </p>
                                    </div>
                                </div>
                            </div>
                    
                        </div>
                </main>
                </div>

                <div className="flex justify-between mb-4 items-start">
                    <div className="font-medium text-gray-100">Order Statistics</div>
                   

                </div>
                <div className="font-medium flex justify-between items-center mb-4"></div>
                <div className="bg-black border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="font-medium">Orders per Month</div>
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>


            <div className="bg-black border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <div className="flex justify-between mb-4 items-start">
                    <div className="font-medium text-white">New Orders</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-800 text-left rounded-tl-md rounded-bl-md">Username</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-800 text-left">Earning</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-800 text-left rounded-tr-md rounded-br-md">Course</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-800 text-left">Author</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-800 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderdata.orders.length === 0 && <tr><td className='m-5'>No Order Found</td></tr>}
                            {orderdata.orders.slice(0, 6).map(order => (
                                <tr key={order.id}>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <div className="flex items-center">
                                            <span  className="text-gray-200 text-sm font-medium hover:text-blue-500 ml-2 truncate">{order.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-emerald-500">{order.price}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-emerald-500">{order.course_name}</span>
                                    </td>
                                    
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-emerald-500">{order.author}</span>
                                    </td>

                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-emerald-500">{order.date_purchased}</span>
                                    </td>
                                   
                                </tr>
                            ))}
                            
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
  )
}

export default TeacherChart
