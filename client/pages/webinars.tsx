import { Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const webinars = [
    {
        id: 1,
        title: "Future of AI in Education",
        date: "March 15, 2024",
        time: "4:00 PM - 6:00 PM IST",
        speaker: "Dr. Alan Turing",
        role: "AI Researcher",
        price: 499,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop",
        attendees: 120,
        registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform" // Unique form for Event 1
    },
    {
        id: 2,
        title: "Building a Scalable Startup",
        date: "March 20, 2024",
        time: "6:00 PM - 7:30 PM IST",
        speaker: "Ms. Elena Fisher",
        role: "Venture Capitalist",
        price: 0,
        image: "https://images.unsplash.com/photo-1559136555-930d72f1d3d0?q=80&w=600&auto=format&fit=crop",
        attendees: 350,
        registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSecGHiWvnBluLSfCNcMrow8yEKICYnRvslqbbZb7wGNPRpqAg/viewform?usp=publish-editor" // Unique form for Event 2
    }
];

export default function Webinars() {

    const handleRegistration = (webinarTitle: string, price: number) => {
        if (price > 0) {
            alert(`Redirecting to payment gateway for ₹${price}...`);
        } else {
            alert(`Successfully registered for ${webinarTitle}! Check your email for details.`);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                <div className="container px-4 mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Live Webinars & Events</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Join interactive sessions with industry leaders, learn real-world skills, and network with peers.
                    </p>
                </div>
            </section>

            <div className="container px-4 mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {webinars.map((webinar) => (
                        <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-all border-none shadow-md">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="w-full md:w-2/5 relative">
                                    <img
                                        src={webinar.image}
                                        alt={webinar.title}
                                        className="w-full h-full object-cover min-h-[200px]"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        <Users className="w-3 h-3" /> {webinar.attendees} Joining
                                    </div>
                                </div>
                                <div className="w-full md:w-3/5 p-2 flex flex-col justify-between">
                                    <CardHeader>
                                        <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                                            <Calendar className="w-4 h-4" /> {webinar.date}
                                        </div>
                                        <CardTitle className="text-xl">{webinar.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            With {webinar.speaker}, {webinar.role}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="py-2">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {webinar.time}</span>
                                            <span className="flex items-center gap-1"><Video className="w-4 h-4" /> Live on Zoom</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center mt-2">
                                        <div className="text-lg font-bold">
                                            {webinar.price === 0 ? "Free" : `₹${webinar.price}`}
                                        </div>
                                        <Button asChild>
                                            <a href={webinar.registrationLink} target="_blank" rel="noopener noreferrer">
                                                {webinar.price === 0 ? "Register via Google Form" : "Buy Ticket"}
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
