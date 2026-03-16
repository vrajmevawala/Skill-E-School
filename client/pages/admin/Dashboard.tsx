import { useEffect, useState } from "react";
import {
    Users,
    BookOpen,
    Video,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Loader2
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { courseService } from "@/services/course.service";
import { webinarService } from "@/services/webinar.service";
import { franchiseService } from "@/services/franchise.service";
import { cn } from "@/lib/utils";

const StatsCard = ({ title, value, change, trend, icon: Icon }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn(
                        "text-xs font-semibold flex items-center gap-0.5",
                        trend === "up" ? "text-emerald-600" : "text-red-500"
                    )}>
                        {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {change}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Icon className="h-6 w-6 text-indigo-600" />
            </div>
        </div>
    </div>
);

const ActivityItem = ({ type, title, time, status }: any) => (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-gray-100">
        <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
            type === "enrollment" ? "bg-indigo-50 text-indigo-600" :
                type === "webinar" ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
        )}>
            {type === "enrollment" ? <Users className="h-5 w-5" /> :
                type === "webinar" ? <Video className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
            <div className="flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{time}</span>
            </div>
        </div>
        <span className={cn(
            "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium",
            status === "Completed" || status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        )}>
            {status}
        </span>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalWebinars: 0,
        activeFranchises: 0,
        recentUsers: [] as any[],
        roleDistribution: {
            STUDENT: 0,
            TRAINER: 0,
            ADMIN: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, coursesRes, webinarsRes, franchiseRes] = await Promise.all([
                    authService.getAllUsers(),
                    courseService.getAll(),
                    webinarService.getAll(),
                    franchiseService.getPartners()
                ]);

                const users = (usersRes.users || []).filter((u: any) => u.emailVerified);
                const roles = users.reduce((acc: any, curr: any) => {
                    acc[curr.role] = (acc[curr.role] || 0) + 1;
                    return acc;
                }, { STUDENT: 0, TRAINER: 0, ADMIN: 0 });

                setStats({
                    totalUsers: users.length,
                    totalCourses: coursesRes.courses?.length || 0,
                    totalWebinars: webinarsRes.webinars?.length || 0,
                    activeFranchises: franchiseRes.partners?.length || 0,
                    recentUsers: users.slice(0, 5),
                    roleDistribution: roles
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 h-9 px-4 border border-gray-200 bg-white text-gray-600 font-medium text-sm rounded-lg">
                        <Clock className="h-4 w-4 text-indigo-600" />
                        Last Synced: Just now
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Students" value={stats.totalUsers} change="+12.5%" trend="up" icon={Users} />
                <StatsCard title="Active Courses" value={stats.totalCourses} change="+4" trend="up" icon={BookOpen} />
                <StatsCard title="Upcoming Webinars" value={stats.totalWebinars} change="-1" trend="down" icon={Video} />
                <StatsCard title="Partners" value={stats.activeFranchises} change="+2" trend="up" icon={TrendingUp} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Enrollments */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Recent Enrollments</h2>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer">View All</button>
                    </div>
                    <div className="p-6 pt-2">
                        {stats.recentUsers.length > 0 ? (
                            stats.recentUsers.map((u: any) => (
                                <ActivityItem 
                                    key={u.id}
                                    type="enrollment" 
                                    title={`${u.profile?.firstName} ${u.profile?.lastName} joined the platform`} 
                                    time={new Date(u.createdAt).toLocaleDateString()} 
                                    status={u.status === "ACTIVE" ? "Active" : "Pending"} 
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">No recent users found.</p>
                        )}
                    </div>
                </div>

                {/* User Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 pb-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600" />
                            User Breakdown
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {[
                            { label: "Students", count: stats.roleDistribution.STUDENT, color: "bg-indigo-500" },
                            { label: "Trainers", count: stats.roleDistribution.TRAINER, color: "bg-emerald-500" },
                            { label: "Admins", count: stats.roleDistribution.ADMIN, color: "bg-amber-500" },
                        ].map((role) => (
                            <div key={role.label} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{role.label}</span>
                                    <span className="text-sm font-bold text-gray-900">{role.count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full", role.color)}
                                        style={{
                                            width: `${stats.totalUsers > 0 ? (role.count / stats.totalUsers) * 100 : 0}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Platform Growth</p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                You have {stats.totalUsers} registered users across all roles. 
                                {stats.roleDistribution.STUDENT > 0 ? ` Students make up ${Math.round((stats.roleDistribution.STUDENT / stats.totalUsers) * 100)}% of your base.` : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
