import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, Star, Video, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { consultancyService } from "@/services/consultancy.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { ConsultancyPaymentModal } from "@/components/ConsultancyPaymentModal";
import { GCalConfirmModal } from "@/components/GCalConfirmModal";

interface Expert {
    id: string;
    specialization: string;
    rating: number;
    hourlyRate: number;
    hasCalendarLink?: boolean;
    isGoogleConnected?: boolean;
    user: {
        profile: { firstName: string; lastName: string; avatarUrl?: string | null } | null;
    };
    slots: { id: string; startTime: string; endTime: string }[];
}

interface GCalBookingRecord {
    id: string;
    scheduledAt: string;
    notes?: string | null;
    googleMeetLink?: string | null;
    status: string;
    expert: {
        id: string;
        specialization: string;
        user: { profile: { firstName: string; lastName: string } | null };
    };
}

export default function Consultancy() {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [unlockedExperts, setUnlockedExperts] = useState<string[]>([]);
    const [myBookings, setMyBookings] = useState<{ id: string; expert: { id: string; specialization: string; hourlyRate: number; user: any } }[]>([]);
    const [gCalBookings, setGCalBookings] = useState<GCalBookingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState<string | null>(null);
    const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [confirmExpert, setConfirmExpert] = useState<Expert | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const { token, user } = useAuthStore();

    // Used to force a re-fetch every time the component mounts
    const [mountId] = useState(() => Math.random());

    // Fetch experts list on every mount
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
    // mountId changes on every component mount, ensuring a fresh fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mountId]);

    // Fetch which experts the logged-in user has already unlocked + their bookings
    useEffect(() => {
        if (!token) return;
        const fetchAccessAndBookings = async () => {
            try {
                const [accessRes, bookingsRes, gCalRes] = await Promise.all([
                    consultancyService.getAccess(),
                    consultancyService.getMyBookings(),
                    consultancyService.getGCalBookings(),
                ]);
                setUnlockedExperts(accessRes.access || []);
                setMyBookings(bookingsRes.bookings || []);
                setGCalBookings(gCalRes.bookings || []);
            } catch (err) {
                console.error("[Consultancy] Failed to fetch access/bookings:", err);
            }
        };
        fetchAccessAndBookings();
    // Re-run whenever user logs in/out OR the component remounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, mountId]);

    const handleBooking = async (slotId: string) => {
        if (!token) {
            toast.error("Please log in to book a session.");
            return;
        }
        setIsBooking(slotId);
        try {
            await consultancyService.book({ slotId });
            toast.success("Session booked successfully! Check your email for details.");
            const res = await consultancyService.getExperts();
            setExperts(res.experts || []);
        } catch (err: any) {
            toast.error(err.message || "Failed to book session.");
        } finally {
            setIsBooking(null);
        }
    };

    const handleUnlock = (expert: Expert) => {
        if (!token) {
            toast.error("Please log in to unlock booking.");
            return;
        }
        setSelectedExpert(expert);
        setIsPaymentModalOpen(true);
    };

    const onPaymentSuccess = async () => {
        if (selectedExpert) {
            setUnlockedExperts(prev => [...prev, selectedExpert.id]);
        }
        // Refetch both access and bookings from server to ensure fresh state
        if (token) {
            try {
                const [accessRes, bookingsRes, gCalRes] = await Promise.all([
                    consultancyService.getAccess(),
                    consultancyService.getMyBookings(),
                    consultancyService.getGCalBookings(),
                ]);
                setUnlockedExperts(accessRes.access || []);
                setMyBookings(bookingsRes.bookings || []);
                setGCalBookings(gCalRes.bookings || []);
            } catch { /* silent */ }
        }
    };

    const handleOpenCalendar = async (expert: Expert) => {
        try {
            const res = await consultancyService.getLink(expert.id);
            if (res.calendarLink) {
                window.open(res.calendarLink, "_blank");
                // After a short delay, prompt user to confirm their booking
                setTimeout(() => {
                    setConfirmExpert(expert);
                    setIsConfirmModalOpen(true);
                }, 2000);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to get calendar link.");
        }
    };

    const handleOpenCalendarById = async (expertId: string) => {
        try {
            const res = await consultancyService.getLink(expertId);
            if (res.calendarLink) {
                window.open(res.calendarLink, "_blank");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to get calendar link.");
        }
    };

    const refreshGCalBookings = async () => {
        if (!token) return;
        try {
            const res = await consultancyService.getGCalBookings();
            setGCalBookings(res.bookings || []);
        } catch { /* silent */ }
    };

    const handleSyncBookings = async () => {
        if (!token) return;
        
        // Find which unlocked experts actually have Google connected
        const connectedExpertIds = experts
            .filter(e => unlockedExperts.includes(e.id) && e.isGoogleConnected)
            .map(e => e.id);

        if (connectedExpertIds.length === 0) {
            toast.error("None of your unlocked consultants have connected their Google Calendar yet.");
            return;
        }

        setLoading(true);
        try {
            await Promise.all(connectedExpertIds.map(id => consultancyService.syncExpertBookings(id)));
            await refreshGCalBookings();
            toast.success("Sessions synced with Google Calendar!");
        } catch (err: any) {
            toast.error(err.message || "Failed to sync bookings.");
        } finally {
            setLoading(false);
        }
    };

    const handleConnectGoogle = async () => {
        try {
            const res = await consultancyService.getGoogleAuthUrl();
            if (res.url) {
                window.location.href = res.url;
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to get Google Auth URL");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="bg-[#0f172a] py-20 border-b border-white/5">
                <div className="container px-4 mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Expert Consultancy Hub</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
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

                                        {expert.hasCalendarLink ? (
                                            <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                                                {unlockedExperts.includes(expert.id) ? (
                                                    <>
                                                        <Button 
                                                            className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white shadow-lg shadow-[#4285F4]/20" 
                                                            onClick={() => handleOpenCalendar(expert)}
                                                        >
                                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                                            Book via Google Calendar
                                                        </Button>
                                                        <p className="text-xs text-center text-emerald-600 font-bold">Booking Unlocked</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button 
                                                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold" 
                                                            onClick={() => handleUnlock(expert)}
                                                        >
                                                            Pay ₹{expert.hourlyRate} to Unlock Booking
                                                        </Button>
                                                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">Secure Payment</p>
                                                    </>
                                                )}
                                            </div>
                                        ) : expert.slots.length > 0 ? (
                                            <div className="space-y-2 mt-4 pt-4 border-t">
                                                <p className="text-sm font-medium">Available Internal Slots:</p>
                                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
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
                                            <p className="text-sm text-muted-foreground text-center py-4 mt-4 border-t">No slots available</p>
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

                {/* My Unlocked Consultants Section */}
                {token && myBookings.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            <h2 className="text-2xl font-bold">My Unlocked Consultants</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myBookings.map((booking) => {
                                const expertName = booking.expert.user?.profile
                                    ? `${booking.expert.user.profile.firstName} ${booking.expert.user.profile.lastName}`
                                    : "Expert";
                                return (
                                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                                                {expertName[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{expertName}</p>
                                                <p className="text-xs text-muted-foreground">{booking.expert.specialization}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">Booking Unlocked</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-[#4285F4] hover:bg-[#3367d6] text-white"
                                            onClick={() => handleOpenCalendarById(booking.expert.id)}
                                        >
                                            <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                                            Book
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            Your appointments are managed in Google Calendar. Check your email for booking confirmations.
                        </p>
                    </div>
                )}
            </div>

            <ConsultancyPaymentModal 
                open={isPaymentModalOpen} 
                onOpenChange={setIsPaymentModalOpen} 
                expert={selectedExpert} 
                onSuccess={onPaymentSuccess} 
            />

            <GCalConfirmModal
                open={isConfirmModalOpen}
                onOpenChange={setIsConfirmModalOpen}
                expert={confirmExpert}
                onSuccess={refreshGCalBookings}
            />
        </div>
    );
}
