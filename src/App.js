import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Mylandingpage from './Pages/Mylandingpage';
// import LoginPage from './Pages/studentpages/LoginPage';
// import Homepage from './Pages/studentpages/Homepage';
// import SigninPage from './Pages/studentpages/SigninPage';
// import Registrationpage from './Pages/studentpages/Registrationpage';
import { Provider } from "react-redux";
import Userstore from './Redux/authentication/Userstore';
import Studentwrapper from './Components/studentcomponents/Studentwrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Teacherwrapper from './Components/teachercomponents/Teacherwrapper';
import Adminwrapper from './Components/admincomponents/Adminwrapper';

function App() {
  return (
    <div className="App">
      <Router>
        <Provider store={Userstore}>
        <ToastContainer />
        <Routes>
          <Route path="/*" element={<Studentwrapper/>} />
          <Route path="teacher/*" element={<Teacherwrapper/>} />
          <Route path="admin/*" element={<Adminwrapper/>}/>
        </Routes>
        </Provider>
      </Router>
    </div>
  );
}

export default App;



