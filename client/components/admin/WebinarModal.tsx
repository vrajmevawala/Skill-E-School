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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Video, Calendar, Clock, Link as LinkIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WebinarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  webinar?: {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    duration: number;
    isFree: boolean;
    googleFormLink: string;
    status: string;
  } | null;
}

export const WebinarModal = ({
  isOpen,
  onClose,
  onSuccess,
  webinar,
}: WebinarModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: "60",
    isFree: true,
    googleFormLink: "",
    status: "UPCOMING",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (webinar) {
      setFormData({
        title: webinar.title,
        description: webinar.description,
        scheduledAt: new Date(webinar.scheduledAt).toISOString().slice(0, 16),
        duration: webinar.duration.toString(),
        isFree: webinar.isFree,
        googleFormLink: webinar.googleFormLink,
        status: webinar.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        scheduledAt: "",
        duration: "60",
        isFree: true,
        googleFormLink: "",
        status: "UPCOMING",
      });
    }
  }, [webinar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        duration: parseInt(formData.duration),
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
      };

      if (webinar) {
        await api.patch(`/webinars/${webinar.id}`, data);
        toast({ title: "Success", description: "Webinar updated successfully" });
      } else {
        await api.post("/webinars", data);
        toast({ title: "Success", description: "Webinar scheduled successfully" });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save webinar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden">
        <div className="bg-[#0f172a] px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
            </div>
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-xl border border-white/10 text-primary">
                <Video className="h-8 w-8" />
            </div>
            <DialogTitle className="text-3xl font-bold text-white tracking-tight">
                {webinar ? "Update Live Event" : "Schedule New Webinar"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
                Plan and launch your next high-impact systematic session.
            </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Webinar Title</Label>
            <Input
              id="title"
              className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
              placeholder="e.g., Scaling Solopreneurship Secret"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Session Brief</Label>
            <Textarea
              id="description"
              className="min-h-24 rounded-xl border-slate-200 focus:ring-primary/20 resize-none"
              placeholder="What will owners learn in this session?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="scheduledAt" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Date & Time</Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                    id="scheduledAt"
                    type="datetime-local"
                    className="h-12 rounded-xl border-slate-200 pl-11"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Duration (Min)</Label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                    id="duration"
                    type="number"
                    className="h-12 rounded-xl border-slate-200 pl-11 font-bold"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="isFree" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Access Type</Label>
              <Select
                value={formData.isFree ? "true" : "false"}
                onValueChange={(val) => setFormData({ ...formData, isFree: val === "true" })}
              >
                <SelectTrigger id="isFree" className="h-12 rounded-xl border-slate-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="true">Open Access (Free)</SelectItem>
                  <SelectItem value="false">Paid Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Live Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger id="status" className="h-12 rounded-xl border-slate-200 uppercase text-[10px] font-black">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="LIVE">Now Live</SelectItem>
                  <SelectItem value="COMPLETED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleFormLink" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Registration/Zoom Link</Label>
            <div className="relative">
                <LinkIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                    id="googleFormLink"
                    placeholder="https://..."
                    className="h-12 rounded-xl border-slate-200 pl-11"
                    value={formData.googleFormLink}
                    onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
                    required
                />
            </div>
          </div>
          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-11 px-6 font-bold text-slate-500">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-10 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : webinar ? "Update Session" : "Schedule Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

