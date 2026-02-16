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
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
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
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                The Future of Blended Learning
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Empower Your Future with <span className="text-primary">Skill E-School</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                A comprehensive platform for modern learners and aspiring entrepreneurs. Master new skills, attend live webinars, and manage your own education franchise.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  <Link to="/login">Start Learning Now</Link>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
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
                    +2k
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Joined by 2,000+ students & 50+ franchisees
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                  <div className="flex items-center gap-4 text-white">
                    <div className="bg-primary p-3 rounded-full">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Live Webinar: UI/UX Masterclass</p>
                      <p className="text-sm text-white/80">Starting in 45 minutes • 240+ registered</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Courses</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">1k+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Students</p>
            </div>
            {/* <div className="text-center space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">80+</p>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Franchises</p>
            </div> */}
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
            <Button variant="ghost" className="hidden md:flex">
              View All Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Full-Stack Web Dev",
                instructor: "Alex Rivers",
                price: "$199",
                rating: "4.9",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
                badge: "Bestseller"
              },
              {
                title: "Digital Marketing Pro",
                instructor: "Sarah Chen",
                price: "$149",
                rating: "4.8",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
                badge: "Hot"
              },
              {
                title: "Data Science with Python",
                instructor: "Dr. James Wilson",
                price: "$249",
                rating: "4.9",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
                badge: "Advanced"
              },
              {
                title: "UI/UX Design Master",
                instructor: "Emma Watson",
                price: "$179",
                rating: "4.7",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600",
                badge: "New"
              }
            ].map((course, idx) => (
              <Card key={idx} className="overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-primary hover:bg-white">{course.badge}</Badge>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>By {course.instructor}</CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <span className="font-bold text-lg text-primary">{course.price}</span>
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>{course.rating}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                Join our network of 80+ successful franchises. We provide the technology, content, and leads while you manage local growth and mentoring.
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
                      <p className="text-2xl font-bold mt-1">$4,250</p>
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

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Our Partnerships</p>
            <h2 className="text-2xl font-bold text-slate-400">Trusted by leading educational institutions worldwide</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png" alt="Google" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png" alt="Meta" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" alt="Amazon" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" alt="Netflix" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Apple_logo_grey.svg/1724px-Apple_logo_grey.svg.png" alt="Apple" className="h-8" />
          </div>
        </div>
      </section>
    </div>
  );
}
