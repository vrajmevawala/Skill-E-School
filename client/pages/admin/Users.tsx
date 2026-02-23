import { useEffect, useState } from "react";
import {
    Users as UsersIcon,
    Search,
    MoreHorizontal,
    UserPlus,
    Shield,
    Mail,
    Calendar,
    Filter,
    Trash2,
    UserCog
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

interface UserRecord {
    id: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
    profile?: {
        firstName: string;
        lastName: string;
    };
}

const UserManagement = () => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { token } = useAuthStore();

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        if (!token) return;
        try {
            // Assuming a /admin/users endpoint exists or using general users list if admin
            const res = await api.get("/users", token);
            setUsers(res || []);
        } catch (err) {
            console.error(err);
            // Fallback mock data for demonstration
            setUsers([
                { id: "1", email: "admin@skille.com", role: "ADMIN", emailVerified: true, createdAt: "2024-01-01", profile: { firstName: "Main", lastName: "Admin" } },
                { id: "2", email: "trainer1@skille.com", role: "TRAINER", emailVerified: true, createdAt: "2024-02-15", profile: { firstName: "Robert", lastName: "Fox" } },
                { id: "3", email: "student@skille.com", role: "STUDENT", emailVerified: false, createdAt: "2024-03-10", profile: { firstName: "Alice", lastName: "Johnson" } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        // try {
        //   await api.patch(`/admin/users/${userId}/role`, { role: newRole }, token);
        //   fetchUsers();
        // } catch (err) { console.error(err); }
        alert(`Changing User ${userId} role to ${newRole} (Mock Action)`);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.profile?.firstName} ${user.profile?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">User Management</h1>
                <p className="text-sm text-zinc-500 font-medium mt-1">Oversee your community, manage permissions, and track growth.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <UsersIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Users</p>
                            <p className="text-xl font-bold">{users.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Trainers</p>
                            <p className="text-xl font-bold">{users.filter(u => u.role === "TRAINER").length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verified</p>
                            <p className="text-xl font-bold">{users.filter(u => u.emailVerified).length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 h-10 bg-zinc-50 border-zinc-100 focus:bg-white transition-all rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10 rounded-xl border-zinc-200 font-bold">
                                <Filter className="h-4 w-4 mr-2" /> Filter
                            </Button>
                            <Button className="h-10 rounded-xl font-bold shadow-lg shadow-primary/10">
                                <UserPlus className="h-4 w-4 mr-2" /> Add User
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="border-zinc-100 hover:bg-transparent">
                                    <TableHead className="font-bold text-zinc-900 h-14 pl-8">User</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Role</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Status</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Joined Date</TableHead>
                                    <TableHead className="h-14 pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-500 border border-zinc-200 shadow-inner group-hover:bg-white transition-colors">
                                                    {user.profile?.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-zinc-900 leading-none mb-1">
                                                        {user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : "User Profile Not Set"}
                                                    </p>
                                                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] font-black tracking-widest uppercase border-none px-2",
                                                user.role === "ADMIN" ? "bg-rose-50 text-rose-700" :
                                                    user.role === "TRAINER" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                                            )}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    user.emailVerified ? "bg-emerald-500" : "bg-orange-500"
                                                )} />
                                                <span className="text-xs font-bold text-zinc-600">
                                                    {user.emailVerified ? "Verified" : "Pending OTP"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100 rounded-lg">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl border-zinc-200">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 tracking-widest p-3">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => alert("Redirecting to profile...")}>
                                                        <UserCog className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium">View Profile</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-100" />
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 tracking-widest p-3">Change Role</DropdownMenuLabel>
                                                    <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => handleRoleChange(user.id, "ADMIN")}>ADMIN</DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => handleRoleChange(user.id, "TRAINER")}>TRAINER</DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => handleRoleChange(user.id, "STUDENT")}>STUDENT</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-100" />
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-rose-600 hover:bg-rose-50" onClick={() => alert("Deleting user...")}>
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Delete User</span>
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

export default UserManagement;
