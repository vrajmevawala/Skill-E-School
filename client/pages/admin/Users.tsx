import { useEffect, useState } from "react";
import { 
    Search, 
    MoreVertical, 
    Shield, 
    Mail, 
    Calendar, 
    Plus,
    UserPlus,
    Ghost,
    Trash2,
    RefreshCw,
    UserCheck,
    UserX,
    UserCog
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
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { UserModal } from "@/components/admin/UserModal";

interface UserRecord {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

const UsersManager = () => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (silent = false) => {
        if (!silent) setLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await api.get("/admin/users");
            setUsers(res.users || []);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleAction = async (id: string, action: string) => {
        try {
            // Placeholder for backend integration
            console.log(`Performing ${action} on ${id}`);
            alert(`Action ${action} triggered! Implementation pending backend check.`);
        } catch (err) {
            console.error(err);
        }
    };

    const openCreateModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: UserRecord) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Directory</h1>
                    <p className="text-sm text-zinc-500 font-medium mt-1">Manage staff, students and external users.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-xl border-zinc-200"
                        onClick={() => fetchUsers(true)}
                        disabled={isRefreshing || loading}
                    >
                        <RefreshCw className={cn("h-4 w-4 text-zinc-500", (isRefreshing || loading) && "animate-spin")} />
                    </Button>
                    <Button 
                        className="h-11 rounded-xl font-bold shadow-lg shadow-primary/10"
                        onClick={openCreateModal}
                    >
                        <UserPlus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm bg-white border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Members</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-zinc-900">{users.length}</p>
                            )}
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <UserCog className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Students</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-zinc-900">{users.filter(u => u.role === "STUDENT").length}</p>
                            )}
                            <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Staff / Admins</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-zinc-900">{users.filter(u => u.role === "ADMIN" || u.role === "TRAINER").length}</p>
                            )}
                            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Active Now</p>
                        <div className="flex items-center justify-between">
                            {loading ? (
                                <Skeleton className="h-8 w-12 rounded-lg" />
                            ) : (
                                <p className="text-2xl font-bold text-zinc-900">{Math.floor(users.length * 0.1)}</p>
                            )}
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4 border-b border-zinc-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-lg font-bold">Member Directory</CardTitle>
                            <Badge variant="outline" className="h-5 text-[10px] font-bold border-zinc-200 text-zinc-500 bg-zinc-50">
                                {filteredUsers.length} results
                            </Badge>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 h-11 bg-zinc-50/50 border-zinc-100 rounded-xl text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="border-zinc-100 h-14">
                                    <TableHead className="font-bold text-zinc-900 pl-8">Member Identity</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Privileges</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Account Age</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                    <TableHead className="pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-zinc-100">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-40" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                            <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-80 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="h-16 w-16 rounded-3xl bg-zinc-50 flex items-center justify-center">
                                                    <Ghost className="h-8 w-8 text-zinc-300" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900">No members found</p>
                                                    <p className="text-xs text-zinc-500 mt-1">Refine your search parameters</p>
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="rounded-lg h-9 font-bold"
                                                    onClick={() => setSearchQuery("")}
                                                >
                                                    Clear Filters
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                                            <TableCell className="pl-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold text-xs">
                                                        {user.username.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-zinc-900">{user.username}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <Mail className="h-3 w-3 text-zinc-400" />
                                                            <span className="text-xs font-medium text-zinc-500">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0 border-none h-5",
                                                    user.role === "ADMIN" ? "bg-red-50 text-red-600" :
                                                    user.role === "TRAINER" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                                                )}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                                                    <Calendar className="h-3 w-3 text-zinc-400" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", user.status === "ACTIVE" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-300")} />
                                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{user.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-8 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100 rounded-lg">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 rounded-xl border-zinc-200 shadow-xl">
                                                        <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 tracking-widest p-3">Member Management</DropdownMenuLabel>
                                                        <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => openEditModal(user)}>
                                                            <UserCog className="h-4 w-4 text-zinc-400" />
                                                            <span className="text-sm font-medium">Edit Privileges</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => handleAction(user.id, 'reset_password')}>
                                                            <Mail className="h-4 w-4 text-zinc-400" />
                                                            <span className="text-sm font-medium">Reset Password</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-100" />
                                                        <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-rose-600 hover:bg-rose-50" onClick={() => handleAction(user.id, 'delete')}>
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="text-sm font-medium text-rose-600">Suspend Member</span>
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

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchUsers}
                user={selectedUser}
            />
        </div>
    );
};

export default UsersManager;
