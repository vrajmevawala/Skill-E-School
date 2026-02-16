import { useState } from "react";
import { Search, Filter, PlayCircle, Lock, Download, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock Data for Courses
const courses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "Dr. Sarah Johnson",
        level: "Beginner",
        price: 4999,
        isFree: false,
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop",
        category: "Development",
        description: "Master full-stack web development with React, Node.js, and modern tools.",
        previewVideoUrl: "https://res.cloudinary.com/demo/video/upload/dog.mp4", // Cloudinary Demo Video
        resources: [
            { name: "Course Cheatsheet", type: "pdf", isFree: true },
            { name: "Source Code", type: "zip", isFree: false }
        ]
    },
    {
        id: 2,
        title: "Digital Marketing Masterclass",
        instructor: "David Chen",
        level: "Intermediate",
        price: 0,
        isFree: true,
        thumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=600&auto=format&fit=crop",
        category: "Marketing",
        description: "Learn SEO, Social Media, and Email Marketing strategies that work in 2024.",
        previewVideoUrl: "https://res.cloudinary.com/dul7kmwyw/video/upload/v1770972164/file_example_MP4_480_1_5MG_yzbg7i.mp4",
        resources: [
            { name: "Marketing Templates", type: "docx", isFree: true }
        ]
    },
    {
        id: 3,
        title: "Financial Planning for Entrepreneurs",
        instructor: "Priya Patel",
        level: "Advanced",
        price: 2999,
        isFree: false,
        thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop",
        category: "Business",
        description: "Understand cash flow, valuation, and investment strategies for your startup.",
        previewVideoUrl: "https://res.cloudinary.com/demo/video/upload/v1687518483/turtle_video.mp4",
        resources: [
            { name: "Financial Model XLS", type: "xlsx", isFree: false },
            { name: "Investor Deck Guide", type: "pdf", isFree: true }
        ]
    }
];

export default function Courses() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter Logic
    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handlePayment = (courseTitle: string, amount: number) => {
        // Mock Razorpay Integration
        console.log(`Initiating Razorpay for ${courseTitle}: ₹${amount}`);
        alert(`Redirecting to Razorpay for ₹${amount}... (Mock Payment)`);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="bg-primary/5 py-12">
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mb-8">
                        Upgrade your skills with our premium courses designed by industry experts.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 max-w-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses..."
                                className="pl-10 bg-background"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button>Search</Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container px-4 mx-auto mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" /> Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Category</h3>
                                <div className="flex flex-col gap-2">
                                    {["All", "Development", "Marketing", "Business", "Design"].map(cat => (
                                        <div key={cat} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id={cat}
                                                name="category"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(cat)}
                                                className="accent-primary"
                                            />
                                            <label htmlFor={cat} className="text-sm cursor-pointer">{cat}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Course Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCourses.map(course => (
                            <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                                <div className="relative aspect-video overflow-hidden rounded-t-xl group">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={course.isFree ? "secondary" : "default"}>
                                            {course.isFree ? "Free" : `₹${course.price}`}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{course.category}</div>
                                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                                    <CardDescription>By {course.instructor}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><PlayCircle className="h-4 w-4" /> 12 Lessons</span>
                                        <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {course.resources.length} Resources</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full">
                                                {course.isFree ? "Start Learning" : "Enroll Now"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <DialogHeader>
                                                <DialogTitle>{course.title}</DialogTitle>
                                                <DialogDescription>
                                                    Instructor: {course.instructor} • Level: {course.level}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                                <div className="md:col-span-2 space-y-4">
                                                    {/* Cloudinary Player Embed */}
                                                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
                                                        {course.isFree || course.price === 0 ? (
                                                            <video
                                                                controls
                                                                className="w-full h-full object-contain"
                                                                src={course.previewVideoUrl}
                                                                poster={course.thumbnail}
                                                            >
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900 p-6 text-center">
                                                                <Lock className="h-12 w-12 mb-4 text-muted-foreground" />
                                                                <p className="text-lg font-semibold">Premium Content</p>
                                                                <p className="text-sm text-gray-400 mb-4">Purchase this course to unlock full HD video access.</p>
                                                                <Button onClick={() => handlePayment(course.title, course.price)} className="bg-primary hover:bg-primary/90 text-white">
                                                                    Unlock for ₹{course.price}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-lg">About this Course</h3>
                                                        <p className="text-muted-foreground">{course.description}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="border rounded-lg p-4">
                                                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                            <FileText className="h-4 w-4" /> Course Resources
                                                        </h3>
                                                        <ul className="space-y-3">
                                                            {course.resources.map((resource, idx) => (
                                                                <li key={idx} className="flex items-center justify-between text-sm">
                                                                    <div className="flex items-center gap-2 flex-1">
                                                                        <span className="text-sm">{resource.name}</span>
                                                                        <Badge variant="outline" className="text-[10px] uppercase shrink-0">{resource.type}</Badge>
                                                                    </div>
                                                                    {resource.isFree || course.isFree ? (
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                                                            <Download className="h-4 w-4" />
                                                                        </Button>
                                                                    ) : (
                                                                        <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {!course.isFree && (
                                                        <Card className="bg-primary/5 border-primary/20">
                                                            <CardContent className="pt-6 text-center space-y-4">
                                                                <div className="text-2xl font-bold text-primary">₹{course.price}</div>
                                                                <Button className="w-full w-full" onClick={() => handlePayment(course.title, course.price)}>
                                                                    Buy Now with Razorpay
                                                                </Button>
                                                                <p className="text-xs text-muted-foreground">Secure payment via UPI, Card, or Netbanking</p>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            No courses found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
