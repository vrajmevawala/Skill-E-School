import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Megaphone, Video, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const updates = [
    {
        id: 1,
        type: "New Course",
        title: "Advanced React Patterns",
        description: "Master modern React with advanced design patterns, performance optimization, and state management techniques.",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        date: "Just Launched",
        link: "/courses",
        icon: Video,
        color: "text-blue-500"
    },
    {
        id: 2,
        type: "Upcoming Webinar",
        title: "The Future of AI in EdTech",
        description: "Join Dr. Sarah Johnson for a deep dive into how Artificial Intelligence is reshaping the education landscape.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
        date: "March 15, 2024",
        link: "/webinars",
        icon: Calendar,
        color: "text-purple-500"
    },
    {
        id: 3,
        type: "Event",
        title: "Skill E-School Hackathon 2024",
        description: "Participate in our annual 48-hour coding challenge. Win prizes worth ₹5 Lakhs and get hired by top startups.",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop",
        date: "April 10-12, 2024",
        link: "/webinars", // Assuming events are listed under webinars for now
        icon: Megaphone,
        color: "text-orange-500"
    }
];

export default function Updates() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                <div className="container px-4 mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Latest Updates & Announcements</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Stay ahead of the curve with our newest courses, upcoming webinars, and exciting community events.
                    </p>
                </div>
            </section>

            {/* Updates Grid */}
            <div className="container px-4 mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {updates.map((update) => (
                        <Card key={update.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-muted/50">
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={update.image}
                                    alt={update.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-background/90 text-foreground hover:bg-background/100 backdrop-blur-sm shadow-sm">
                                        <update.icon className={`w-3 h-3 mr-1 ${update.color}`} />
                                        {update.type}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader>
                                <div className="text-sm text-muted-foreground font-medium mb-2">{update.date}</div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                    {update.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground line-clamp-3">
                                    {update.description}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="ghost" className="w-full group/btn hover:bg-primary/5">
                                    <Link to={update.link} className="flex items-center justify-between w-full">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
