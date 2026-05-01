import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { User, ShieldCheck, DollarSign, BrainCircuit, Loader2, Calendar } from "lucide-react";

interface ExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expert?: any | null;
}

export const ExpertModal = ({
  isOpen,
  onClose,
  onSuccess,
  expert,
}: ExpertModalProps) => {
  const [formData, setFormData] = useState({
    userId: "",
    specialization: "",
    hourlyRate: "",
    calendarLink: "",
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        fetchUsers();
    }
    if (expert) {
      setFormData({
        userId: expert.userId,
        specialization: expert.specialization,
        hourlyRate: expert.hourlyRate.toString(),
        calendarLink: expert.calendarLink || "",
      });
    } else {
      setFormData({
        userId: "",
        specialization: "",
        hourlyRate: "1500",
        calendarLink: "",
      });
    }
  }, [expert, isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users"); // Assuming this exists or we use /admin/users
      setUsers(res.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate),
      };

      if (expert) {
        await api.patch(`/consultancy/experts/${expert.id}`, data);
        toast({ title: "Success", description: "Expert profile updated" });
      } else {
        await api.post("/consultancy/experts", data);
        toast({ title: "Success", description: "New expert onboarded" });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save expert",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden">
        <div className="bg-[#0f172a] px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
            </div>
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-xl border border-white/10 text-primary">
                <ShieldCheck className="h-8 w-8" />
            </div>
            <DialogTitle className="text-3xl font-bold text-white tracking-tight">
                {expert ? "Refine Expert Profile" : "Onboard Consultant"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
                Configure systemic advisors for private growth sessions.
            </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!expert && (
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Select Active User</Label>
              <Select
                value={formData.userId}
                onValueChange={(val) => setFormData({ ...formData, userId: val })}
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-200">
                  <SelectValue placeholder="Identify the advisor..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="specialization" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Specialization Area</Label>
            <div className="relative">
                <BrainCircuit className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                id="specialization"
                className="h-12 rounded-xl border-slate-200 pl-11"
                placeholder="e.g., Strategic Sales & Automation"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Hourly Consultation Rate (₹)</Label>
            <div className="relative">
                <DollarSign className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                id="hourlyRate"
                type="number"
                className="h-12 rounded-xl border-slate-200 pl-11 font-bold"
                placeholder="1500"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                required
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendarLink" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Google Calendar Link (Optional)</Label>
            <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                id="calendarLink"
                type="url"
                className="h-12 rounded-xl border-slate-200 pl-11"
                placeholder="https://calendar.google.com/calendar/appointments/schedules/..."
                value={formData.calendarLink}
                onChange={(e) => setFormData({ ...formData, calendarLink: e.target.value })}
                />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-slate-500">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-10 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : expert ? "Save Credentials" : "Authorize Expert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
