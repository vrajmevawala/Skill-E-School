import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
        toast({ title: "Success", description: "Webinar created successfully" });
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{webinar ? "Edit Webinar" : "Schedule New Webinar"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Webinar Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Date & Time</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (mins)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isFree">Type</Label>
              <Select
                value={formData.isFree ? "true" : "false"}
                onValueChange={(val) => setFormData({ ...formData, isFree: val === "true" })}
              >
                <SelectTrigger id="isFree">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Free</SelectItem>
                  <SelectItem value="false">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="googleFormLink">Google Form/Registration Link</Label>
            <Input
              id="googleFormLink"
              placeholder="https://forms.gle/..."
              value={formData.googleFormLink}
              onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : webinar ? "Update Webinar" : "Create Webinar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
