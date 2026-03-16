import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  PlayCircle, 
  FileText, 
  ChevronRight, 
  Download, 
  Lock, 
  CheckCircle2, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import { courseService } from "@/services/course.service";
import { useAuthStore } from "@/store/auth";
import { useCourseAccess } from "@/hooks/use-course-access";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PaymentModal } from "@/components/PaymentModal";

interface Lesson {
    id: string;
    title: string;
    videoUrl: string | null;
    order: number;
    duration?: number;
}

interface Resource {
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
    price: number;
    isFree: boolean;
    thumbnail: string | null;
    lessons: Lesson[];
    resources: Resource[];
}

export default function CourseView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuthStore();
    
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"videos" | "resources">("videos");
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    // Use the new hook to check course access
    const { access, loading: accessLoading } = useCourseAccess(id);

    useEffect(() => {
        if (id) {
            fetchCourse();
        }
    }, [id, user]);

    const fetchCourse = async () => {
        setLoading(true);
        try {
            const data = await courseService.getById(id!);
            setCourse(data.course);
            
            if (data.course.lessons?.length > 0) {
                setSelectedLesson(data.course.lessons[0]);
            }
        } catch (err) {
            console.error("Failed to fetch course", err);
            toast.error("Course not found");
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            toast.error("Please login to enroll");
            return;
        }

        if (course?.isFree || course?.price === 0) {
            try {
                await courseService.enroll(id!);
                toast.success("Successfully enrolled!");
                fetchCourse();
            } catch (err: any) {
                toast.error(err.message || "Enrollment failed");
            }
        } else {
            setIsPaymentModalOpen(true);
        }
    };

    if (loading || accessLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!course) return null;

    // Use the access response from the hook, fallback to free logic
    const isEnrolled = access?.isEnrolled || course.isFree;
    const canAccess = access?.canAccessContent || course.isFree;
    
    // If access hook returned lessons, use those (they only include for enrolled users)
    const lessonsToShow = access?.canAccessContent && access.lessons 
      ? access.lessons 
      : course.lessons;
    
    const resourcesToShow = access?.canAccessContent && access.resources 
      ? access.resources 
      : course.resources;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4 sticky top-16 z-10 shadow-sm">
                <button onClick={() => navigate("/courses")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-gray-900 leading-tight">{course.title}</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn(
                            "inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full",
                            isEnrolled 
                                ? "bg-emerald-100 text-emerald-700" 
                                : course.isFree 
                                    ? "bg-emerald-100 text-emerald-700" 
                                    : "bg-indigo-100 text-indigo-700"
                        )}>
                           {isEnrolled ? "Enrolled" : course.isFree ? "Free Access" : `Premium — ₹${course.price}`}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-3 space-y-2">
                        <button
                            onClick={() => setActiveTab("videos")}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer",
                                activeTab === "videos" 
                                    ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-200" 
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <PlayCircle className="h-5 w-5" /> All Videos
                            </span>
                            <span className={cn(
                                "inline-flex items-center justify-center h-6 min-w-[1.5rem] px-1.5 rounded-full text-xs font-semibold",
                                activeTab === "videos" ? "bg-indigo-200/60 text-indigo-700" : "bg-gray-100 text-gray-500"
                            )}>
                                {lessonsToShow?.length || 0}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("resources")}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer",
                                activeTab === "resources" 
                                    ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-200" 
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <FileText className="h-5 w-5" /> Resources
                            </span>
                            <span className={cn(
                                "inline-flex items-center justify-center h-6 min-w-[1.5rem] px-1.5 rounded-full text-xs font-semibold",
                                activeTab === "resources" ? "bg-indigo-200/60 text-indigo-700" : "bg-gray-100 text-gray-500"
                            )}>
                                {resourcesToShow?.length || 0}
                            </span>
                        </button>

                        {!isEnrolled && !course.isFree && (
                            <div className="mt-6 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-xl p-6 shadow-lg">
                                <h4 className="font-bold mb-2">Unlock Full Course</h4>
                                <p className="text-indigo-200 text-xs mb-6">Join thousands of students and get lifetime access to all assets.</p>
                                <button 
                                    onClick={handleEnroll} 
                                    className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-lg px-5 py-2.5 transition-colors cursor-pointer flex items-center justify-center gap-2 group"
                                >
                                    Enroll for ₹{course.price}
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {activeTab === "videos" ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Video List on Left */}
                                <div className="md:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Curriculum</h3>
                                    {lessonsToShow?.map((lesson, idx) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setSelectedLesson(lesson)}
                                            className={cn(
                                                "w-full flex items-start text-left p-3 rounded-xl border transition-all duration-200 group cursor-pointer",
                                                selectedLesson?.id === lesson.id 
                                                    ? "bg-white border-indigo-300 border-2 shadow-sm" 
                                                    : "bg-white border-gray-100 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="mr-3 mt-0.5 h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                <span className="text-[10px] font-bold text-gray-400">{idx + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm font-medium truncate",
                                                    selectedLesson?.id === lesson.id ? "text-indigo-600" : "text-gray-800"
                                                )}>{lesson.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <PlayCircle className="h-3 w-3 text-gray-400" />
                                                    <span className="text-[10px] font-medium text-gray-400">{lesson.duration || 10} min</span>
                                                </div>
                                            </div>
                                            {!canAccess && (
                                                <Lock className="h-3 w-3 text-gray-300 ml-2 mt-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Player View */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-xl relative border border-gray-200">
                                        {canAccess ? (
                                            selectedLesson?.videoUrl ? (
                                                <video 
                                                    key={selectedLesson.id}
                                                    src={selectedLesson.videoUrl} 
                                                    controls 
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-white p-12 text-center">
                                                    <PlayCircle className="h-12 w-12 text-gray-600 mb-4" />
                                                    <p className="text-gray-400 font-medium">No video source provided for this lesson.</p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/60 backdrop-blur-md text-white p-12 text-center">
                                                <div className="h-16 w-16 bg-gray-800 rounded-xl flex items-center justify-center mb-6 shadow-xl ring-1 ring-gray-700">
                                                    <Lock className="h-8 w-8 text-gray-500" />
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">Locked Content</h3>
                                                <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8">Access all {lessonsToShow?.length} video modules and resources.</p>
                                                <button 
                                                    onClick={handleEnroll} 
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all cursor-pointer"
                                                >
                                                    Enroll Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                        <h2 className="text-xl font-bold text-gray-900 mb-3">{selectedLesson?.title || course.title}</h2>
                                        <p className="text-gray-600 leading-relaxed text-sm">{course.description}</p>
                                        
                                        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-100">
                                             <div className="space-y-1">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Level</p>
                                                <p className="font-semibold text-sm text-gray-900">Intermediate</p>
                                             </div>
                                             <div className="space-y-1">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Certificate</p>
                                                <p className="font-semibold text-sm text-gray-900">Included</p>
                                             </div>
                                             <div className="space-y-1">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Support</p>
                                                <p className="font-semibold text-sm text-gray-900">Priority Q&A</p>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resourcesToShow?.map((res) => (
                                    <div key={res.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 uppercase">{res.type}</span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-1 truncate">{res.name}</h4>
                                            <p className="text-gray-500 text-xs mb-4">Download the comprehensive {res.name} guide.</p>
                                            
                                            {(canAccess || res.isFree) ? (
                                                <a 
                                                    href={res.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-5 py-2.5 transition-colors"
                                                >
                                                    Download <Download className="h-4 w-4" />
                                                </a>
                                            ) : (
                                                <button disabled className="w-full bg-gray-50 text-gray-400 font-medium rounded-lg px-5 py-2.5 cursor-not-allowed flex items-center justify-center gap-2">
                                                    <Lock className="h-4 w-4" /> Locked
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {resourcesToShow?.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">No resources attached to this course yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PaymentModal 
                open={isPaymentModalOpen} 
                onOpenChange={setIsPaymentModalOpen}
                course={course}
                onSuccess={() => {
                   fetchCourse();
                   window.location.reload();
                }}
            />
        </div>
    );
}
