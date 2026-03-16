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
    Info
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

interface ConsultancyExpert {
    id: string;
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

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        setLoading(true);
        try {
            const res = await consultancyService.getExperts();
            setExperts(res.experts || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load consultancy experts");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (id: string, action: string) => {
        toast.info(`Action ${action} for expert ${id} triggered`);
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Consultancy Management</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Manage experts, sessions, and hourly rates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="h-11 rounded-xl font-bold shadow-lg shadow-indigo-600/10">
                        <Plus className="h-4 w-4 mr-2" /> Add Expert
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-indigo-500">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total experts</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-gray-900">{experts.length}</p>
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <User className="h-5 w-5 text-indigo-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Active Slots</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-gray-900">
                                {experts.reduce((acc, curr) => acc + (curr.slots?.length || 0), 0)}
                            </p>
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-emerald-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Avg. Rating</p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-gray-900">4.8</p>
                            <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-yellow-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-lg font-bold">Expert Directory</CardTitle>
                            <Badge variant="outline" className="h-5 text-[10px] font-bold border-gray-200 text-gray-500 bg-gray-50">
                                {filteredExperts.length} experts
                            </Badge>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                            <Input
                                placeholder="Search by expert name..."
                                className="pl-9 h-11 bg-gray-50/50 border-gray-100 rounded-xl text-sm"
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
                                <TableRow className="border-gray-100 h-14">
                                    <TableHead className="font-bold text-gray-900 pl-8">Expert</TableHead>
                                    <TableHead className="font-bold text-gray-900">Specialization</TableHead>
                                    <TableHead className="font-bold text-gray-900">Hourly Rate</TableHead>
                                    <TableHead className="font-bold text-gray-900">Slots</TableHead>
                                    <TableHead className="font-bold text-gray-900 text-right pr-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i} className="border-gray-100">
                                            <TableCell className="pl-8 py-4"><Skeleton className="h-12 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                            <TableCell className="text-right pr-8"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredExperts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center p-8">
                                                <Info className="h-10 w-10 text-gray-300 mb-2" />
                                                <p className="text-sm font-medium text-gray-500">No experts found matching your criteria</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredExperts.map((expert) => (
                                        <TableRow key={expert.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="pl-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase tracking-tight">
                                                        {(expert.user.profile?.firstName?.[0] || expert.user.username?.[0] || 'E')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {expert.user.profile ? `${expert.user.profile.firstName} ${expert.user.profile.lastName}` : expert.user.username}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 font-medium">{expert.user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-indigo-50 border-none text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                                    {expert.specialization}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm font-bold text-gray-900">₹{expert.hourlyRate}/hr</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px] font-bold">
                                                        {expert.slots?.length || 0} Available
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-gray-100 shadow-xl">
                                                        <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-gray-400 p-3">Options</DropdownMenuLabel>
                                                        <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => handleAction(expert.id, 'edit')}>
                                                            Edit Profiles
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => handleAction(expert.id, 'slots')}>
                                                            Manage Slots
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="p-3 cursor-pointer text-red-600 hover:bg-red-50" onClick={() => handleAction(expert.id, 'remove')}>
                                                            Remove Expert
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
        </div>
    );
};

export default AdminConsultancy;
