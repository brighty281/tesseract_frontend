import React,{useEffect,useState,useRef} from 'react'
import axios from 'axios';
import Chart from 'chart.js/auto';

function AdminChartOrder() {
    const chartRef = useRef(null);
    const [orders, setOrders] = useState([]);
    // const baseURL = "http://127.0.0.1:8000";
    const baseURL = process.env.REACT_APP_BASE_URL;
    const [viewMode, setViewMode] = useState('monthly');


    // chart section

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

    useEffect(() => {
        fetchData(); 
    }, [viewMode]);

    const fetchData = () => {
        let endpoint = '/adminapp/order_graph/';
        if (viewMode === 'yearly') {
            endpoint = '/adminapp/order_graph_year/';
        }

        if (viewMode === 'weekly') {
            endpoint = '/adminapp/order_graph_week/';
        }

        axios.get(baseURL + endpoint,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              }
        })
            .then(response => {
                const data = response.data;
                const { labels, data: chartData } = constructChartData(data);
                setChartData({
                    labels,
                    datasets: [{
                        label: viewMode,
                        data: chartData,
                        pointBackgroundColor: 'rgb(16, 185, 129)',
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderWidth: 1,
                        fill :true,
                    }]
                });
            })
            .catch(error => {
                console.error('Error fetching order data:', error);
            });
    };


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
        // console.log('Data:', data);


        if (viewMode === 'monthly') {
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


           
        } else if (viewMode === 'yearly') {
            const currentYear = new Date().getFullYear();
            for (let i = 4; i >= 0; i--) {
                const year = currentYear - i;
                labels.push(year.toString());
                const yearData = data.find(entry => entry.year_month === year.toString());
                chartData.push(yearData ? yearData.total_orders : 0);
            }

        } else if (viewMode === 'weekly') {
            if (typeof data === 'object' && data !== null) {
                Object.entries(data).forEach(([week, total_orders]) => {
                    labels.push(week);
                    chartData.push(total_orders);
                });
            } else {
                console.error('Data for weekly view is not in the expected format:', data);
            }
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
                            beginAtZero: true
                        }
                    },
                    backgroundColor: 'rgb(16 185 129 / .05)',
                    tension: .2,
                }
            });
            // chartRef.current.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
            return () => {
                myChart.destroy();
            };
        }
    }, [chartData]);


    const toggleViewMode = (event) => {
        setViewMode(event.target.value);
    };



    //orders part

    const fetchOrders = () => {
        axios.get(`${baseURL}/adminapp/dashboard_orders/`,{
          headers: {
              Authorization: `Bearer ${localStorage.getItem('access')}`,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            }
        })
          .then(response => {
            if (response.data && Array.isArray(response.data)) {     
              setOrders(response.data);
              console.log('order dashboard res....',response.data)
            } else {
              console.error("Error fetching orders: Data is not an array or undefined", response);
            }
          })
          .catch(error => {
            console.error("Error fetching orders:", error);
          });
      };
    
      useEffect(() => {
        fetchOrders();
      }, []);
      // console.log(orders);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
                <div className="flex justify-between mb-4 items-start">
                    <div className="font-medium">Order Statistics</div>

                    <select value={viewMode} onChange={toggleViewMode} className="   font-semibold py-1 px-4 rounded-md">
                        <option value="monthly">View by Month</option>
                        <option value="yearly">View by Year</option>
                        <option value="weekly">View by Week</option>
                    </select>


                </div>
                <div className="font-medium flex justify-between items-center mb-4"></div>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="font-medium">Orders per {viewMode}</div>
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>


            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                <div className="flex justify-between mb-4 items-start">
                    <div className="font-medium">New Orders</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Username</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Earning</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Course</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Author</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && <tr><td className='m-5'>No Order Found</td></tr>}
                            {orders.slice(0, 6).map(order => (
                                <tr key={order.id}>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <div className="flex items-center">
                                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                                            <span  className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">{order.username}</span>
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

export default AdminChartOrder
