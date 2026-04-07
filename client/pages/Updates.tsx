import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Megaphone, Video, ArrowRight, Loader2, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { courseService } from "@/services/course.service";
import { webinarService } from "@/services/webinar.service";

interface UpdateItem {
    id: string;
    type: "New Course" | "Upcoming Webinar";
    title: string;
    description: string;
    image: string;
    date: string;
    link: string;
    icon: any;
    color: string;
    timestamp: number;
}

export default function Updates() {
    const [updates, setUpdates] = useState<UpdateItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            setLoading(true);
            try {
                const [coursesRes, webinarsRes] = await Promise.all([
                    courseService.getAll(),
                    webinarService.getAll()
                ]);

                const now = Date.now();
                const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

                const dynamicUpdates: UpdateItem[] = [];

                // Process Courses
                (coursesRes.courses || []).forEach((course: any) => {
                    const createdAt = new Date(course.createdAt || now).getTime();
                    if (createdAt >= sevenDaysAgo) {
                        dynamicUpdates.push({
                            id: `course-${course.id}`,
                            type: "New Course",
                            title: course.title,
                            description: course.description || "A new premium course has been added to our catalog.",
                            image: course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
                            date: "Recently Added",
                            link: `/courses/${course.id}`,
                            icon: Video,
                            color: "text-blue-500",
                            timestamp: createdAt
                        });
                    }
                });

                // Process Webinars
                (webinarsRes.webinars || []).forEach((webinar: any) => {
                    const scheduledAt = new Date(webinar.scheduledAt).getTime();
                    const createdAt = new Date(webinar.createdAt || now).getTime();
                    
                    // Show if scheduled in the future OR created in the last 7 days
                    if (scheduledAt >= now || createdAt >= sevenDaysAgo) {
                        dynamicUpdates.push({
                            id: `webinar-${webinar.id}`,
                            type: "Upcoming Webinar",
                            title: webinar.title,
                            description: webinar.description || "Join our upcoming live session for deep insights.",
                            image: webinar.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
                            date: new Date(webinar.scheduledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
                            link: "/webinars",
                            icon: Calendar,
                            color: "text-purple-500",
                            timestamp: scheduledAt
                        });
                    }
                });

                // Sort by timestamp (newest first)
                dynamicUpdates.sort((a, b) => b.timestamp - a.timestamp);
                setUpdates(dynamicUpdates);
            } catch (err) {
                console.error("Failed to fetch updates", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUpdates();
    }, []);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="py-20 bg-[#0f172a] border-b border-white/5">
                <div className="container px-4 mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Latest Updates & Announcements</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Stay ahead of the curve with our newest courses, upcoming webinars, and exciting community events.
                    </p>
                </div>
            </section>

            {/* Updates Grid */}
            <div className="container px-4 mx-auto py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium">Fetching latest updates...</p>
                    </div>
                ) : updates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {updates.map((update) => (
                            <Card key={update.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md">
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={update.image}
                                        alt={update.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/90 text-foreground hover:bg-white backdrop-blur-sm shadow-sm border-none px-3 py-1">
                                            <update.icon className={`w-3.5 h-3.5 mr-1.5 ${update.color}`} />
                                            {update.type}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="text-sm text-primary font-bold mb-1 uppercase tracking-wider">{update.date}</div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                        {update.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                        {update.description}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="ghost" className="w-full group/btn hover:bg-primary/5 hover:text-primary">
                                        <Link to={update.link} className="flex items-center justify-between w-full font-bold">
                                            View Details
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No recent updates</h3>
                        <p className="text-slate-500 mb-8 px-6">
                            We haven't added any new courses or webinars in the last 7 days. 
                            Check back soon for fresh content!
                        </p>
                        <Button asChild variant="outline">
                            <Link to="/courses">Browse Existing Courses</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
