import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminTeacherRequests() {
    const authentication_user=useSelector(state=>state.authentication_user);
    const token=localStorage.getItem('access')  
    // const baseURL="http://127.0.0.1:8000"
    const baseURL = process.env.REACT_APP_BASE_URL;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [showUModal, setShowUModal] = useState(false);
    const [showBModal, setShowBModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null); 
    const navigate=useNavigate()

    const fetchUsers = (url) => {
        axios.get(url,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }})
          .then((response) => {
            if (response.data && Array.isArray(response.data)) {
              const filteredUsers = response.data.filter(user =>  !user.is_superuser && user.is_staff && !user.is_email_verified );
              setUsers(filteredUsers);
              console.log(filteredUsers)
            } else {
              console.error("Error fetching users: Data is not an array or undefined", response);
            }
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      };

    const filteredUsers = users.filter(user =>
        (user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())) ?? false
        );
    
    const approveTeacher=(userId)=>{
            console.log(userId)
            axios.patch(`${baseURL}/adminapp/teachers/accept/${userId}/`, { is_email_verified: true },{
              headers: {
                'authorization': `Bearer ${token}`,
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            console.log('Teacher approved successfully', response);
            fetchUsers(`${baseURL}/adminapp/users/`);
            setShowBModal(false);
          })
          .catch((error) => {
            console.error('Error blocking user:', error);
          });
        
    }



      
    useEffect(() => {
        fetchUsers(baseURL+"/adminapp/users/");
    }, []);





  return (
    <div className="bg-black min-h-screen transition-all main">
        <div className="flex justify-between items-center px-6 py-4">
            
                <div className="flex max-w-4xl mx-auto mt-10 p-6 bg-gray-600 shadow-lg rounded-lg">
                    <div className="px-6">
                    <div className="text-gray-600 font-semibold">Teachers List</div><br/>
                    <table className="min-w-full leading-normal bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date Joined
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                            <tbody>
                                {filteredUsers.length === 0 && <tr><td className='m-5'>No Active Requests Found</td></tr>}
                                {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                        <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">{user.username}</p>
                                        </div>
                                    </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {new Date(user.date_joined).toLocaleDateString('en-US')}
                                    </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {user.is_active ? (
                                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span className="relative">Active</span>
                                        </span>
                                    ) : (
                                        <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                        <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                        <span className="relative">Blocked</span>
                                        </span>
                                    )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button onClick={()=>navigate(`/admin/verify_document/${user.id}`)}>view</button>
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

export default AdminTeacherRequests
