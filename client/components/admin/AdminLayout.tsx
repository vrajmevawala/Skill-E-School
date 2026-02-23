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
    X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: Video, label: "Webinars", href: "/admin/webinars" },
    { icon: Building2, label: "Franchise", href: "/admin/franchise" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-zinc-200 sticky top-0 h-screen">
                <div className="p-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Admin<span className="text-primary">Panel</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-zinc-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-zinc-200 z-50 px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="text-lg font-bold">Admin</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "lg:hidden fixed top-0 bottom-0 left-0 w-72 bg-white z-50 transition-transform duration-300 ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 flex items-center justify-between">
                    <span className="text-xl font-bold tracking-tight">Admin<span className="text-primary">Panel</span></span>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <nav className="px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-zinc-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 mt-auto absolute bottom-0 left-0 right-0">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all font-semibold"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
