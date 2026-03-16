import { useEffect, useState } from "react";
import {
    Calendar,
    Plus,
    Edit,
    Search,
    MoreVertical,
    Users,
    ExternalLink,
    Video,
    Clock,
    XCircle,
    RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { webinarService } from "@/services/webinar.service";
import { cn } from "@/lib/utils";
import { WebinarModal } from "@/components/admin/WebinarModal";
import { toast } from "sonner";

interface WebinarRecord {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    duration: number;
    instructor?: string;
    status: string;
    isFree: boolean;
    googleFormLink: string;
    platform?: string;
    _count?: {
        registrations: number;
    };
}

const WebinarManager = () => {
    const [webinars, setWebinars] = useState<WebinarRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWebinar, setSelectedWebinar] = useState<WebinarRecord | null>(null);

    useEffect(() => {
        fetchWebinars();
    }, []);

    const fetchWebinars = async (silent = false) => {
        if (!silent) setLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await webinarService.getAll();
            setWebinars(res.webinars || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch webinars");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this webinar?")) return;
        try {
            await webinarService.delete(id);
            setWebinars(webinars.filter(w => w.id !== id));
            toast.success("Webinar deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete webinar");
        }
    };

    const openCreateModal = () => {
        setSelectedWebinar(null);
        setIsModalOpen(true);
    };

    const openEditModal = (webinar: WebinarRecord) => {
        setSelectedWebinar(webinar);
        setIsModalOpen(true);
    };

    const filteredWebinars = webinars.filter(webinar =>
        webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webinar.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Webinar Management</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Schedule and monitor live educational events.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-xl border-gray-200"
                        onClick={() => fetchWebinars(true)}
                        disabled={isRefreshing || loading}
                    >
                        <RefreshCw className={cn("h-4 w-4 text-gray-500", (isRefreshing || loading) && "animate-spin")} />
                    </Button>
                    <Button className="h-11 rounded-xl font-bold shadow-lg shadow-indigo-600/10" onClick={openCreateModal}>
                        <Plus className="h-4 w-4 mr-2" /> Schedule Event
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Upcoming</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{webinars.filter(w => w.status === "UPCOMING").length}</p>
                            )}
                            <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-emerald-500">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Live Now</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{webinars.filter(w => w.status === "LIVE").length}</p>
                            )}
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Registrations</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">
                                    {webinars.reduce((acc, curr) => acc + (curr._count?.registrations || 0), 0).toLocaleString()}
                                </p>
                            )}
                            <Users className="h-5 w-5 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Completed</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{webinars.filter(w => w.status === "COMPLETED").length}</p>
                            )}
                            <Video className="h-5 w-5 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Event Log</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                            <Input
                                placeholder="Search event..."
                                className="pl-9 h-9 bg-gray-50 border-gray-100 rounded-lg text-xs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow className="border-gray-100">
                                    <TableHead className="font-bold text-gray-900 h-14 pl-8">Event Details</TableHead>
                                    <TableHead className="font-bold text-gray-900">Schedule</TableHead>
                                    <TableHead className="font-bold text-gray-900">Status</TableHead>
                                    <TableHead className="font-bold text-gray-900">Link</TableHead>
                                    <TableHead className="font-bold text-gray-900 text-center">Audience</TableHead>
                                    <TableHead className="h-14 pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-gray-100">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-20" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-12 mx-auto" /></TableCell>
                                            <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredWebinars.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                                    <Search className="h-6 w-6 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-500">No webinars found</p>
                                                <p className="text-xs text-gray-400">Try adjusting your search query</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredWebinars.map((webinar) => (
                                        <TableRow key={webinar.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                                                        webinar.status === "LIVE" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-gray-50 border-gray-100 text-gray-400"
                                                    )}>
                                                        <Video className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{webinar.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{webinar.instructor || "System Scheduled"}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs font-medium text-gray-600 space-y-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="h-3 w-3 text-gray-400" /> {new Date(webinar.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">{new Date(webinar.scheduledAt).toLocaleDateString()}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0 h-5 border-none",
                                                    webinar.status === "LIVE" ? "bg-red-50 text-red-600" :
                                                    webinar.status === "UPCOMING" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {webinar.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <a href={webinar.googleFormLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                                                    <ExternalLink className="h-3 w-3" />
                                                    <span className="text-xs font-bold">Link</span>
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-black text-gray-900">{webinar._count?.registrations || 0}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Joined</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-8 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-lg">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-200">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-400 tracking-widest p-3">Admin Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => openEditModal(webinar)}>
                                                            <Edit className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm font-medium">Edit Event</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-red-600 hover:bg-red-50" onClick={() => handleDelete(webinar.id)}>
                                                            <XCircle className="h-4 w-4" />
                                                            <span className="text-sm font-medium">Cancel Event</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <WebinarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchWebinars}
                webinar={selectedWebinar}
            />
        </div>
    );
};

export default WebinarManager;
