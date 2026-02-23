import { useState } from "react";
import { Building2, TrendingUp, Users, CheckCircle, ArrowRight, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

export default function Franchise() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post("/franchise/inquiry", form);
            setSubmitted(true);
        } catch (err: any) {
            alert(err.message || "Failed to submit inquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
        {
            icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
            title: "Proven Business Model",
            description: "Leverage our established brand and successful operational framework to minimize risk and maximize ROI."
        },
        {
            icon: <Users className="w-10 h-10 text-green-600" />,
            title: "Comprehensive Support",
            description: "Get end-to-end assistance with setup, hiring, training, and marketing to ensure your center's success."
        },
        {
            icon: <Building2 className="w-10 h-10 text-purple-600" />,
            title: "Regional Exclusivity",
            description: "Operate with exclusive rights in your designated territory, reducing competition and securing your market."
        }
    ];

    const processSteps = [
        { title: "Application", desc: "Submit your details via the form below." },
        { title: "Screening", desc: "Our team reviews your profile and financial eligibility." },
        { title: "Meeting", desc: "Discussion on business plan and territory finalization." },
        { title: "Agreement", desc: "Sign the franchise agreement and pay the license fee." },
        { title: "Launch", desc: "Setup, training, and grand opening of your center." }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-primary text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
                <div className="container px-4 mx-auto relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                            Partner with the Leader in Education
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                            Start your own Skill E-School center and transform lives in your community while building a profitable business.
                        </p>
                        <Button size="lg" variant="secondary" className="font-bold text-primary hover:bg-white/90">
                            Apply for Franchise
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Choose Skill E-School?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We provide everything you need to build a thriving education business.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader className="flex flex-col items-center text-center pb-2">
                                    <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                                        {benefit.icon}
                                    </div>
                                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center text-muted-foreground">
                                    <p>{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How to Get Started</h2>
                        <p className="text-muted-foreground">Your journey to becoming a franchise partner in 5 simple steps.</p>
                    </div>
                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                            {processSteps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg border-4 border-background">
                                        {index + 1}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form Section */}
            <section className="py-20 bg-muted/50">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Inquire Now</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Ready to take the next step? Fill out the form and our franchise development team will contact you within 24 hours.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Low Investment, High Returns</h3>
                                        <p className="text-muted-foreground text-sm">Optimized setup costs with multiple revenue streams.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Marketing Support</h3>
                                        <p className="text-muted-foreground text-sm">National branding and local lead generation assistance.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Academic Excellence</h3>
                                        <p className="text-muted-foreground text-sm">World-class curriculum and certified trainer pool.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card className="shadow-xl">
                            <CardHeader>
                                <CardTitle>Franchise Inquiry Form</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {submitted ? (
                                    <div className="text-center py-8 space-y-4">
                                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                                        <h3 className="text-xl font-bold">Application Submitted!</h3>
                                        <p className="text-muted-foreground">Our franchise development team will contact you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" placeholder="John" value={form.firstName} onChange={update("firstName")} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={update("lastName")} required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={update("email")} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={update("phone")} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Proposed City</Label>
                                            <Input id="city" placeholder="Mumbai, Bangalore, etc." value={form.city} onChange={update("city")} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message (Optional)</Label>
                                            <Textarea id="message" placeholder="Tell us about your background..." value={form.message} onChange={update("message")} />
                                        </div>
                                        <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
