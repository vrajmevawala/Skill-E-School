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
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useCourseAccess } from "@/hooks/use-course-access";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
            const data = await api.get(`/courses/${id}`);
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
                await api.post(`/courses/${id}/enroll`, {}, token);
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
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
        <div className="min-h-screen bg-zinc-50/50">
            {/* Top Navigation */}
            <div className="bg-white border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="font-bold text-lg leading-tight">{course.title}</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                           {isEnrolled ? "Enrolled" : course.isFree ? "Free Access" : `Premium - ₹${course.price}`}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-3 space-y-2">
                        <button
                            onClick={() => setActiveTab("videos")}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-sm",
                                activeTab === "videos" 
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                                    : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <PlayCircle className="h-5 w-5" /> All Videos
                            </span>
                            <Badge className={cn(activeTab === "videos" ? "bg-white/20" : "bg-zinc-100 text-zinc-500")}>
                                {lessonsToShow?.length || 0}
                            </Badge>
                        </button>

                        <button
                            onClick={() => setActiveTab("resources")}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-sm",
                                activeTab === "resources" 
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                                    : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                <FileText className="h-5 w-5" /> Resources
                            </span>
                            <Badge className={cn(activeTab === "resources" ? "bg-white/20" : "bg-zinc-100 text-zinc-500")}>
                                {resourcesToShow?.length || 0}
                            </Badge>
                        </button>

                        {!isEnrolled && !course.isFree && (
                            <Card className="mt-8 border-none bg-gradient-to-br from-zinc-900 to-zinc-800 text-white overflow-hidden p-6">
                                <h4 className="font-bold mb-2">Unlock Full Course</h4>
                                <p className="text-zinc-400 text-xs mb-6">Join thousands of students and get lifetime access to all assets.</p>
                                <Button onClick={handleEnroll} className="w-full bg-primary hover:bg-primary/90 font-bold group">
                                    Enroll for ₹{course.price}
                                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Card>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {activeTab === "videos" ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Video List on Left */}
                                <div className="md:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                                    <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Curriculum</h3>
                                    {lessonsToShow?.map((lesson, idx) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setSelectedLesson(lesson)}
                                            className={cn(
                                                "w-full flex items-start text-left p-4 rounded-2xl border transition-all group",
                                                selectedLesson?.id === lesson.id 
                                                    ? "bg-white border-primary border-2 shadow-md shadow-primary/5" 
                                                    : "bg-white border-zinc-100 hover:border-zinc-300"
                                            )}
                                        >
                                            <div className="mr-3 mt-1 h-6 w-6 rounded-full bg-zinc-50 flex items-center justify-center shrink-0">
                                                <span className="text-[10px] font-black text-zinc-400">{idx + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm font-bold truncate",
                                                    selectedLesson?.id === lesson.id ? "text-primary" : "text-zinc-800"
                                                )}>{lesson.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <PlayCircle className="h-3 w-3 text-zinc-400" />
                                                    <span className="text-[10px] font-bold text-zinc-400">{lesson.duration || 10} min</span>
                                                </div>
                                            </div>
                                            {!canAccess && (
                                                <Lock className="h-3 w-3 text-zinc-300 ml-2 mt-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Player View */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-200">
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
                                                    <PlayCircle className="h-12 w-12 text-zinc-700 mb-4" />
                                                    <p className="text-zinc-500 font-bold">No video source provided for this lesson.</p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/40 backdrop-blur-md text-white p-12 text-center">
                                                <div className="h-20 w-20 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl ring-1 ring-zinc-700">
                                                    <Lock className="h-10 w-10 text-zinc-500" />
                                                </div>
                                                <h3 className="text-2xl font-black mb-2">Locked Curriculum</h3>
                                                <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-8">Access all {lessonsToShow?.length} video modules and career coaching.</p>
                                                <Button onClick={handleEnroll} className="bg-primary hover:bg-primary/90 text-white font-black h-14 px-12 rounded-2xl shadow-xl active:scale-95 transition-all">
                                                    Enroll Now
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                                        <h2 className="text-2xl font-black text-zinc-900 mb-4">{selectedLesson?.title || course.title}</h2>
                                        <p className="text-zinc-600 leading-relaxed">{course.description}</p>
                                        
                                        <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-zinc-50">
                                             <div className="space-y-1">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Level</p>
                                                <p className="font-bold text-sm">Intermediate</p>
                                             </div>
                                             <div className="space-y-1">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Certificate</p>
                                                <p className="font-bold text-sm">Included</p>
                                             </div>
                                             <div className="space-y-1">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Support</p>
                                                <p className="font-bold text-sm">Priority Q&A</p>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resourcesToShow?.map((res) => (
                                    <Card key={res.id} className="group overflow-hidden border-zinc-100 transition-all hover:shadow-xl hover:-translate-y-1 rounded-3xl bg-white">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase bg-zinc-50">{res.type}</Badge>
                                            </div>
                                            <h4 className="font-bold text-zinc-900 mb-2 truncate">{res.name}</h4>
                                            <p className="text-zinc-500 text-xs mb-6">Download the comprehensive {res.name} guide for this course.</p>
                                            
                                            {(canAccess || res.isFree) ? (
                                                <Button asChild variant="secondary" className="w-full rounded-xl h-12 font-bold group/btn">
                                                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                                                        Download Asset
                                                        <Download className="h-4 w-4 ml-2 group-hover/btn:scale-125 transition-transform" />
                                                    </a>
                                                </Button>
                                            ) : (
                                                <Button disabled className="w-full rounded-xl h-12 bg-zinc-50 text-zinc-400 font-bold">
                                                    <Lock className="h-4 w-4 mr-2" /> Locked Asset
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}

                                {resourcesToShow?.length === 0 && (
                                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-zinc-100">
                                        <FileText className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                                        <p className="text-zinc-400 font-bold">Safe! No resources attached to this curriculum yet.</p>
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
