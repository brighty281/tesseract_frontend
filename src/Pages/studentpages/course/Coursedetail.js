import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { CiCircleInfo } from "react-icons/ci";
import { Link,useNavigate,useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
function Coursedetail() {

    const authentication_user=useSelector(state=>state.authentication_user)

    // const baseURL = "http://127.0.0.1:8000";
    const baseURL = process.env.REACT_APP_BASE_URL;
    const navigate=useNavigate()
    const user_id=localStorage.getItem('userid')
    const token = localStorage.getItem('access');
    const [alreadyPurchased, setAlreadyPurchased] = useState(false);
    const [course, setCourse] = useState({
        id:'',
        course_name:'',
        user:'',
        description:'',
        level:'',
        benefit1:'',
        benefit2:'',
        benefit3:'',
        original_price:'',
        offer_price:'',
        demo_video:null,
        is_blocked:'',
        is_rejected:'',
        reject_reason:'',
        videos: []

    });

    const { id } = useParams();
    const fetchCourse = async () => {
        console.log('hello....')
        try {
          const response = await axios.get(`${baseURL}/teacherapp/course_view/${id}/`);
          const data=response.data
          console.log('data',data);
          setCourse({
            id:data.course.id,
            course_name: data.course.course_name,
            user: data.course.user,
            description: data.course.description,
            benefit1: data.course.benefit1,
            level: data.course.level,
            benefit2: data.course.benefit2,
            benefit3: data.course.benefit3,
            demo_video: data.course.demo_video,
            original_price: data.course.original_price,
            offer_price: data.course.offer_price,
            videos: data.videos,
            is_blocked: data.course.is_blocked,
            is_accepted: data.course.is_accepted,
            is_rejected: data.course.is_rejected,
            reject_reason: data.course.reject_reason

          });
          console.log(response.data);
         
            // if (data.is_accepted===false){
            //     toast.error(' Your Course is Not yet Verified');
            // }
        } catch (error) {
          console.error("Error fetching course:", error);
        }
      };
    
    const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const loadScript = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
      };


    const showRazorpay = async () => {
        const res = await loadScript();
        // console.log(res);
        let bodyData = new FormData();
        bodyData.append("amount", course.offer_price);
        bodyData.append("course", id);
        bodyData.append("user_id", user_id);
    
        const data = await axios({
          url: `${baseURL}/api/students/pay/`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          data: bodyData,
        }).then((res) => {
          return res;
        });
    

    
        var options = {
          key_id: process.env.REACT_APP_RAZOR_KEY_ID, 
          key_secret: process.env.REACT_APP_RAZOR_KEY_ID,
          amount: data.data.payment.amount,
          currency: "INR",
          name: course.course_name,
          description: "Test teansaction",
          image: "", // add image url
          order_id: data.data.payment.id,
          handler: function (response) {
            checkCoursePurchase()
            alert('payment successfull')
            // setPaymentSuccess(true); 
    
          },
          prefill: {
            name: "User's name",
            email: "User's email",
            contact: "User's phone",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
    
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        
      };

      const checkCoursePurchase = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/students/purchased/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Checkcoursepurchase success',response.data);
            setAlreadyPurchased(response.data.purchased);
            
            
        } catch (error) {
            console.error("Error checking course purchase:", error);
        }
    };


    useEffect(()=>{
        checkCoursePurchase();
    },[id])


    const go_to_video=(id,first_vid)=>{
        navigate(`/video_player/${id}/${first_vid}`)
        
    }






    useEffect(() => {
        fetchCourse();
        
        
      }, [id]);

      if (!course) {
        return <div>Loading...</div>;
      }



  return (
    <div>
        <div className="  px-10 bg-black text-gray-950 flex items-center justify-center">
        <div className="container max-w-screen-x mx-auto my-5">
        <div className=" mt-5 bg-black text-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <nav className="  flex justify-between" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                <Link to='/home'>
                    <span className="inline-flex items-center text-sm font-medium text-gray-100 hover:text-orange-600 dark:text-black-400 dark:hover:text-orange">
                        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        Home
                    </span>
                </Link>
                    </li>
                    <li>
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <Link to='/all_course'> 
                            <span className="ms-1 text-sm font-medium text-gray-100 hover:text-orange-600 md:ms-2 dark:text-black-400 dark:hover:text-orange">Courses</span>
                        </Link>
                    </div>
                    </li>
                    <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ms-1 text-sm font-medium text-black-500 md:ms-2 dark:text-black-400">View course</span>
                    </div>
                    </li>
                </ol>
                <div className='flex'>
                {!authentication_user.isAuthenticated ?(
                    <button onClick={()=>navigate('/login')} className='bg-yellow-500 font-semibold text-black px-4 py-2 rounded'>Login to Buy</button>
                ):
                   (
                alreadyPurchased ? (
                                  <button onClick={()=>go_to_video(course.id,course.videos[0].id)} className="bg-green-600 mt-5 ml-12 text-white py-2 px-4 rounded">Start lesson</button>
                                ):(<button onClick={showRazorpay} className="bg-blue-700 mt-5 ml-12 text-white py-2 px-4 rounded">
                                    Buy Now
                                </button>
                                )

                )
                }
                   
                </div>
                </nav>
                
                <div className=" my-10 mx-10 grid gap-5 gap-y-2 text-sm grid-cols-1 lg:grid-cols-5">
                    {course.demo_video && (
                        <div className="lg:col-span-2">
                            <video className="w-full" controls>
                            <source src={course.demo_video} type="video/mp4" />
                            Your browser does not support the video tag.
                            </video>
                        </div>
                        )}
            
                    <div className="lg:col-span-3">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6  mx-10">

                                {course.is_rejected &&(
                                    <span className='flex text-red-500 font-semibold text-md'><CiCircleInfo  className='mr-3 mt-1 font-semibold'/>{course.reject_reason}</span>
                                )}
                                
                            </div>
                            
                            <div className="md:col-span-6 mt-5 mx-10" >
                                    <p className='mt-3' style={{  fontSize: '1.9rem'}} >
                                    {capitalizeFirstLetter(course.course_name)}
                                    </p>
                            </div>


                            <div className="md:col-span-6 mt-3  mx-10 flex">
                                    <p style={{  fontSize: '1rem'}}>by {capitalizeFirstLetter(course.user)} </p>

                                    <svg className="mt-1 ml-2 w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                    </svg>
                            </div>


                            <div className="md:col-span-6 mt-5 mx-10" >
                                    <p className='mt-3' style={{  fontSize: '1.2rem'}} >
                                    {course.description}
                                    </p>
                            </div>

                            <div className="md:col-span-6 mt-5  mx-10" >
                                <p className='mt-3' style={{  fontSize: '1.2rem'}} >
                                <span className='text-indigo-500' >Course Level </span> :  {course.level}</p>
                            </div>

                            {/* <div className="md:col-span-6 mt-3  mx-10">
                                <p style={{  fontSize: '1.2rem'}}>
                                <span className='text-indigo-500' >Category </span>:  FullStack Development</p>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 gap-y-2 text-sm grid-cols-1 lg:grid-cols-5 my-20">
                <div className="lg:col-span-2" >
                <div className="rounded-3xl w-30 p-8 ring-1 xl:p-10 ring-gray-700">
                    <h3 id="tier-startup" className="text-2xl font-semibold leading-8 text-white">Pricing</h3>
                    <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-2xl font-bold text-gray-400"><strike>₹{course.original_price}</strike></span>

                    <span className="text-4xl font-bold tracking-tight text-white">₹{course.offer_price}</span>
                    <span className="text-sm font-semibold leading-6 text-green-500">only</span>
                    </p>
                    <ul className="mt-8 space-y-3 text-sm leading-6 xl:mt-10 text-white">
                    <li className="flex gap-x-3">
                        <svg className="h-6 w-5 flex-none text-purple-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        Access to all Videos
                    </li>

                    <li className="flex gap-x-3">
                        <svg className="h-6 w-5 flex-none text-purple-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                    Connect with Author
                    </li>

                    <li className="flex gap-x-3">
                        <svg className="h-6 w-5 flex-none text-purple-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        24 x 7 support available
                    </li>
                    </ul>
                    {/* <span aria-describedby="tier-startup" className="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-600 text-white shadow-sm hover:bg-green-800 focus-visible:outline-red-600">Buy plan</span> */}

                </div>
                </div>

                    <div className="lg:col-span-3">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-6">
                            <div className="md:col-span-6  mx-10">

                                <h1 className="mb-5 text-2xl font-semibold text-white-900 ">What are the benefits You will Get</h1>
                                    <ul class="space-y-4 text-left text-white-500 dark:text-white-400 mt-2">
                                        <li class="flex items-center space-x-3 rtl:space-x-reverse">
                                            <svg class="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                            </svg>
                                            <span className='text-lg'>{course.benefit1}</span>
                                        </li>
                                        <li class="flex items-center space-x-3 rtl:space-x-reverse">
                                            <svg class="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                            </svg>
                                            <span className='text-lg'>{course.benefit2}</span>
                                        </li>
                                        <li class="flex items-center space-x-3 rtl:space-x-reverse">
                                            <svg class="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                            </svg>
                                            <span className='text-lg'>{course.benefit3}<span class="font-semibold text-white-900 dark:text-white"></span></span>
                                        </li>


                                        <li class="flex items-center space-x-3 rtl:space-x-reverse">
                                            <svg class="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                            </svg>
                                            <span className='text-lg'>Premium support for <span class="font-semibold text-white-900 dark:text-white">6 months</span></span>
                                        </li>


                                        <li class="flex items-center space-x-3 rtl:space-x-reverse">
                                            <svg class="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                            </svg>
                                            <span className='text-lg'>Free updates for <span class="font-semibold text-white-900 dark:text-white">6 months</span></span>
                                        </li>


                                        
                                    </ul>


                            </div>
                        </div>
                        
                        <div className="lg:col-span-3 mt-9">
                            <div className='text-2xl mb-4'> 
                                <h3>Course contents</h3>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 bg-black shadow-md">
                                <thead className="">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Chapter</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Duration</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Actions</th> */}
                                    </tr>
                                </thead>
                                <tbody className=" divide-y">
                                    {course.videos.map((video)=>(
                                        <tr key={video.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{video.video_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{video.duration}</td>
                                            
                                        </tr>
                                    ))}
                                   
                                </tbody>
                            </table>
                            {!authentication_user.isAuthenticated ?(
                    <button onClick={()=>navigate('/login')} className='bg-yellow-500 text-black font-semibold px-4 py-2 rounded'>Login to Buy</button>
                ):
                                (       alreadyPurchased ? (
                                        <button  className="bg-green-600 mt-5 ml-12 text-white py-2 px-4 rounded">Start lesson</button>
                                    ):(<button onClick={showRazorpay} className="bg-blue-700 mt-5 ml-12 text-white py-2 px-4 rounded">
                                    Buy Now
                                    </button>
                                    ))
                            }
                        
                        </div>
                    </div>
                </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Coursedetail
