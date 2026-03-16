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
    FileText,
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
import { cn } from "@/lib/utils";
import { CourseModal } from "@/components/admin/CourseModal";
import { CourseCategoryModal } from "@/components/admin/CourseCategoryModal";
import { courseService } from "@/services/course.service";
import { toast } from "sonner";

interface CourseRecord {
    id: string;
    title: string;
    description: string;
    price: number;
    level: string;
    isFree: boolean;
    categoryId: string;
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
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Modal states
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async (silent = false) => {
        if (!silent) setLoading(true);
        else setIsRefreshing(true);
        
        try {
            const res = await courseService.getAll();
            setCourses(res.courses || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch courses");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        try {
            await courseService.delete(id);
            setCourses(courses.filter(c => c.id !== id));
            toast.success("Course deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete course");
        }
    };

    const openCreateModal = () => {
        setSelectedCourse(null);
        setIsCourseModalOpen(true);
    };

    const openEditModal = (course: CourseRecord) => {
        setSelectedCourse(course);
        setIsCourseModalOpen(true);
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Course Management</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Create, edit, and organize your academy's curriculum.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-11 w-11 rounded-xl border-gray-200"
                        onClick={() => fetchCourses(true)}
                        disabled={isRefreshing || loading}
                    >
                        <RefreshCw className={cn("h-4 w-4 text-gray-500", (isRefreshing || loading) && "animate-spin")} />
                    </Button>
                    <Button 
                        variant="outline"
                        className="h-11 rounded-xl font-bold border-gray-200"
                        onClick={() => setIsCategoryModalOpen(true)}
                    >
                        Add Category
                    </Button>
                    <Button className="h-11 rounded-xl font-bold shadow-lg shadow-indigo-600/10" onClick={openCreateModal}>
                        <Plus className="h-4 w-4 mr-2" /> Create New Course
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Published</p>
                            {loading ? (
                                <Skeleton className="h-7 w-12 mt-1 rounded-lg" />
                            ) : (
                                <p className="text-xl font-bold">{courses.length}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Lessons</p>
                            {loading ? (
                                <Skeleton className="h-7 w-12 mt-1 rounded-lg" />
                            ) : (
                                <p className="text-xl font-bold">
                                    {courses.reduce((acc, curr) => acc + (curr._count?.lessons || 0), 0)}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <BarChart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Enrollments</p>
                            {loading ? (
                                <Skeleton className="h-7 w-12 mt-1 rounded-lg" />
                            ) : (
                                <p className="text-xl font-bold">
                                    {courses.reduce((acc, curr) => acc + (curr._count?.enrollments || 0), 0)}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search courses..."
                            className="pl-10 h-10 bg-gray-50 border-gray-100 focus:bg-white transition-all rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow className="border-gray-100 hover:bg-transparent">
                                    <TableHead className="font-bold text-gray-900 h-14 pl-8">Course Info</TableHead>
                                    <TableHead className="font-bold text-gray-900">Category</TableHead>
                                    <TableHead className="font-bold text-gray-900">Price/Status</TableHead>
                                    <TableHead className="font-bold text-gray-900">Content</TableHead>
                                    <TableHead className="h-14 pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-gray-100">
                                            <TableCell className="pl-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-20" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-lg" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredCourses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
                                                    <Search className="h-6 w-6 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-500">No courses found</p>
                                                <p className="text-xs text-gray-400">Try adjusting your search query</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCourses.map((course) => (
                                        <TableRow key={course.id} className="border-gray-100 hover:bg-gray-50/50 transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <BookOpen className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 leading-tight mb-1 truncate max-w-[200px]">
                                                        {course.title}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
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
                                                <p className="text-sm font-bold text-gray-900">
                                                    {course.isFree ? "Free" : `₹${course.price}`}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                    Lifetime Access
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4 text-gray-400">
                                                <div className="flex items-center gap-1.5 tooltip" title="Videos">
                                                    <Video className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-bold">{course._count?.lessons || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 tooltip" title="Resources">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-bold">0</span>
                                                </div>
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
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-gray-400 tracking-widest p-3">Management</DropdownMenuLabel>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => alert("Viewing course...")}>
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-medium">View Public</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => openEditModal(course)}>
                                                        <Edit className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-medium">Edit Details</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer" onClick={() => alert("Managing lessons...")}>
                                                        <Layers className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-medium">Manage Content</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="p-3 gap-3 cursor-pointer text-red-600 hover:bg-red-50" onClick={() => handleDelete(course.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="text-sm font-medium">Delete Course</span>
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

            <CourseModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                onSuccess={fetchCourses}
                course={selectedCourse}
            />
            <CourseCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSuccess={fetchCourses}
            />
        </div>
    );
};

export default AdminCourses;
