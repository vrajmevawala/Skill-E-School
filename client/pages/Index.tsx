import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Video, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Zap,
  ShieldCheck,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { courseService } from "@/services/course.service";
import { webinarService } from "@/services/webinar.service";
import { useAuthStore } from "@/store/auth";

export default function Index() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [highlightWebinar, setHighlightWebinar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, webinarsRes] = await Promise.all([
          courseService.getAll("limit=4"),
          webinarService.getAll()
        ]);
        
        setFeaturedCourses(coursesRes.courses || []);
        if (webinarsRes.webinars && webinarsRes.webinars.length > 0) {
          // Find the soonest upcoming webinar
          const upcoming = webinarsRes.webinars.filter((w: any) => new Date(w.date) > new Date());
          setHighlightWebinar(upcoming[0] || webinarsRes.webinars[0]);
        }
      } catch (err) {
        console.error("Failed to fetch landing page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const partners = [
    { name: "LIC", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4xlS2xfNvx6AwD8gHu0lpvU9Ssp3jAeV3Hg&s" },
    { name: "Tata Capital", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY97gYHZS5snyYNhBx7WHUPjkE6rEg7fjqkg&s" },
    { name: "Bank of Baroda", logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/BankOfBarodaLogo.svg" },
    { name: "Central Bank", logo: "https://wp.logos-download.com/wp-content/uploads/2022/11/Central_Bank_of_India_Logo.png?dl" },
    { name: "HDFC Life", logo: "https://hdfc-international.digiqt.com/_next/static/media/logo.8c036a54.png" },
    { name: "Bajaj FinServ", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnYzFyD1m5gWpzZpvTFhKfKQJqRTCygVPoUQ&s" },
    { name: "HPCL", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0KlpkftVZnoIt82QHzxBAFwaV1EG85baIDw&s" },
    { name: "Indian Oil", logo: "https://companieslogo.com/img/orig/IOC.NS-081204c8.png?t=1727429249" },
    { name: "JCI India", logo: "https://control.jciindia.in/lib/assets/website/images/JCI_India_logo.webp" },
    { name: "Vestige", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo9ttoIFa6rzg8B7xeOzuXd10sXwRJ7ICalw&s" },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-[#0f172a] hover:bg-primary text-white">
                The Future of Blended Learning
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Empower Your Future with <span className="text-primary ">Skill E-School</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                A comprehensive platform for modern learners and aspiring entrepreneurs. Master new skills, attend live webinars, and manage your own education franchise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="text-lg px-8 py-6 h-auto hover:bg-[#0f172a] hover:text-white" asChild>
                  <Link to={isAuthenticated ? "/courses" : "/login?course=true"}>
                    Start Learning Now
                    <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto" asChild>
                  <Link to="/franchise">Explore Franchise Opps</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                    +99
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Joined by 100+ students 
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Learning together" 
                  className="w-full h-auto"
                />
                {highlightWebinar && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                    <div className="flex items-center gap-4 text-white">
                      <div className="bg-primary p-3 rounded-full">
                        <Video className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Live Webinar: {highlightWebinar.title}</p>
                        <p className="text-sm text-white/80">
                          {new Date(highlightWebinar.date) > new Date() 
                            ? `Scheduled for ${new Date(highlightWebinar.date).toLocaleDateString()}` 
                            : "Available on-demand"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#0f172a] border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">10+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Courses</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">100+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Students</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">95%</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Comprehensive Learning Ecosystem</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide the tools, content, and community to help you succeed in the digital economy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>LMS & Webinars</CardTitle>
                <CardDescription>
                  Access high-quality video courses with DRM protection and join live interactive webinars.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Secure Video Streaming</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Automated Certificates</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> WhatsApp Workflows</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-primary text-primary-foreground">
              <CardHeader>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Consultancy Hub</CardTitle>
                <CardDescription className="text-white/80">
                  Book 1-on-1 mentorship sessions with experts to accelerate your learning journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-white/40" /> Google Calendar Sync</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-white/40" /> 1-on-1 Private Booking</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-white/40" /> Payment Gated Access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Franchise Module</CardTitle>
                <CardDescription>
                  Start your own business with our franchise portal. Track leads, events, and commissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Dedicated Portal</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Lead Management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Payout Tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Courses</h2>
              <p className="text-lg text-slate-600 max-w-2xl">
                Start your journey with our most popular skill-building programs.
              </p>
            </div>
            <Link to="/courses">
              <Button variant="ghost" className="hidden md:flex">
                View All Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course, idx) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <Card className="overflow-hidden group h-full hover:shadow-lg transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">
                        {course.category?.name || "Premium"}
                      </Badge>
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription>
                        By {course.trainer?.profile ? `${course.trainer.profile.firstName} ${course.trainer.profile.lastName}` : "Expert Instructor"}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
                      <span className="font-bold text-lg text-primary">{course.isFree ? "FREE" : `₹${course.price}`}</span>
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>{course.level}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Franchise CTA */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 transform translate-x-1/4"></div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="text-primary border-primary">
                Franchise Opportunity
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Empower Your Community as a <span className="text-primary">Franchise Partner</span>
              </h2>
              <p className="text-lg text-slate-300">
                Join our network of successful franchises. We provide the technology, content, and leads while you manage local growth and mentoring.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Exclusive Territory</h4>
                    <p className="text-sm text-slate-400">Manage a dedicated region for lead generation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Quick Payouts</h4>
                    <p className="text-sm text-slate-400">Automated commission tracking and monthly payouts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Admin Support</h4>
                    <p className="text-sm text-slate-400">24/7 technical and operational dashboard support.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Local Events</h4>
                    <p className="text-sm text-slate-400">Host your own workshops with our platform tools.</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-6 h-auto text-lg">
                <Link to='/franchise'>
                  Apply for Franchise 
                </Link>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Franchise Dashboard</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-none">Live Data</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-400 uppercase">Monthly Earnings</p>
                      <p className="text-2xl font-bold mt-1">₹45,250</p>
                      <p className="text-[10px] text-green-400 mt-1">+12% from last month</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-400 uppercase">Active Leads</p>
                      <p className="text-2xl font-bold mt-1">128</p>
                      <p className="text-[10px] text-primary mt-1">15 new today</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-300">Upcoming Local Events</p>
                    {[1, 2].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center text-primary font-bold">
                            {i === 1 ? '14' : '22'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Digital Marketing Workshop</p>
                            <p className="text-xs text-slate-500">Tech Hub Center • 2:00 PM</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs text-primary">Details</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Sliding Partners Overlay */}
      <section className="py-16 bg-white border-t overflow-hidden">
        <div className="container mb-12">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-primary uppercase tracking-widest">Global Partnerships</p>
            <p className="text-slate-500 max-w-2xl mx-auto italic font-serif">Trusted by world-class financial institutions, energy leaders, and major consumer brands.</p>
          </div>
        </div>
        
        <div className="relative flex overflow-hidden group">
          {/* Continuous scrolling container */}
          <div className="animate-marquee flex gap-12 items-center whitespace-nowrap min-w-full">
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className="flex flex-col items-center justify-center min-w-[160px] px-4">
                <div className="h-20 flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="max-h-full max-w-full object-contain filter-none drop-shadow-md" 
                  />
                </div>
                <p className="mt-4 text-[11px] font-bold text-slate-500 tracking-wider font-serif uppercase text-center">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
