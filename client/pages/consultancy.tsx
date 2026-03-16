import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Star, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { consultancyService } from "@/services/consultancy.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";

interface Expert {
    id: string;
    specialization: string;
    rating: number;
    hourlyRate: number;
    user: {
        profile: { firstName: string; lastName: string; avatarUrl?: string | null } | null;
    };
    slots: { id: string; startTime: string; endTime: string }[];
}

export default function Consultancy() {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState<string | null>(null);
    const { token } = useAuthStore();

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const res = await consultancyService.getExperts();
                setExperts(res.experts || []);
            } catch {
                setExperts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchExperts();
    }, []);

    const handleBooking = async (slotId: string) => {
        if (!token) {
            toast.error("Please log in to book a session.");
            return;
        }
        setIsBooking(slotId);
        try {
            await consultancyService.book({ slotId });
            toast.success("Session booked successfully! Check your email for details.");
            // Refresh experts to update available slots
            const res = await consultancyService.getExperts();
            setExperts(res.experts || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to book session.");
        } finally {
            setIsBooking(null);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-16 bg-primary/5 text-center">
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Expert Consultancy Hub</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Get personalized 1-on-1 guidance from top industry professionals.
                    </p>
                </div>
            </section>

            <div className="container px-4 mx-auto py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : experts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No experts available at the moment. Check back later!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experts.map((expert) => {
                            const name = expert.user?.profile
                                ? `${expert.user.profile.firstName} ${expert.user.profile.lastName}`
                                : "Expert";
                            return (
                                <Card key={expert.id} className="hover:shadow-lg transition-transform hover:-translate-y-1">
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={expert.user?.profile?.avatarUrl || undefined} alt={name} />
                                            <AvatarFallback>{name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{name}</CardTitle>
                                            <CardDescription className="text-primary font-medium">{expert.specialization}</CardDescription>
                                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" /> {expert.rating}/5.0
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm p-3 bg-muted rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span>60 Mins</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Video className="w-4 h-4 text-primary" />
                                                <span>Video Call</span>
                                            </div>
                                        </div>

                                        {expert.slots.length > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Available Slots:</p>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {expert.slots.map((slot) => (
                                                        <div key={slot.id} className="flex items-center justify-between p-2 border rounded-md text-sm">
                                                            <span>
                                                                {new Date(slot.startTime).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                                                {" "}
                                                                {new Date(slot.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                                            </span>
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline" 
                                                                onClick={() => handleBooking(slot.id)}
                                                                disabled={isBooking === slot.id}
                                                            >
                                                                {isBooking === slot.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Book"}
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-2">No slots available</p>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between pt-2 border-t mt-auto">
                                        <div>
                                            <span className="text-2xl font-bold">₹{Number(expert.hourlyRate)}</span>
                                            <span className="text-xs text-muted-foreground block">per session</span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
