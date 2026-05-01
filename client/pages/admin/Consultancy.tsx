import { useEffect, useState } from "react";
import { 
    Search, 
    MoreVertical, 
    Calendar, 
    Clock, 
    User, 
    Video, 
    Plus, 
    Filter,
    Loader2,
    CheckCircle2,
    XCircle,
    Info,
    Trash2,
    Edit3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { consultancyService } from "@/services/consultancy.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ExpertModal } from "@/components/admin/ExpertModal";

interface ConsultancyExpert {
    id: string;
    userId: string;
    specialization: string;
    rating: number;
    hourlyRate: number;
    user: {
        username: string;
        email: string;
        profile: {
            firstName: string;
            lastName: string;
        } | null;
    };
    slots: any[];
}

const AdminConsultancy = () => {
    const [experts, setExperts] = useState<ConsultancyExpert[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState<ConsultancyExpert | null>(null);

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        setLoading(true);
        try {
            const res = await consultancyService.getAdminExperts();
            setExperts(res.experts || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load consultancy experts");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedExpert(null);
        setIsModalOpen(true);
    };

    const handleEdit = (expert: ConsultancyExpert) => {
        setSelectedExpert(expert);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this expert? This will also delete their availability slots.")) return;
        
        try {
            await consultancyService.deleteExpert(id);
            toast.success("Expert removed successfully");
            fetchExperts();
        } catch (err) {
            console.error(err);
            toast.error("Failed to remove expert");
        }
    };

    const filteredExperts = experts.filter(expert => {
        const name = `${expert.user.profile?.firstName} ${expert.user.profile?.lastName}`.toLowerCase();
        const email = expert.user.email.toLowerCase();
        const spec = expert.specialization.toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || email.includes(query) || spec.includes(query);
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-serif">Consultancy Management</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage expert profiles, hourly rates, and session availability.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={handleAdd} className="h-11 rounded-xl bg-[#0f172a] hover:bg-[#0f172a]/90 text-white font-bold shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus className="h-4 w-4 mr-2" /> Onboard New Expert
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-indigo-500 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Advisors</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black text-slate-900">{experts.length}</p>
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <User className="h-5 w-5 text-indigo-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Open Slots</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black text-slate-900">
                                {experts.reduce((acc, curr) => acc + (curr.slots?.length || 0), 0)}
                            </p>
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Advisor Rating</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-black text-slate-900">4.9</p>
                            <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-yellow-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2rem]">
                <CardHeader className="p-8 pb-4 border-b border-gray-50 bg-slate-50/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-lg font-bold text-slate-900">Expert Directory</CardTitle>
                            <Badge variant="outline" className="h-5 text-[10px] font-bold border-slate-200 text-slate-500 bg-white">
                                {filteredExperts.length} Specialists
                            </Badge>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name or field..."
                                className="pl-11 h-12 bg-white border-slate-200 rounded-xl text-sm focus:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-slate-50 h-16">
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">Advisory Expert</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Specialization</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Hour Rate (₹)</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Availability</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 text-right pr-8">Management</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i} className="border-slate-50">
                                            <TableCell className="pl-8 py-6"><Skeleton className="h-12 w-48 rounded-xl" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-32 rounded-lg" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-lg" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24 rounded-lg" /></TableCell>
                                            <TableCell className="text-right pr-8"><Skeleton className="h-10 w-10 ml-auto rounded-xl" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredExperts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-80 text-center">
                                            <div className="flex flex-col items-center justify-center p-8">
                                                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                                    <Info className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900">No Experts Found</p>
                                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Try adjusting your search filters</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredExperts.map((expert) => (
                                        <TableRow key={expert.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <TableCell className="pl-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm uppercase shadow-sm">
                                                        {(expert.user.profile?.firstName?.[0] || expert.user.username?.[0] || 'E')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                            {expert.user.profile ? `${expert.user.profile.firstName} ${expert.user.profile.lastName}` : expert.user.username}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{expert.user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                                    {expert.specialization}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm font-black text-slate-900">₹{expert.hourlyRate}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-2 w-2 rounded-full",
                                                        (expert.slots?.length || 0) > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                                                    )} />
                                                    <p className="text-xs font-bold text-slate-600">{(expert.slots?.length || 0)} Slots</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="h-10 w-10 rounded-xl border-slate-200 hover:bg-slate-100"
                                                        onClick={() => handleEdit(expert)}
                                                    >
                                                        <Edit3 className="h-4 w-4 text-slate-600" />
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="h-10 w-10 rounded-xl border-slate-200 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() => handleDelete(expert.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="group-hover:hidden transition-all">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                                                                <MoreVertical className="h-4 w-4 text-slate-400" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-xl">
                                                            <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-3 py-2">Consultant Options</DropdownMenuLabel>
                                                            <DropdownMenuItem className="p-3 rounded-xl cursor-pointer font-bold text-sm" onClick={() => handleEdit(expert)}>
                                                                <Edit3 className="h-4 w-4 mr-2 text-slate-400" /> Edit Profile
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="p-3 rounded-xl cursor-pointer font-bold text-sm" onClick={() => toast.info('Booking management coming soon')}>
                                                                <Calendar className="h-4 w-4 mr-2 text-slate-400" /> View Bookings
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="p-3 rounded-xl cursor-pointer font-bold text-sm text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(expert.id)}>
                                                                <Trash2 className="h-4 w-4 mr-2" /> Revoke Access
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <ExpertModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchExperts}
                expert={selectedExpert}
            />
        </div>
    );
};

export default AdminConsultancy;
