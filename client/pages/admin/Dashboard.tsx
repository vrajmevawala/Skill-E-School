import { useEffect, useState } from "react";
import {
    Users,
    BookOpen,
    Video,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    TrendingDown,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const StatsCard = ({ title, value, change, trend, icon: Icon }: any) => (
    <Card className="border-none shadow-sm bg-white overflow-hidden group">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className={cn(
                            "text-xs font-bold flex items-center gap-0.5",
                            trend === "up" ? "text-emerald-600" : "text-rose-600"
                        )}>
                            {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {change}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">vs last month</span>
                    </div>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const ActivityItem = ({ type, title, time, status }: any) => (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-zinc-100">
        <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
            type === "enrollment" ? "bg-blue-50 text-blue-600" :
                type === "webinar" ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
        )}>
            {type === "enrollment" ? <Users className="h-5 w-5" /> :
                type === "webinar" ? <Video className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-900 truncate">{title}</p>
            <div className="flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3 text-zinc-400" />
                <span className="text-xs text-zinc-500">{time}</span>
            </div>
        </div>
        <Badge variant="secondary" className={cn(
            "text-[10px] uppercase font-bold tracking-widest px-2",
            status === "Completed" || status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"
        )}>
            {status}
        </Badge>
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
                    api.get("/auth/users"),
                    api.get("/courses"),
                    api.get("/webinars"),
                    api.get("/franchise/admin/partners")
                ]);

                const users = usersRes.users || [];
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Dashboard</h1>
                    <p className="text-sm text-zinc-500 font-medium mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-9 px-4 border-zinc-200 bg-white text-zinc-600 font-bold">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        Last Synced: Just now
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Students" value={stats.totalUsers} change="+12.5%" trend="up" icon={Users} />
                <StatsCard title="Active Courses" value={stats.totalCourses} change="+4" trend="up" icon={BookOpen} />
                <StatsCard title="Upcoming Webinars" value={stats.totalWebinars} change="-1" trend="down" icon={Video} />
                <StatsCard title="Partners" value={stats.activeFranchises} change="+2" trend="up" icon={TrendingUp} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm bg-white">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center justify-between">
                            Recent Enrollments
                            <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="space-y-2">
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
                                <p className="text-sm text-zinc-500 text-center py-4 font-medium">No recent active users found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            User Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        {[
                            { label: "Students", count: stats.roleDistribution.STUDENT, color: "bg-blue-500", icon: Users },
                            { label: "Trainers", count: stats.roleDistribution.TRAINER, color: "bg-emerald-500", icon: BookOpen },
                            { label: "Admins", count: stats.roleDistribution.ADMIN, color: "bg-purple-500", icon: TrendingUp },
                        ].map((role) => (
                            <div key={role.label} className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <role.icon className={cn("h-4 w-4", role.color === "bg-blue-500" ? "text-blue-600" : role.color === "bg-emerald-500" ? "text-emerald-600" : "text-purple-600")} />
                                        <span className="text-sm font-bold text-zinc-900">{role.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-zinc-900">{role.count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full", role.color)}
                                        style={{
                                            width: `${stats.totalUsers > 0 ? (role.count / stats.totalUsers) * 100 : 0}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Platform Growth</p>
                                <span className="text-[10px] font-black text-primary">NEW</span>
                            </div>
                            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                                You have {stats.totalUsers} registered users across all roles. 
                                {stats.roleDistribution.STUDENT > 0 ? ` Students make up ${Math.round((stats.roleDistribution.STUDENT / stats.totalUsers) * 100)}% of your base.` : ""}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
