import { Link, Outlet, useLocation } from "react-router-dom";
import {
    BarChart3,
    Users,
    BookOpen,
    Video,
    Building2,
    Settings,
    LogOut,
    LayoutDashboard,
    Menu,
    X,
    GraduationCap,
    Headphones,
    Book as BookIcon,
    ChevronLeft,
    Loader2,
    AlertCircle,
    ShieldAlert,
    Lock,
    Info
} from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: Video, label: "Webinars", href: "/admin/webinars" },
    { icon: Headphones, label: "Consultancy", href: "/admin/consultancy" },
    { icon: BookIcon, label: "Books", href: "/admin/books" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
                <div className="h-20 border-b border-gray-200 flex items-center px-6 gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo-nav.png" alt="Skill E-School" className="h-12 w-auto object-contain" />
                    </Link>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/5 text-primary"
                                        : "text-gray-600 hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 h-16 flex items-center justify-between shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Skill E-School" className="h-10 w-auto object-contain" />
                    <span className="text-lg font-bold text-gray-900">Admin</span>
                </Link>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "lg:hidden fixed top-0 bottom-0 left-0 w-64 bg-white z-50 transition-transform duration-300 ease-in-out shadow-xl",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-20 border-b border-gray-200 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Skill E-School" className="h-10 w-auto object-contain" />
                        <span className="text-lg font-bold tracking-tight text-gray-900">Admin<span className="text-primary">Panel</span></span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
                <nav className="px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/5 text-primary"
                                        : "text-gray-600 hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-3 mt-auto absolute bottom-0 left-0 right-0 border-t border-gray-100">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
