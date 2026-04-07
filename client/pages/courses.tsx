import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Filter, PlayCircle, Lock, Download, FileText, CheckCircle, Loader2, User } from "lucide-react";
import { courseService } from "@/services/course.service";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { PaymentModal } from "@/components/PaymentModal";
import { toast } from "sonner";

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
    const navigate = useNavigate();
    const { user, token } = useAuthStore();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
            const res = await courseService.getAll(params.toString());
            setCourses(res.courses || []);

            // Dynamic categories if not already fetched
            if (categories.length === 1) {
                const catsRes = await courseService.getCategories();
                const cats = Array.isArray(catsRes) ? catsRes : (catsRes.categories || []);
                const catNames = cats.map((c: any) => typeof c === 'string' ? c : c.name);
                setCategories(["All", ...catNames]);
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
            const res = await courseService.getMyCourses();
            // Check if res is an array or if it has an enrollments property
            const enrollments = Array.isArray(res) ? res : (res.enrollments || []);
            const enrolledIds = enrollments.map((enrollment: any) => enrollment.courseId);
            setEnrolledCourseIds(enrolledIds);
        } catch (err) {
            console.error("Failed to fetch enrollments", err);
        }
    };

    const handlePayment = async (course: Course) => {
        if (!user) {
            toast.error("Please login to enroll in courses.");
            return;
        }

        if (course.isFree || course.price === 0) {
            // Instant enrollment for free courses
            try {
                await courseService.enroll(course.id);
                toast.success("Successfully enrolled!");
                fetchEnrollments();
            } catch (err: any) {
                toast.error(err.message || "Enrollment failed");
            }
            return;
        }

        setSelectedCourse(course);
        setIsPaymentModalOpen(true);
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
            {/* Hero Section */}
            <div className="bg-[#0f172a] py-16 border-b border-white/5">
                <div className="container px-4 mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Explore Our Courses</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                        Upgrade your skills with our premium courses designed by industry experts.
                    </p>

                    <div className="flex justify-center">
                        <div className="relative w-full max-w-xl">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                placeholder="Search courses..."
                                className="w-full bg-white/10 backdrop-blur-md rounded-xl pl-12 pr-4 py-3 text-white shadow-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-slate-400 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Pills */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-10 py-3">
                <div className="container px-4 mx-auto flex gap-2 overflow-x-auto scrollbar-thin">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer",
                                selectedCategory === cat
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            <div className="container px-4 mx-auto py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium">Loading courses...</p>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-none flex flex-col group">
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={course.thumbnail || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop"}
                                        alt={course.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                                            {course.category?.name || "Premium"}
                                        </span>
                                    </div>
                                    {!course.isFree && (
                                        <div className="absolute top-3 right-3">
                                            <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2 rounded-lg py-1 shadow-sm">
                                                ₹{course.price}
                                            </span>
                                        </div>
                                    )}
                                    {course.isFree && (
                                        <div className="absolute top-3 right-3">
                                            <span className="bg-emerald-500 text-white text-xs font-bold px-2 rounded-lg py-1 shadow-sm">
                                                FREE
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Self-Paced Course</div>
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                                    
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <User className="h-4 w-4" /> 
                                        <span>{getInstructorName(course)}</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto mb-6">
                                        <span className="flex items-center gap-1.5"><PlayCircle className="h-4 w-4" /> {course.lessons?.length || 0} Lessons</span>
                                        <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> {course.resources?.length || 0} Resources</span>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl px-5 py-3 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                                    >
                                        {isEnrolled(course.id) ? "Continue Learning" : "View Course Details"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="h-20 w-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto mb-8">We couldn't find any courses matching your search or filters.</p>
                        <button
                            className="bg-primary/10 text-primary font-bold px-6 py-2 rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                            onClick={() => {
                                setSelectedCategory("All");
                                setSearchQuery("");
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            <PaymentModal
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
                course={selectedCourse}
                onSuccess={() => {
                    fetchEnrollments();
                }}
            />
        </div>
    );
}
