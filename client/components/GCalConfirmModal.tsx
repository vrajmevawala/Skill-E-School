import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CalendarCheck, Loader2, Link } from "lucide-react";
import { toast } from "sonner";
import { consultancyService } from "@/services/consultancy.service";

interface GCalConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expert: {
        id: string;
        specialization: string;
        user?: { profile: { firstName: string; lastName: string } | null };
    } | null;
    onSuccess: () => void;
}

export function GCalConfirmModal({ open, onOpenChange, expert, onSuccess }: GCalConfirmModalProps) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [googleMeetLink, setGoogleMeetLink] = useState("");
    const [loading, setLoading] = useState(false);

    const expertName = expert?.user?.profile
        ? `${expert.user.profile.firstName} ${expert.user.profile.lastName}`
        : "Expert";

    const handleConfirm = async () => {
        if (!date || !time) {
            toast.error("Please enter the date and time of your booked session.");
            return;
        }
        if (!expert) return;

        setLoading(true);
        try {
            const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
            await consultancyService.createGCalBooking({
                expertId: expert.id,
                scheduledAt,
                notes: notes || undefined,
                googleMeetLink: googleMeetLink || undefined,
            });
            toast.success("Booking recorded successfully!");
            // Reset form
            setDate("");
            setTime("");
            setNotes("");
            setGoogleMeetLink("");
            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to record booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 border-none overflow-hidden">
                {/* Header */}
                <div className="bg-[#0f172a] px-8 py-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl" />
                    </div>
                    <div className="h-14 w-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <CalendarCheck className="h-7 w-7 text-emerald-400" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-white">
                        Confirm Your Booking
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 mt-2 text-sm">
                        Enter the session details you booked with <span className="text-white font-semibold">{expertName}</span> on Google Calendar.
                    </DialogDescription>
                </div>

                {/* Form */}
                <div className="p-8 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Date *
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-11 rounded-xl border-slate-200"
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="time" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Time *
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="h-11 rounded-xl border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="meet-link" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Google Meet Link (optional)
                        </Label>
                        <div className="relative">
                            <Link className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
                            <Input
                                id="meet-link"
                                type="url"
                                placeholder="https://meet.google.com/abc-defg-hij"
                                value={googleMeetLink}
                                onChange={(e) => setGoogleMeetLink(e.target.value)}
                                className="h-11 rounded-xl border-slate-200 pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Notes (optional)
                        </Label>
                        <Input
                            id="notes"
                            placeholder="What would you like to discuss?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="h-11 rounded-xl border-slate-200"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl h-11 text-slate-500"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <CalendarCheck className="h-4 w-4 mr-2" />
                                    Confirm Booking
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
