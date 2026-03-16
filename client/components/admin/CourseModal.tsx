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
import { Trash2, Plus, ExternalLink, FileText, Video } from "lucide-react";

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
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm">Course Lessons</h3>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addLesson}>
                  <Plus className="h-4 w-4 mr-2" /> Add Lesson
                </Button>
              </div>

              {lessons.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">No lessons added yet. Click "Add Lesson" to start building your course content.</p>
                </div>
              )}

              <div className="space-y-4">
                {lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="p-4 border rounded-xl bg-white space-y-3 relative group shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <Input 
                        placeholder="Lesson Title (e.g. Introduction to React)" 
                        className="h-8 text-sm font-medium"
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                        onClick={() => removeLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Video URL (YouTube/Vimeo/Direct)</Label>
                        <Input 
                          placeholder="https://..." 
                          className="h-8 text-xs font-mono"
                          value={lesson.videoUrl || ""}
                          onChange={(e) => updateLesson(lesson.id, 'videoUrl', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Duration (min)</Label>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          className="h-8 text-xs"
                          value={lesson.duration || ""}
                          onChange={(e) => updateLesson(lesson.id, 'duration', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-sm">Downloadable Resources</h3>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addResource}>
                  <Plus className="h-4 w-4 mr-2" /> Add Resource
                </Button>
              </div>

              {resources.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">No resources added. Add PDFs, slide decks, or source code for your students.</p>
                </div>
              )}

              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource.id} className="grid grid-cols-12 gap-3 p-3 border rounded-lg bg-white items-center">
                    <div className="col-span-4">
                      <Input 
                        placeholder="Resource Name" 
                        className="h-8 text-xs"
                        value={resource.name}
                        onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={resource.type}
                        onValueChange={(v) => updateResource(resource.id, 'type', v)}
                      >
                        <SelectTrigger className="h-8 text-[10px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="zip">ZIP</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="doc">Doc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-5">
                      <Input 
                        placeholder="File URL" 
                        className="h-8 text-xs font-mono"
                        value={resource.url || ""}
                        onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                        onClick={() => removeResource(resource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="sticky bottom-0 bg-white pt-4 pb-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
