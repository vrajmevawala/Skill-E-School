import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    Layers,
    BarChart,
    Video,
    FileText
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

interface CourseRecord {
    id: string;
    title: string;
    price: number;
    level: string;
    isFree: boolean;
    category: { name: string };
    trainer: { profile: { firstName: string, lastName: string } | null };
    _count?: {
        lessons: number;
        enrollments: number;
    };
}

const AdminCourses = () => {
    const [courses, setCourses] = useState<CourseRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get("/courses");
            setCourses(res.courses || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Course Management</h1>
                    <p className="text-sm text-zinc-500 font-medium mt-1">Create, edit, and organize your academy's curriculum.</p>
                </div>
                <Button className="h-11 rounded-xl font-bold shadow-lg shadow-primary/10">
                    <Plus className="h-4 w-4 mr-2" /> Create New Course
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Published</p>
                            <p className="text-xl font-bold">{courses.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Lessons</p>
                            <p className="text-xl font-bold">124</p> {/* Mock aggregate */}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <BarChart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Enrollments</p>
                            <p className="text-xl font-bold">856</p> {/* Mock aggregate */}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-10 h-10 bg-zinc-50 border-zinc-100 focus:bg-white transition-all rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="border-zinc-100 hover:bg-transparent">
                                    <TableHead className="font-bold text-zinc-900 h-14 pl-8">Course Info</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Category</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Price/Status</TableHead>
                                    <TableHead className="font-bold text-zinc-900">Content</TableHead>
                                    <TableHead className="h-14 pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                                                    {/* Add course thumbnail here if available */}
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <BookOpen className="h-5 w-5 text-zinc-400" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-zinc-900 leading-tight mb-1 truncate max-w-[200px]">
                                                        {course.title}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                        {course.level} • {course.trainer?.profile ? `${course.trainer.profile.firstName} ${course.trainer.profile.lastName}` : "No Instructor"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-2.5">
                                                {course.category?.name || "Uncategorized"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900">
                                                    {course.isFree ? "Free" : `₹${course.price}`}
                                                </p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                                                    Lifetime Access
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4 text-zinc-400">
                                                <div className="flex items-center gap-1.5 tooltip" title="Videos">
                                                    <Video className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-bold">{course._count?.lessons || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 tooltip" title="Resources">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-bold">0</span> {/* Add count if available */}
                                                </div>
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
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 tracking-widest p-3">Management</DropdownMenuLabel>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => alert("Viewing course...")}>
                                                        <Eye className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium">View Public</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => alert("Editing course...")}>
                                                        <Edit className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium">Edit Details</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => alert("Managing lessons...")}>
                                                        <Layers className="h-4 w-4 text-zinc-400" />
                                                        <span className="text-sm font-medium">Manage Content</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-rose-600 hover:bg-rose-50" onClick={() => alert("Deleting course...")}>
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Delete Course</span>
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

export default AdminCourses;
