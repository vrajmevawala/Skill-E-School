import { ArrowRight, Target, Zap, ShieldCheck, Users, BookOpen, Briefcase, GraduationCap, TrendingUp, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const coachImages = [
    "/61465858_10156183496535849_1214405198399668224_n.jpg",
    "/471425709_10160675043110849_7959487190124022316_n.jpg",
    "/506409500_10161201046550849_7975609778955057473_n.jpg",
    "/512908440_10161267106675849_6340571892528638280_n.jpg",
    "/516453903_10161331407660849_3917385239120873303_n (1).jpg",
    "/517541795_10161330965360849_3841731982198065586_n (1).jpg"
  ];

  return (
    <div className="flex flex-col w-full bg-white font-serif">
      {/* Hero Section - Meet Your Coach (Reduced Size) */}
      <section className="relative py-12 md:py-16 bg-slate-50 overflow-hidden border-b">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="space-y-3">
                <Badge variant="secondary" className="bg-[#0f172a] text-white px-3 py-0.5 text-xs font-medium hover:bg-primary">
                  Meet Your Coach
                </Badge>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  The Man Behind 
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mt-2"><span className="text-primary">Skill E-School</span></h1>
                </h1>
              </div>

              <div className="space-y-4 text-base md:text-lg text-slate-700 leading-relaxed italic">
                <p>
                  Parijat Dave is not a motivational speaker. He is a Business Growth Coach — a distinction that matters profoundly. For over three decades, he has been inside real businesses, helping solopreneurs and professionals break invisible ceilings.
                </p>
                <p>
                  His journey of 30+ years in sales and marketing deepening his conviction that the gap between where most business owners are and where they want to be is not a gap of intelligence—it is a gap of system.
                </p>
              </div>

              <div className="p-6 bg-[#0f172a] text-white rounded-xl border-l-4 border-primary shadow-lg">
                <p className="text-lg md:text-xl font-medium italic mb-2">
                  "The most powerful investment you will ever make is not in your business — it is in the mind that runs your business."
                </p>
                <p className="text-sm font-bold text-primary">— Parijat Dave</p>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-center">
              <div className="relative w-full max-w-[400px]">
                <div className="relative z-10 rounded-xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5]">
                  <img 
                    src={coachImages[0]} 
                    alt="Parijat Dave" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary rounded-xl -z-10 bg-primary/5"></div>
                
                <div className="absolute -top-4 -left-4 bg-white p-4 rounded-lg shadow-md border z-20 hidden md:block">
                  <p className="text-2xl font-bold text-primary">30+</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Years Exp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conviction Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">The Power of Application</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>

            <div className="space-y-8 text-lg text-slate-700 leading-relaxed">
              <p>
                That conviction became Skill E-School — India's most systematic, skill-based business growth school. Built not on borrowed Western frameworks but on the lived reality of Indian professionals navigating the specific challenges and opportunities of the Indian business environment.
              </p>
              <p>
                What makes Parijat different from every other business coach you may have encountered is his unshakeable commitment to application. Every concept he teaches must be applied within 48 hours. Not intended. Not planned. Applied. This single discipline has transformed the results of thousands of business owners who had previously consumed enormous amounts of knowledge with little to show for it.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-12 border-t">
              <div className="text-center space-y-1">
                <p className="font-bold text-primary">30+ Years</p>
                <p className="text-xs text-slate-500 uppercase">Sales & Mktg</p>
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-primary">SES Founder</p>
                <p className="text-xs text-slate-500 uppercase">Skill E-School</p>
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-primary">Gujarat Hub</p>
                <p className="text-xs text-slate-500 uppercase">Ahmedabad</p>
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-primary">Neuroscience</p>
                <p className="text-xs text-slate-500 uppercase">Methodology</p>
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-primary">Pan-India</p>
                <p className="text-xs text-slate-500 uppercase">Coaching Presence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-[#0f172a] text-white">
        <div className="container">
          <div className="text-center space-y-4 mb-20">
            <Badge variant="outline" className="border-primary text-primary px-4 py-1">Vision & Mission</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">Why Skill E-School Exists</h2>
            <p className="text-slate-400 max-w-2xl mx-auto italic">Every word we teach, every programme we build — it all flows from two unbreakable commitments.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-white/5 border-white/10 text-white p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-6 italic">
                To become India's most trusted skill-based business growth school — a place where every business owner, solopreneur, and professional can access frameworks, tools, and a community that transforms their potential into measurable, lasting results.
              </p>
              <p className="text-slate-400">
                We envision an India where business growth is no longer a matter of luck, connections, or inherited advantage — but a learnable, teachable outcome for every professional.
              </p>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-6 italic">
                To equip Indian business owners with practical, skill-based frameworks that deliver real, measurable, and sustainable business growth — by building the mindset, skills, systems, and community.
              </p>
              <p className="text-slate-400">
                We exist to close the gap between knowledge and application — because learning that is not applied within 48 hours fades by more than 75%.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Beliefs & Difference */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-bold text-slate-900">The Skill E-School Difference</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Why Skill E-School produces results that others simply cannot match.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
              { 
                id: "01", 
                title: "Application-First Learning", 
                desc: "No other training system holds you to this standard — apply what you learn within 48 hours to succeed.", 
                icon: <Zap className="h-6 w-6" /> 
              },
              { 
                id: "02", 
                title: "Built for Indian Reality", 
                desc: "Frameworks built from 30 years of coaching Indian professionals navigating specific cultural challenges.", 
                icon: <Globe className="h-6 w-6" /> 
              },
              { 
                id: "03", 
                title: "The Learn-Do-Teach Cycle", 
                desc: "We use neuroscience to ensure you learn with intent to teach, compounding mastery exponentially.", 
                icon: <GraduationCap className="h-6 w-6" /> 
              },
              { 
                id: "04", 
                title: "Community as Curriculum", 
                desc: "Professionals in our community achieve results 2-3x faster than those engaging with content alone.", 
                icon: <Users className="h-6 w-6" /> 
              },
              { 
                id: "05", 
                title: "Measurable Growth", 
                desc: "Every programme defines specific, observable business outcomes. Transformation must become tangible.", 
                icon: <TrendingUp className="h-6 w-6" /> 
              },
              { 
                id: "06", 
                title: "A System, Not a Course", 
                desc: "Mindset, strategy, and performance mastery integrated into one coherent, progressive system.", 
                icon: <Briefcase className="h-6 w-6" /> 
              }
             ].map((feature) => (
              <Card key={feature.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-50 group">
                <CardHeader>
                  <div className="text-4xl font-bold text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">{feature.id}</div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 text-sm leading-relaxed">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
             ))}
          </div>
        </div>
      </section>

      {/* Meet the Expert Section */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src={coachImages[1]} className="rounded-2xl shadow-lg w-full aspect-square object-cover" alt="Coach session" />
                <img src={coachImages[2]} className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover mt-8" alt="Coach feedback" />
              </div>
              <div className="space-y-4 pt-12">
                <img src={coachImages[3]} className="rounded-2xl shadow-lg w-full aspect-[3/4] object-cover" alt="Coach speech" />
                <img src={coachImages[4]} className="rounded-2xl shadow-lg w-full aspect-square object-cover mt-8" alt="Coach community" />
              </div>
            </div>
            
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-900 font-serif">What Parijat Coaches</h3>
                <div className="h-1 w-16 bg-primary"></div>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: "Mindset Architecture", desc: "The 21 shifts that separate consistent growers from perpetual starters." },
                  { title: "Business Growth Systems", desc: "Turning hustle into leverage using proven frameworks." },
                  { title: "Relationship Intelligence", desc: "Building trust-based relationships that compound over time." },
                  { title: "Performance Mastery", desc: "Creating discipline systems that work regardless of mood." },
                  { title: "Community-Led Growth", desc: "Accelerating results through structured peer accountability." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="mt-1"><CheckCircle2 className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600 italic">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-200">
                <h4 className="text-lg font-bold mb-4">Ready to start your journey?</h4>
                <Button size="lg" className="bg-[#0f172a] hover:bg-primary text-white font-bold h-14 px-8" asChild>
                  <a href="/courses">Explore Programs <ArrowRight className="ml-2 h-5 w-5" /></a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Beliefs Bottom Overlay */}
      <section className="py-24 bg-[#0f172a] text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-serif italic text-primary">"Transformation that is not measurable is not transformation"</h2>
            <div className="h-1 w-24 bg-white/20 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              "Every business owner has untapped growth potential waiting to be unlocked — without working harder",
              "Skill-based learning, applied consistently, produces exponential results that motivation alone never can",
              "Mindset shifts must precede and enable every sustainable business strategy",
              "Community, accountability, and peer coaching accelerate individual growth by 2–3x",
              "The Indian business owner deserves frameworks built for their reality — not adapted from elsewhere"
            ].map((belief, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="bg-primary/20 p-2 rounded-full"><CheckCircle2 className="h-4 w-4 text-primary" /></div>
                <p className="text-slate-300 leading-relaxed italic">{belief}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
