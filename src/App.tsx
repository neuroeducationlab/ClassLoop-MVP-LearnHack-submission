import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppNavigationBridge, AppProvider } from '@/context/AppContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import TeacherShell from '@/components/layout/TeacherShell'
import StudentShell from '@/components/layout/StudentShell'
import Login from '@/pages/Login'
import Dashboard from '@/pages/teacher/Dashboard'
import Studio from '@/pages/teacher/Studio'
import Exams from '@/pages/teacher/Exams'
import Live from '@/pages/teacher/Live'
import ClassRoster from '@/pages/teacher/ClassRoster'
import Community from '@/pages/teacher/Community'
import Home from '@/pages/student/Home'
import Join from '@/pages/student/Join'
import StudentCommunity from '@/pages/student/StudentCommunity'
import Profile from '@/pages/student/Profile'
import Review from '@/pages/student/Review'
import Assignments from '@/pages/student/Assignments'

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <AppNavigationBridge />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route path="/teacher" element={<TeacherShell />}>
              <Route index element={<Studio />} />
              <Route path="studio" element={<Studio />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="exams" element={<Exams />} />
              <Route path="live" element={<Live />} />
              <Route path="class" element={<ClassRoster />} />
              <Route path="community" element={<Community />} />
            </Route>

            <Route path="/student" element={<StudentShell />}>
              <Route index element={<Home />} />
              <Route path="review" element={<Review />} />
              <Route path="syllabus" element={<Review />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="join" element={<Join />} />
              <Route path="community" element={<StudentCommunity />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}
