import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Video, Loader2, PlayCircle, FileText, CheckCircle, Download, Lock, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { webinarService } from "@/services/webinar.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";

interface Webinar {
    id: string;
    title: string;
    description: string | null;
    scheduledAt: string;
    duration: number | null;
    meetingUrl: string | null;
    thumbnail: string | null;
    isFree: boolean;
    price: number | null;
    googleFormLink: string | null;
}

export default function Webinars() {
    const [webinars, setWebinars] = useState<Webinar[]>([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState<string | null>(null);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const res = await webinarService.getAll();
                setWebinars(res.webinars || []);
            } catch {
                setWebinars([]);
            } finally {
                setLoading(false);
            }
        };
        fetchWebinars();
    }, []);

    const handleRegister = async (webinarId: string) => {
        setRegistering(webinarId);
        try {
            await webinarService.register(webinarId);
            toast.success("Successfully registered for the webinar!");
        } catch (err: any) {
            toast.error(err.message || "Registration failed");
        } finally {
            setRegistering(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" });
    };

    const formatTime = (dateStr: string, duration: number | null) => {
        const start = new Date(dateStr);
        const timeStr = start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        if (duration) {
            const end = new Date(start.getTime() + duration * 60000);
            const endStr = end.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
            return `${timeStr} - ${endStr}`;
        }
        return timeStr;
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-primary/5 py-12">
                <div className="container px-4 mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Live Webinars & Events</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Join interactive sessions with industry leaders, learn real-world skills, and network with peers.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 mx-auto mt-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : webinars.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No upcoming webinars at the moment. Check back later!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {webinars.map((webinar) => (
                            <Card key={webinar.id} className="flex flex-col hover:shadow-lg transition-shadow border-none shadow-md overflow-hidden">
                                <div className="relative aspect-video overflow-hidden rounded-t-xl group">
                                    <img
                                        src={webinar.thumbnail || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"}
                                        alt={webinar.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={webinar.isFree ? "secondary" : "default"}>
                                            {webinar.isFree ? "Free" : `₹${Number(webinar.price)}`}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Live Webinar</div>
                                    <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                        <Calendar className="h-4 w-4" /> {formatDate(webinar.scheduledAt)}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    {webinar.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                            {webinar.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatTime(webinar.scheduledAt, webinar.duration)}</span>
                                        <span className="flex items-center gap-1"><Video className="h-4 w-4" /> Online</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full">
                                                {webinar.isFree ? "View Details" : "Enroll Now"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <DialogHeader>
                                                <DialogTitle>{webinar.title}</DialogTitle>
                                                <DialogDescription>
                                                    Scheduled for: {formatDate(webinar.scheduledAt)} • {formatTime(webinar.scheduledAt, webinar.duration)}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                                <div className="md:col-span-2 space-y-4">
                                                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
                                                        <img
                                                            src={webinar.thumbnail || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"}
                                                            alt={webinar.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-lg">About this Webinar</h3>
                                                        <p className="text-muted-foreground">{webinar.description || "Join us for this exciting live session where we dive deep into industry topics and share valuable insights."}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="border rounded-lg p-4">
                                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" /> Event Details
                                                        </h3>
                                                        <ul className="space-y-3">
                                                            <li className="flex flex-col text-sm">
                                                                <span className="font-medium">Date</span>
                                                                <span className="text-muted-foreground">{formatDate(webinar.scheduledAt)}</span>
                                                            </li>
                                                            <li className="flex flex-col text-sm">
                                                                <span className="font-medium">Time</span>
                                                                <span className="text-muted-foreground">{formatTime(webinar.scheduledAt, webinar.duration)}</span>
                                                            </li>
                                                            <li className="flex flex-col text-sm">
                                                                <span className="font-medium">Duration</span>
                                                                <span className="text-muted-foreground">{webinar.duration || 60} minutes</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {webinar.googleFormLink ? (
                                                            <Button className="w-full" asChild>
                                                                <a href={webinar.googleFormLink} target="_blank" rel="noopener noreferrer">
                                                                    Register on Google Form
                                                                </a>
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                className="w-full" 
                                                                onClick={() => handleRegister(webinar.id)}
                                                                disabled={registering === webinar.id}
                                                            >
                                                                {registering === webinar.id ? (
                                                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                                                                ) : (
                                                                    "Register for Webinar"
                                                                )}
                                                            </Button>
                                                        )}

                                                        {webinar.meetingUrl && (
                                                            <Button className="w-full" variant="outline" asChild>
                                                                <a href={webinar.meetingUrl} target="_blank" rel="noopener noreferrer">
                                                                    Join Meeting
                                                                </a>
                                                            </Button>
                                                        )}

                                                        {!webinar.isFree && !webinar.googleFormLink && (
                                                            <Card className="bg-primary/5 border-primary/20">
                                                                <CardContent className="pt-6 text-center space-y-4">
                                                                    <div className="text-2xl font-bold text-primary">₹{Number(webinar.price)}</div>
                                                                    <p className="text-xs text-muted-foreground">Secure payment via UPI, Card, or Netbanking</p>
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
            </div>
        </div>
    );
}
