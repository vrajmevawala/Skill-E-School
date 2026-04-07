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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, ExternalLink, FileText, Video, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: any | null;
}

export const CourseModal = ({
  isOpen,
  onClose,
  onSuccess,
  course,
}: CourseModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    level: "Beginner",
    categoryId: "",
    previewVideoUrl: "",
    thumbnail: "",
  });

  const [lessons, setLessons] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "content" | "resources">("general");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price?.toString() || "0",
        level: course.level || "Beginner",
        categoryId: course.categoryId || "",
        previewVideoUrl: course.previewVideoUrl || "",
        thumbnail: course.thumbnail || "",
      });
      setLessons(course.lessons || []);
      setResources(course.resources || []);
    } else {
      setFormData({
        title: "",
        description: "",
        price: "0",
        level: "Beginner",
        categoryId: "",
        previewVideoUrl: "",
        thumbnail: "",
      });
      setLessons([]);
      setResources([]);
    }
  }, [course]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/courses/categories");
      setCategories(res.categories || []);
    } catch (error) {
      console.error(error);
    }
  };

  const addLesson = () => {
    const newLesson = {
      id: "new-" + Date.now(),
      title: "",
      videoUrl: "",
      order: lessons.length + 1,
      duration: 10,
    };
    setLessons([...lessons, newLesson]);
  };

  const updateLesson = (id: string, field: string, value: any) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const addResource = () => {
    const newResource = {
      id: "new-" + Date.now(),
      name: "",
      type: "pdf",
      url: "",
    };
    setResources([...resources, newResource]);
  };

  const updateResource = (id: string, field: string, value: any) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        lessons: lessons.map(({ id, ...rest }) => id.toString().startsWith("new-") ? rest : { id, ...rest }),
        resources: resources.map(({ id, ...rest }) => id.toString().startsWith("new-") ? rest : { id, ...rest }),
      };

      if (course) {
        await api.patch(`/courses/${course.id}`, data);
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        await api.post("/courses", data);
        toast({ title: "Success", description: "Course created successfully" });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
        </DialogHeader>
        
        <div className="flex border-b mb-4">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'general' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('general')}
          >
            General Info
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'content' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('content')}
          >
            Video Content
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'resources' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources & Docs
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-200">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
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
                  <Label htmlFor="price">Price (?)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(v) => setFormData({ ...formData, level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previewVideo">Preview Video URL</Label>
                <Input
                  id="previewVideo"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.previewVideoUrl}
                  onChange={(e) => setFormData({ ...formData, previewVideoUrl: e.target.value })}
                />
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-slate-900">Course Curriculum</h3>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addLesson} className="rounded-xl h-9 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Phase/Lesson
                </Button>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                  <Video className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-400">Your curriculum is empty. Start adding systematic modules.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-4 relative group">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-xl bg-white border border-slate-200 text-primary text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
                          {idx + 1}
                        </div>
                        <Input 
                          placeholder="Module Title (e.g., Intro to Neuroscience of Growth)" 
                          className="h-11 rounded-xl bg-white border-slate-200 shadow-sm font-bold text-sm"
                          value={lesson.title}
                          onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl shrink-0"
                          onClick={() => removeLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">High-Res Video Link</Label>
                          <Input 
                            placeholder="https://..." 
                            className="h-10 rounded-xl bg-white border-slate-200 text-xs font-mono"
                            value={lesson.videoUrl || ""}
                            onChange={(e) => updateLesson(lesson.id, 'videoUrl', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Duration (Min)</Label>
                          <Input 
                            type="number" 
                            placeholder="15" 
                            className="h-10 rounded-xl bg-white border-slate-200 font-bold"
                            value={lesson.duration || ""}
                            onChange={(e) => updateLesson(lesson.id, 'duration', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold text-slate-900">Frameworks & Assets</h3>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addResource} className="rounded-xl h-9 border-slate-200 text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Document
                </Button>
              </div>

              {resources.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                  <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-400">No supplemental frameworks added yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div key={resource.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-center">
                      <div className="md:col-span-4">
                        <Input 
                          placeholder="Asset Name (e.g. Workbook)" 
                          className="h-10 rounded-xl bg-white border-slate-200 text-xs font-bold"
                          value={resource.name}
                          onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Select
                          value={resource.type}
                          onValueChange={(v) => updateResource(resource.id, 'type', v)}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-white border-slate-200 text-[10px] font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="zip">ZIP</SelectItem>
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="doc">Doc</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-5">
                        <Input 
                          placeholder="https://..." 
                          className="h-10 rounded-xl bg-white border-slate-200 text-xs font-mono"
                          value={resource.url || ""}
                          onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl"
                          onClick={() => removeResource(resource.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>

        <DialogFooter className="p-8 pt-4 border-t border-slate-50 bg-slate-50/50">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="rounded-xl h-11 px-8 font-bold text-slate-500">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-10 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : course ? "Save Program Updates" : "Confirm Publication"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
