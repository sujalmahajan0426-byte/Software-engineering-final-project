import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoBadge from './components/DemoBadge';
import Sidebar from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import PortalChatbot from './components/PortalChatbot';
import AmbientBackground from './components/AmbientBackground';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitAssignment from './pages/student/SubmitAssignment';
import GradingResult from './pages/student/GradingResult';
import MyFeedback from './pages/student/MyFeedback';
import MyProgress from './pages/student/MyProgress';
import MyAttendance from './pages/student/MyAttendance';
import MyBadges from './pages/student/MyBadges';
import LanguageSettings from './pages/student/LanguageSettings';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Assignments from './pages/teacher/Assignments';
import MyStudents from './pages/teacher/MyStudents';
import ClassAnalytics from './pages/teacher/ClassAnalytics';
import AtRiskStudents from './pages/teacher/AtRiskStudents';
import Reports from './pages/teacher/Reports';
import TeacherMessages from './pages/teacher/TeacherMessages';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildProgress from './pages/parent/ChildProgress';
import ChildAttendance from './pages/parent/ChildAttendance';
import RecentFeedback from './pages/parent/RecentFeedback';
import Notifications from './pages/parent/Notifications';
import MessageTeacher from './pages/parent/MessageTeacher';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <Navbar />
      <main className="flex-1 bg-transparent relative">
        <Outlet />
      </main>
      <Footer />
      <DemoBadge />
    </div>
  );
};

const PortalLayout = ({ role }) => {
  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <Navbar />
      <div className="flex flex-1 pt-[80px]">
        <Sidebar role={role} />
        <main className="flex-1 p-4 md:p-8 md:pt-8 bg-transparent relative pb-20 w-full min-w-0">
          <Outlet />
        </main>
      </div>
      <PortalChatbot />
      <DemoBadge />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AmbientBackground />
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Student Portal */}
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route element={<PortalLayout role="student" />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/submit" element={<SubmitAssignment />} />
              <Route path="/student/result" element={<GradingResult />} />
              <Route path="/student/feedback" element={<MyFeedback />} />
              <Route path="/student/progress" element={<MyProgress />} />
              <Route path="/student/attendance" element={<MyAttendance />} />
              <Route path="/student/badges" element={<MyBadges />} />
              <Route path="/student/language" element={<LanguageSettings />} />
            </Route>
          </Route>

          {/* Teacher Portal */}
          <Route element={<ProtectedRoute allowedRole="teacher" />}>
            <Route element={<PortalLayout role="teacher" />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/assignments" element={<Assignments />} />
              <Route path="/teacher/students" element={<MyStudents />} />
              <Route path="/teacher/analytics" element={<ClassAnalytics />} />
              <Route path="/teacher/at-risk" element={<AtRiskStudents />} />
              <Route path="/teacher/reports" element={<Reports />} />
              <Route path="/teacher/messages" element={<TeacherMessages />} />
            </Route>
          </Route>

          {/* Parent Portal */}
          <Route element={<ProtectedRoute allowedRole="parent" />}>
            <Route element={<PortalLayout role="parent" />}>
              <Route path="/parent" element={<ParentDashboard />} />
              <Route path="/parent/progress" element={<ChildProgress />} />
              <Route path="/parent/attendance" element={<ChildAttendance />} />
              <Route path="/parent/feedback" element={<RecentFeedback />} />
              <Route path="/parent/notifications" element={<Notifications />} />
              <Route path="/parent/message" element={<MessageTeacher />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
}
