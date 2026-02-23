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
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminWebinars from "./pages/admin/Webinars";
import AdminFranchise from "./pages/admin/Franchise";
import { useAuthStore } from "./store/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
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
        <Route element={<Layout><Updates /></Layout>} path="/updates" />
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/webinars" element={<AdminWebinars />} />
            <Route path="/admin/franchise" element={<AdminFranchise />} />
            <Route path="/admin/settings" element={<NotFound />} />
          </Route>
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
