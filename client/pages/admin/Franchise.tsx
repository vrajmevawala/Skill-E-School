import { useEffect, useState } from "react";
import {
    Building2,
    Search,
    MoreVertical,
    MapPin,
    TrendingUp,
    Clock,
    CheckCircle2,
    Phone,
    Mail,
    Filter,
    DollarSign
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

interface FranchiseInquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    status: "Pending" | "Reviewing" | "Approved" | "Rejected";
    date: string;
}

const FranchiseManager = () => {
    const [inquiries, setInquiries] = useState<FranchiseInquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking inquiries for demonstration
        setInquiries([
            { id: "1", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", location: "Mumbai, MH", status: "Pending", date: "2024-05-18" },
            { id: "2", name: "Priya Patel", email: "priya@example.com", phone: "+91 87654 32109", location: "Ahmedabad, GJ", status: "Reviewing", date: "2024-05-15" },
            { id: "3", name: "Anita Singh", email: "anita@example.com", phone: "+91 76543 21098", location: "Delhi, NCR", status: "Approved", date: "2024-05-10" },
            { id: "4", name: "Kunal Verma", email: "kunal@example.com", phone: "+91 65432 10987", location: "Bangalore, KA", status: "Rejected", date: "2024-05-05" },
        ]);
        setLoading(false);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Franchise Management</h1>
                    <p className="text-sm text-zinc-500 font-medium mt-1">Review inquiries and manage franchise partner relations.</p>
                </div>
                <Button className="h-11 rounded-xl font-bold shadow-lg shadow-primary/10">
                    <TrendingUp className="h-4 w-4 mr-2" /> Performance Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Inquiries</p>
                            <p className="text-2xl font-bold">{inquiries.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Approved Partners</p>
                            <p className="text-2xl font-bold">12</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Franchise Revenue</p>
                            <p className="text-2xl font-bold">₹12.4L</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold">Recent Inquiries</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                                <Input placeholder="Search location or name..." className="pl-9 h-9 bg-zinc-50 border-zinc-100 rounded-lg text-xs" />
                            </div>
                            <Button variant="outline" size="sm" className="h-9 font-bold border-zinc-200">
                                <Filter className="h-3.5 w-3.5 mr-2" /> Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="border-zinc-100">
                                    <TableHead className="font-bold text-zinc-900 h-14 pl-8">Applicant</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Location</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Contact</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Applied Date</TableHead>
                                    <TableHead className="h-14 pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inquiries.map((inquiry) => (
                                    <TableRow key={inquiry.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                                        <TableCell className="pl-8 py-5">
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900">{inquiry.name}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Inquiry #{inquiry.id.padStart(4, "0")}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
                                                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                                {inquiry.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0 h-5 border-none",
                                                inquiry.status === "Pending" ? "bg-orange-50 text-orange-600" :
                                                    inquiry.status === "Reviewing" ? "bg-blue-50 text-blue-600" :
                                                        inquiry.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                            )}>
                                                {inquiry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                                    <Phone className="h-3 w-3" /> {inquiry.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                                    <Mail className="h-3 w-3" /> {inquiry.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs font-medium text-zinc-500">{inquiry.date}</p>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100 rounded-lg">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl border-zinc-200">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 tracking-widest p-3">Pipeline Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => alert("Reviewing inquiry...")}>
                                                        <Clock className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium">Mark Reviewing</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-emerald-600" onClick={() => alert("Approving partner...")}>
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Approve Partner</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-rose-600" onClick={() => alert("Rejecting inquiry...")}>
                                                        <Building2 className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Reject Inquiry</span>
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

export default FranchiseManager;
