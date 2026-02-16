import { Calendar, Users, Target, Award, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
    const directors = [
        {
            name: "Dr. Sarah Johnson",
            role: "Founder & CEO",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
            bio: "Former Harvard professor with 15+ years in EdTech. Passionate about democratizing education."
        },
        {
            name: "Mr. David Chen",
            role: "Director of Education",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
            bio: "Curriculum expert who has designed learning frameworks for Fortune 500 companies."
        },
        {
            name: "Ms. Priya Patel",
            role: "Head of Franchise Operations",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
            bio: "Expert in scaling business operations with a focus on partner success and quality assurance."
        }
    ];

    const galleryImages = [
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544531696-285e19788d91?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop"
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                <div className="container px-4 mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Empowering Future Leaders</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Skill E-School is bridging the gap between traditional education and industry demands through a blended learning ecosystem.
                    </p>
                </div>
            </section>

            {/* Company Mission & Vision */}
            <section className="py-16">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                            <p className="text-lg text-muted-foreground">
                                To provide accessible, high-quality skill development programs that empower individuals to achieve their career aspirations and entrepreneurs to build successful education businesses.
                            </p>
                            <div className="pt-4 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Student-Centric</h3>
                                        <p className="text-muted-foreground">Personalized learning paths for every student.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                        <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Excellence Driven</h3>
                                        <p className="text-muted-foreground">Commitment to highest standards of education.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl transform rotate-3"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                                alt="Team working"
                                className="relative rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Directors Section */}
            <section className="py-16 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Meet Our Visionaries</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            The leadership team behind Skill E-School's innovation and growth.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {directors.map((director, index) => (
                            <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-background">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={director.image}
                                        alt={director.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <CardHeader className="text-center pb-2">
                                    <CardTitle className="text-xl">{director.name}</CardTitle>
                                    <CardDescription className="text-primary font-medium">{director.role}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center text-muted-foreground">
                                    <p>{director.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Gallery */}
            <section className="py-16">
                <div className="container px-4 mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Life at Skill E-School</h2>
                            <p className="text-muted-foreground">Highlights from our recent webinars, workshops, and events.</p>
                        </div>
                        <Button variant="outline" className="hidden sm:flex items-center gap-2">
                            View All Gallery <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {galleryImages.map((img, i) => (
                            <div key={i} className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                                    <p className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">Event Highlight</p>
                                </div>
                                <img
                                    src={img}
                                    alt={`Event ${i + 1}`}
                                    className="w-full h-full object-cover min-h-[200px] hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            {/* <section className="py-20 bg-primary text-primary-foreground">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Future?</h2>
                    <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
                        Join thousands of students and partners who are part of the Skill E-School revolution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="font-semibold text-primary">
                            Browse Courses
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                            Contact Us
                        </Button>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
