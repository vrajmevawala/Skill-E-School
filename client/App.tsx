import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/about";
import Courses from "./pages/courses";
import Consultancy from "./pages/consultancy";
import Franchise from "./pages/franchise";
import Webinars from "./pages/webinars";
import Updates from "./pages/Updates";
import AuthPage from "./pages/AuthPage";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import CourseView from "./pages/CourseView";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminWebinars from "./pages/admin/Webinars";
import AdminFranchise from "./pages/admin/Franchise";
import AdminConsultancy from "./pages/admin/Consultancy";
import AdminSettings from "./pages/admin/Settings";
import StudentProfile from "./pages/student/Profile";
import { useAuthStore } from "./store/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Auth routes without standard layout */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/verify-otp" element={<AuthPage />} />

        {/* Routes with standard layout */}
        <Route element={<Layout><Index /></Layout>} path="/" />
        <Route element={<Layout><About /></Layout>} path="/about" />
        <Route element={<Layout><Courses /></Layout>} path="/courses" />
        <Route element={<Layout><Consultancy /></Layout>} path="/consultancy" />
        <Route element={<Layout><Franchise /></Layout>} path="/franchise" />
        <Route element={<Layout><Webinars /></Layout>} path="/webinars" />
        <Route element={<Layout><CourseView /></Layout>} path="/courses/:id" />
        <Route element={<Layout><Updates /></Layout>} path="/updates" />
        <Route element={<Layout><FAQ /></Layout>} path="/faq" />
        <Route element={<Layout><PrivacyPolicy /></Layout>} path="/privacy" />
        <Route element={<Layout><TermsOfService /></Layout>} path="/terms" />
        <Route element={<Layout><ContactUs /></Layout>} path="/contact" />
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/webinars" element={<AdminWebinars />} />
            <Route path="/admin/consultancy" element={<AdminConsultancy />} />
            <Route path="/admin/franchise" element={<AdminFranchise />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
          <Route element={<Layout><StudentProfile /></Layout>} path="/profile" />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
