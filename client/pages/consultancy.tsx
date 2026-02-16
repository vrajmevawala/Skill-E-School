import { Calendar as CalendarIcon, Clock, Star, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const consultants = [
    {
        id: 1,
        name: "Mr. Rohan Mehta",
        role: "Business Consultant",
        specialization: ["Startup Strategy", "Funding", "Operations"],
        rate: 3000,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
        availability: "Tue, Thu"
    }
];

export default function Consultancy() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const handleBooking = (consultantName: string, rate: number) => {
        if (!date) {
            alert("Please select a date first.");
            return;
        }
        alert(`Booking session with ${consultantName} on ${format(date, "PPP")} for ₹${rate}. Redirecting to payment...`);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <section className="py-16 bg-primary/5 text-center">
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Expert Consultancy Hub</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Get personalized 1-on-1 guidance from top industry professionals.
                    </p>
                </div>
            </section>

            <div className="container px-4 mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {consultants.map((expert) => (
                        <Card key={expert.id} className="hover:shadow-lg transition-transform hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={expert.image} alt={expert.name} />
                                    <AvatarFallback>{expert.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                                    <CardDescription className="text-primary font-medium">{expert.role}</CardDescription>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" /> {expert.rating}/5.0
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-muted-foreground">Specializations:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {expert.specialization.map((spec, i) => (
                                            <Badge key={i} variant="outline" className="bg-background">{spec}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>60 Mins</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-primary" />
                                        <span>Video Call</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Date</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between pt-2 border-t mt-auto">
                                <div>
                                    <span className="text-2xl font-bold">₹{expert.rate}</span>
                                    <span className="text-xs text-muted-foreground block">per session</span>
                                </div>
                                <Button asChild>
                                    <a href="https://docs.google.com/forms" target="_blank" rel="noopener noreferrer">
                                        Book now
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
