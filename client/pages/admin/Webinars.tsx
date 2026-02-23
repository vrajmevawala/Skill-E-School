import { useEffect, useState } from "react";
import {
    Calendar,
    Plus,
    Search,
    MoreVertical,
    Users,
    ExternalLink,
    Video,
    Clock,
    ArrowRight,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface WebinarRecord {
    id: string;
    title: string;
    date: string;
    time: string;
    instructor: string;
    status: "Upcoming" | "Live" | "Completed";
    platform: string;
    registrations: number;
}

const WebinarManager = () => {
    const [webinars, setWebinars] = useState<WebinarRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking webinars for demonstration
        setWebinars([
            { id: "1", title: "Mastering Next.js 14 Server Actions", date: "2024-05-20", time: "18:00", instructor: "Robert Fox", status: "Upcoming", platform: "Google Meet", registrations: 156 },
            { id: "2", title: "Advanced CSS Layouts with Grid & Subgrid", date: "2024-05-22", time: "19:30", instructor: "Elena Rodriguez", status: "Upcoming", platform: "Zoom", registrations: 89 },
            { id: "3", title: "Introduction to Generative AI for Developers", date: "2024-05-15", time: "17:00", instructor: "David Chen", status: "Live", platform: "YouTube Live", registrations: 342 },
            { id: "4", title: "Career Path: From Junior to Senior Engineer", date: "2024-05-10", time: "20:00", instructor: "Sarah Wilson", status: "Completed", platform: "Zoom", registrations: 512 },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Webinar Management</h1>
                    <p className="text-sm text-zinc-500 font-medium mt-1">Schedule and monitor live educational events.</p>
                </div>
                <Button className="h-11 rounded-xl font-bold shadow-lg shadow-primary/10">
                    <Plus className="h-4 w-4 mr-2" /> Schedule Event
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Upcoming</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-zinc-900">{webinars.filter(w => w.status === "Upcoming").length}</p>
                            <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-emerald-500">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Live Now</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-zinc-900">{webinars.filter(w => w.status === "Live").length}</p>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Registrations</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-zinc-900">1,124</p>
                            <Users className="h-5 w-5 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Engagement Rate</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-zinc-900">72%</p>
                            <CheckCircle2 className="h-5 w-5 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Event Log</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                            <Input placeholder="Search event..." className="pl-9 h-9 bg-zinc-50 border-zinc-100 rounded-lg text-xs" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="border-zinc-100">
                                    <TableHead className="font-bold text-zinc-900 h-14 pl-8">Event Details</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Schedule</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Platform</TableHead>
                                    <TableHead className="font-bold text-zinc-900 text-center">Audience</TableHead>
                                    <TableHead className="h-14 pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {webinars.map((webinar) => (
                                    <TableRow key={webinar.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                                                    webinar.status === "Live" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-zinc-50 border-zinc-100 text-zinc-400"
                                                )}>
                                                    <Video className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-zinc-900 truncate max-w-[200px]">{webinar.title}</p>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{webinar.instructor}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-medium text-zinc-600 space-y-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 text-zinc-400" /> {webinar.time}
                                                </div>
                                                <div className="text-[10px] text-zinc-400">{webinar.date}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0 h-5 border-none",
                                                webinar.status === "Live" ? "bg-red-50 text-red-600" :
                                                    webinar.status === "Upcoming" ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-500"
                                            )}>
                                                {webinar.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-bold text-zinc-700">{webinar.platform}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-black text-zinc-900">{webinar.registrations}</span>
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Joined</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100 rounded-lg">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl border-zinc-200">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 tracking-widest p-3">Admin Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer">
                                                        <ExternalLink className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium">Manage Link</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer">
                                                        <Users className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium">View Registration List</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-rose-600 hover:bg-rose-50">
                                                        <XCircle className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Cancel Event</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WebinarManager;
