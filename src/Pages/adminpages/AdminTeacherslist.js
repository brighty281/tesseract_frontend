import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function AdminTeacherslist() {
    const authentication_user=useSelector(state=>state.authentication_user);
    const token=localStorage.getItem('access')  
    // const baseURL="http://127.0.0.1:8000"
    const baseURL = process.env.REACT_APP_BASE_URL;
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [showUModal, setShowUModal] = useState(false);
    const [showBModal, setShowBModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null); 

    const fetchUsers = (url) => {
        axios.get(url,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }})
          .then((response) => {
            if (response.data && Array.isArray(response.data)) {
              const filteredUsers = response.data.filter(user =>  !user.is_superuser && user.is_staff && user.is_email_verified );
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


      const handleInputChange = event => {
        setSearch(event.target.value);
      };
    
      const filteredUsers = users.filter(user =>
        (user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())) ?? false
      );
    


      const blockUser = () => {
        if (selectedUserId) {
          console.log(selectedUserId)
          axios.patch(`${baseURL}/adminapp/users/status/${selectedUserId}/`, { is_active: false },{
          headers: {
            'authorization': `Bearer ${token}`,
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
        }
      })
            .then((response) => {
              console.log('User blocked successfully', response);
              fetchUsers(`${baseURL}/adminapp/users/`);
              setShowBModal(false);
            })
            .catch((error) => {
              console.error('Error blocking user:', error);
            });
        }
      };
    




      const unblockUser = () => {
        if (selectedUserId) {
          console.log(selectedUserId)
          axios.patch(`${baseURL}/adminapp/users/status/${selectedUserId}/`, { is_active: true },{
            headers: {
              'authorization': `Bearer ${token}`,
              'Accept' : 'application/json',
              'Content-Type': 'application/json'
          }
        })
            .then((response) => {
              console.log('User unblocked successfully', response);
              fetchUsers(`${baseURL}/adminapp/users/`);
              setShowUModal(false);
            })
            .catch((error) => {
              console.error('Error unblocking user:', error);
            });
        }
      };




      useEffect(() => {
        fetchUsers(baseURL+"/adminapp/users/");
      }, []);

      
  return (
  <div className="bg-gray-200 min-h-screen transition-all main">
  <div className="flex justify-between items-center px-6 py-4">
    <div className="text-gray-600 font-semibold">Teachers List</div>
    <div className="flex items-center">
      <div className="flex items-center border border-gray-500 bg-white rounded-lg mr-4">
        <form onSubmit={e => e.preventDefault()} className="w-full flex items-center">
          <input 
            type="search" 
            value={search} 
            onChange={handleInputChange} 
            className="w-full px-4 py-1 text-gray-800 rounded-full focus:outline-none"
            placeholder="Search" 
          />
        </form>
      </div>
      <Link to="/admin/teachers_requests">
        <span className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide">
          View New Requests
        </span>
      </Link>
    </div>
  </div>

  <div className="px-6">
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
        {filteredUsers.length === 0 && <tr><td className='m-5 items-center justify-center flex'>No Teachers Found</td></tr> }
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
              {user.is_active ? (
                <>
                  <span
                    onClick={() => {
                      setShowBModal(true);
                      setSelectedUserId(user.id);
                    }}
                    className="bg-red-600 px-2 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                  >
                    Block
                  </span>
                  {showBModal && (
                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-modal="true" aria-labelledby="modal-headline">
                      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg
                                  width="64px"
                                  height="64px"
                                  className="h-6 w-6 text-red-600"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  strokeWidth="0.456"
                                >
                                  <path
                                    fill="#ef4444"
                                    d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                                  ></path>
                                  <path
                                    fill="#ef4444"
                                    d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                                  ></path>
                                  <path
                                    fill="#ef4444"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.2944 4.47643C9.36631 3.11493 10.5018 2.25 12 2.25C13.4981 2.25 14.6336 3.11493 15.7056 4.47643C16.7598 5.81544 17.8769 7.79622 19.3063 10.3305L19.7418 11.1027C20.9234 13.1976 21.8566 14.8523 22.3468 16.1804C22.8478 17.5376 22.9668 18.7699 22.209 19.8569C21.4736 20.9118 20.2466 21.3434 18.6991 21.5471C17.1576 21.75 15.0845 21.75 12.4248 21.75H11.5752C8.91552 21.75 6.84239 21.75 5.30082 21.5471C3.75331 21.3434 2.52637 20.9118 1.79099 19.8569C1.03318 18.7699 1.15218 17.5376 1.65314 16.1804C2.14334 14.8523 3.07658 13.1977 4.25818 11.1027L4.69361 10.3307C6.123 7.79629 7.24019 5.81547 8.2944 4.47643ZM9.47297 5.40432C8.49896 6.64148 7.43704 8.51988 5.96495 11.1299L5.60129 11.7747C4.37507 13.9488 3.50368 15.4986 3.06034 16.6998C2.6227 17.8855 2.68338 18.5141 3.02148 18.9991C3.38202 19.5163 4.05873 19.8706 5.49659 20.0599C6.92819 20.2485 9.01021 20.25 11.6875 20.25H12.3125C14.9898 20.25 17.0718 20.2485 18.5034 20.0599C19.9413 19.8706 20.618 19.5163 20.9785 18.9991C21.3166 18.5141 21.3773 17.8855 20.9397 16.6998C20.4963 15.4986 19.6249 13.9488 18.3987 11.7747L17.7998 10.6643C16.563 8.53156 15.501 6.64148 14.527 5.40432C13.5064 4.11732 12.5019 3.75 12 3.75C11.4981 3.75 10.4936 4.11732 9.47297 5.40432Z"
                                  ></path>
                                </svg>
                              </div>
                              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                  Block User
                                </h3>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">Are you sure you want to block this user?</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                              onClick={blockUser}
                              type="button"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Block
                            </button>
                            <button
                              onClick={() => setShowBModal(false)}
                              type="button"
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                <span onClick={() => { setShowUModal(true); setSelectedUserId(user.id); }}  className="bg-green-600 px-2 py-2 rounded-md  ml-3 text-white font-semibold tracking-wide cursor-pointer">Unblock</span>

                {showUModal && (
                 <>    
                   <div style={{zIndex:99999}} className="fixed z-9999 inset-0 overflow-y-auto" aria-modal="true" aria-labelledby="modal-headline" >
                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                       <div className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                         <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                           <div className="sm:flex sm:items-start">
                             <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                               
                             </div>
                             <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                               <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                 Unblock Item
                               </h3>
                               <div className="mt-2">
                                 <p className="text-sm text-gray-500">
                                   Are you sure you want to unblock ? {user.username}?
                                 </p>
                               </div>
                             </div>
                           </div>
                         </div>
                         <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                           <button
                             onClick={() => unblockUser(selectedUserId)}
                             type="button"
                             className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                           >
                             Confirm
                           </button>
                           <button
                             onClick={() => setShowUModal(false)}
                             type="button"
                             className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                           >
                             Cancel
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
                 </>
               )}

               
               </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  )
}

export default AdminTeacherslist

