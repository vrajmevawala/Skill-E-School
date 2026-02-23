import { useState, useEffect } from "react";
import { Search, Filter, PlayCircle, Lock, Download, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

interface CourseLesson {
    id: string;
    title: string;
    videoUrl: string | null;
    order: number;
    isFree?: boolean;
}

interface CourseResource {
    id: string;
    name: string;
    type: string;
    url: string;
    isFree: boolean;
}

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    previewVideoUrl: string | null;
    price: number;
    isFree: boolean;
    level: string;
    category: { id: string; name: string };
    trainer: { profile: { firstName: string; lastName: string } | null };
    lessons: CourseLesson[];
    resources: CourseResource[];
}

export default function Courses() {
    const { user, token } = useAuthStore();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<string[]>(["All"]);

    useEffect(() => {
        fetchData();
        if (user) {
            fetchEnrollments();
        }
    }, [selectedCategory, searchQuery, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== "All") params.set("category", selectedCategory);
            if (searchQuery) params.set("search", searchQuery);
            const res = await api.get(`/courses?${params.toString()}`);
            setCourses(res.courses || []);

            // Dynamic categories if not already fetched
            if (categories.length === 1) {
                const cats = Array.from(new Set((res.courses as Course[]).map((c) => c.category?.name).filter(Boolean)));
                setCategories(["All", ...cats]);
            }
        } catch (err) {
            console.error("Failed to fetch courses", err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrollments = async () => {
        if (!token) return;
        try {
            const res = await api.get("/courses/my-courses", token);
            const enrolledIds = res.map((enrollment: any) => enrollment.courseId);
            setEnrolledCourseIds(enrolledIds);
        } catch (err) {
            console.error("Failed to fetch enrollments", err);
        }
    };

    const handlePayment = (course: Course) => {
        if (!user) {
            alert("Please login to enroll in courses.");
            return;
        }
        console.log(`Initiating Razorpay for ${course.title}: ₹${course.price}`);
        alert(`Redirecting to Razorpay for ₹${course.price}... (Mock Payment)`);
    };

    const getInstructorName = (course: Course) => {
        if (course.trainer?.profile) {
            return `${course.trainer.profile.firstName} ${course.trainer.profile.lastName}`;
        }
        return "Instructor";
    };

    const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-primary/5 py-12">
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mb-8">
                        Upgrade your skills with our premium courses designed by industry experts.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses..."
                                className="pl-10 bg-background h-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="h-12 px-8 font-bold" onClick={fetchData}>Search</Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 mx-auto mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-zinc-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Filter className="h-5 w-5" /> Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-zinc-500">Category</h3>
                                <div className="flex flex-col gap-3">
                                    {categories.map(cat => (
                                        <div key={cat} className="flex items-center space-x-3 group cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                                            <input
                                                type="radio"
                                                id={cat}
                                                name="category"
                                                checked={selectedCategory === cat}
                                                readOnly
                                                className="accent-primary h-4 w-4 cursor-pointer"
                                            />
                                            <label htmlFor={cat} className={cn(
                                                "text-sm cursor-pointer transition-colors",
                                                selectedCategory === cat ? "text-primary font-bold" : "text-zinc-600 group-hover:text-zinc-900"
                                            )}>{cat}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Course Grid */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-zinc-500 font-medium">Loading academy curriculum...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {courses.map(course => (
                                <Card key={course.id} className="flex flex-col hover:shadow-xl transition-all duration-300 border-zinc-200 overflow-hidden group">
                                    <div className="relative aspect-video overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={course.thumbnail || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop"}
                                            alt={course.title}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Badge className={cn("px-3 py-1 font-bold shadow-lg", course.isFree ? "bg-emerald-500" : "bg-primary")}>
                                                {course.isFree ? "Free" : `₹${course.price}`}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{course.category?.name || "Premium"}</div>
                                        <CardTitle className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors">{course.title}</CardTitle>
                                        <CardDescription className="font-medium">By {getInstructorName(course)}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 pb-4">
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                                            {course.description}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm text-zinc-400 font-bold uppercase tracking-tighter">
                                            <span className="flex items-center gap-1.5"><PlayCircle className="h-4 w-4" /> {course.lessons?.length || 0} Lessons</span>
                                            <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {course.resources?.length || 0} Assets</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0 p-6">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/10 active:scale-95 transition-all">
                                                    {isEnrolled(course.id) ? "Continue Learning" : course.isFree ? "Start Now" : "Enroll Now"}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[1.5rem] bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
                                                <div className="p-8">
                                                    <DialogHeader className="mb-6">
                                                        <DialogTitle className="text-3xl font-bold leading-tight">{course.title}</DialogTitle>
                                                        <DialogDescription className="text-base">
                                                            Instructor: {getInstructorName(course)} • Level: {course.level}
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                        <div className="lg:col-span-2 space-y-6">
                                                            {/* Video Player */}
                                                            <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative">
                                                                {(course.isFree || isEnrolled(course.id)) ? (
                                                                    <video
                                                                        controls
                                                                        className="w-full h-full object-contain"
                                                                        src={course.previewVideoUrl || (course.lessons?.[0]?.videoUrl || "")}
                                                                        poster={course.thumbnail || undefined}
                                                                        key={course.previewVideoUrl}
                                                                    >
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-12 text-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                                                                        <div className="h-20 w-20 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-xl ring-1 ring-zinc-700">
                                                                            <Lock className="h-10 w-10 text-zinc-500" />
                                                                        </div>
                                                                        <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                                                                        <p className="text-sm text-zinc-400 mb-8 max-w-xs leading-relaxed">Enroll in this course to unlock all video modules and downloadable assets.</p>
                                                                        <Button onClick={() => handlePayment(course)} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-10 rounded-xl shadow-2xl">
                                                                            Unlock for ₹{course.price}
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="space-y-3">
                                                                <h3 className="font-bold text-xl tracking-tight">Curriculum Insight</h3>
                                                                <p className="text-zinc-600 leading-relaxed text-base">{course.description}</p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div className="border border-zinc-100 bg-zinc-50/50 rounded-2xl p-6">
                                                                <h3 className="font-bold mb-4 flex items-center gap-2 text-zinc-900">
                                                                    <FileText className="h-5 w-5 text-primary" /> Assets & Resources
                                                                </h3>
                                                                <ul className="space-y-3">
                                                                    {course.resources?.map((res) => (
                                                                        <li key={res.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-100 shadow-sm transition-all group hover:border-primary/20">
                                                                            <div className="flex items-center gap-3 min-w-0">
                                                                                <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                                                                                    <FileText className="h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                                                                                </div>
                                                                                <div className="truncate">
                                                                                    <p className="text-sm font-bold text-zinc-800 truncate leading-tight">{res.name}</p>
                                                                                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest h-4 px-1 px-1">{res.type}</Badge>
                                                                                </div>
                                                                            </div>
                                                                            {(res.isFree || isEnrolled(course.id)) ? (
                                                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 hover:text-primary hover:bg-primary/5">
                                                                                    <Download className="h-4 w-4" />
                                                                                </Button>
                                                                            ) : (
                                                                                <Lock className="h-3.5 w-3.5 text-zinc-200" />
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                    {course.resources?.length === 0 && (
                                                                        <p className="text-xs text-zinc-400 italic text-center py-4">No additional resources listed.</p>
                                                                    )}
                                                                </ul>
                                                            </div>

                                                            {!course.isFree && !isEnrolled(course.id) && (
                                                                <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20 rounded-2xl">
                                                                    <CardContent className="pt-8 text-center space-y-4">
                                                                        <div className="text-3xl font-black">₹{course.price}</div>
                                                                        <Button className="w-full bg-white text-primary hover:bg-zinc-50 h-14 rounded-xl font-black text-base active:scale-95 transition-all" onClick={() => handlePayment(course)}>
                                                                            Join Academy
                                                                        </Button>
                                                                        <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-[0.1em] opacity-80 pb-4">
                                                                            <CheckCircle className="h-3 w-3" /> Secure Checkout
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!loading && courses.length === 0 && (
                        <div className="text-center py-40 bg-zinc-50/50 rounded-3xl border-2 border-dashed border-zinc-200">
                            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Search className="h-6 w-6 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-1">No courses found</h3>
                            <p className="text-zinc-500 max-w-xs mx-auto text-sm">We couldn't find any curriculum matching your current filters or search query.</p>
                            <Button variant="link" className="mt-4 text-primary font-bold" onClick={() => {
                                setSelectedCategory("All");
                                setSearchQuery("");
                            }}>Reset Filters</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
