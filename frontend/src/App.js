import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Home from './Components/Home/Home';
import AddUser from "./Components/AddUser/AddUser";
import Users from './Components/UserDetails/Users';
import UpdateUser from './Components/Update User/UpdateUser';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import ContactUs from './Components/ContactUs/ContactUs';
import AboutUs from './Components/AboutUs/AboutUs';
import Packages from './Components/Packages/Packages';
import Team from './Components/Team/Team';
import Testimonial from './Components/Testimonial/Testimonial';
import AdminHome from './Components/AdminHome/AdminHome';
import Payments from './Components/Payments/Payments';
import AddInstructor from './Components/AddInstructor/Addinstructor';
import Instructors from './Components/Instructors/Instructors';
import FeedbackDisplay from './Components/feedbackDisplay/feedbackDisplay';
import Dashboard from './Components/Dashboard/Dashboard';
import DisplayCourse from './Components/DisplayCourse';
import Progress from './Components/Progress/Progress';
import StudentDashboard from './Components/StudentDashboard/StudentDashboard';
import InstructorCredentialsTable from './Components/InstructorCredentials/InstructorCredentialsTable';
import PdfMaterials from './Components/PDFMaterials/PdfMaterials';

import Payment from './Components/Payment/Payment';
import SelectCourse from './Components/SelectCourse/SelectCourse'
import PayMethod from './Components/PayMethod/PayMethod';
import PayDetails from './Components/PayDetails/PayDetails';
import Gateway from './Components/Gateway/Gateway';
import PaymentSuccess from './Components/PaymentSuccess/PaymentSuccess';
import AdminMessages from './Components/AdminMessages/AdminMessages';
import ChatUI from './Components/Messages/ChatUI';
import Courses from './Components/Courses/Courses';
import Appointments from './Components/Appointments/Appointments';
import AllAppointments from './Components/AllAppointments/AllAppointments';
import InstructorDashboard from './Components/InstructorDashboard/InstructorDashboard';
import InstructorAppointments from './Components/InstructorAppointments/InstructorAppointments';
import InstructorStudents from './Components/InstructorDashboard/InstructorStudents';
import StudentDetails from './Components/StudentDetails/StudentDetails';
import StudentList from './Components/StudentList/StudentList';
import MyStudents from './Components/Mystudents/MyStudents';
import Attendance from './Components/Attendance/Attendance';
import ProgressSync from './Components/ProgressSync/ProgressSync';
import ProgressList from './Components/ProgressList/ProgressList';
import AttendanceList from './Components/AttendanceList/AttendanceList';
import AttendanceSync from './Components/AttendanceSync/AttendanceSync';
import InstructorSchedule from './Components/Schedule/InstructorSchedule';
import ScheduleForm from './Components/Schedule/ScheduleForm';
import ScheduleDetails from './Components/Schedule/ScheduleDetails';
import StudentScheduleDetails from './Components/Schedule/StudentScheduleDetails';
import StudentScheduleList from './Components/Schedule/StudentScheduleList';

const dashboardTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/userdetails" element={<Users />} />
          <Route path="/userdetails/:id" element={<UpdateUser />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/team" element={<Team />} />
          <Route path="/testimonials" element={<Testimonial />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/payments/*" element={<Payments />} />
          <Route path="/addinstructor" element={<AddInstructor />} />
          <Route path="/instructordetails" element={<Instructors />} />
          <Route path="/instructor-credentials" element={<InstructorCredentialsTable />} />
          <Route path="/feedback" element={<FeedbackDisplay />} />
          <Route path="/DisplayCourse" element={<DisplayCourse />} />
          <Route path="/studentdetails" element={<StudentDetails />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/selectcourse" element={<SelectCourse />}/>
          <Route path="/payment" element={<Payment />} />
          <Route path="/paymethod" element={<PayMethod />}/>
          <Route path="/paydetails" element={<PayDetails />}/>
          <Route path="/stripe-payment" element={<Gateway />}/>
          <Route path="/payment-success" element={<PaymentSuccess />}/>
          <Route path="/messages" element={<ChatUI/>} />
          <Route path="/admin/messages" element={<AdminMessages/>}/>
          <Route path="/appointments" element={<Appointments/>}/>
          <Route path="/allappointments" element={<AllAppointments/>}/>
          <Route path="/instructordashboard" element={<InstructorDashboard/>}/>
          <Route path="/instructorappointments" element={<InstructorAppointments/>}/>
          <Route path="/instructorstudents" element={<InstructorStudents/>}/>
          <Route path="/mystudents" element={<MyStudents/>}/>
          <Route path="/progress" element={<Progress />} />
          <Route path="/attendance" element={<Attendance/>}/>
          <Route path="/progress-list" element={<ProgressList/>}/>
          <Route path="/progress-sync" element={<ProgressSync/>}/>
          <Route path="/attendance-list" element={<AttendanceList/>}/>
          <Route path="/attendance-sync" element={<AttendanceSync/>}/>
          <Route path="/instructorschedule" element={<InstructorSchedule />} />
          <Route path="/schedule/create" element={<ScheduleForm />} />
          <Route path="/schedule/edit/:id" element={<ScheduleForm />} />
          <Route path="/schedule/:id" element={<ScheduleDetails />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/materials" element={<PdfMaterials />} />
          <Route
            path="/dashboard"
            element={
              <ThemeProvider theme={dashboardTheme}>
                <CssBaseline />
                <Dashboard />
              </ThemeProvider>
            }
          />
          <Route path="/courses" element={<Courses />} />
          <Route path="/schedule/student/:id" element={<StudentScheduleDetails />} />
          <Route path="/schedules/student" element={<StudentScheduleList />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
