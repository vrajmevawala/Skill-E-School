import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiGoogle } from "react-icons/si";
import { ArrowLeft, Loader2, Mail, RotateCw, Eye, EyeOff, GraduationCap, Users, User, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

// Schema for Login
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Schema for Register
const registerSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 characters"),
    lastName: z.string().min(1, "Last Name must be at least 1 character"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().optional(),
    role: z.enum(["STUDENT", "TRAINER"]),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register, verifyOtp, resendOtp, isLoading, error, clearError } = useAuthStore();
    const { toast } = useToast();

    // Determine initial state
    const isRegisterRoute = location.pathname === "/register";
    const isOtpRoute = location.pathname === "/verify-otp";

    const [activeTab, setActiveTab] = useState(isRegisterRoute ? "register" : "login");
    const [view, setView] = useState<"auth" | "otp">(isOtpRoute ? "otp" : "auth");
    const [emailForOtp, setEmailForOtp] = useState((location.state as any)?.email || "");
    const [showPassword, setShowPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            role: "STUDENT",
            password: "",
            confirmPassword: ""
        },
    });

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Handle view changes based on navigation
    useEffect(() => {
        if (location.pathname === "/verify-otp") {
            if (!emailForOtp) {
                navigate("/register");
            } else {
                setView("otp");
            }
        } else {
            setView("auth");
            setActiveTab(location.pathname === "/register" ? "register" : "login");
        }
    }, [location.pathname, emailForOtp, navigate]);

    async function onLogin(data: z.infer<typeof loginSchema>) {
        clearError();
        const searchParams = new URLSearchParams(location.search);
        const shouldRedirectToCourses = searchParams.get("course") === "true";

        try {
            const result = await login(data.email, data.password);
            if (result.needsOtp) {
                setEmailForOtp(data.email);
                navigate("/verify-otp", { state: { email: data.email } });
            } else {
                const user = useAuthStore.getState().user;
                if (user?.role === "ADMIN") {
                    navigate("/admin");
                } else if (shouldRedirectToCourses) {
                    navigate("/courses");
                } else {
                    navigate("/");
                }
                toast({
                    title: "Welcome back!",
                    description: "You have successfully logged in.",
                });
            }
        } catch { /* handled in store */ }
    }

    async function onRegister(data: z.infer<typeof registerSchema>) {
        clearError();
        try {
            const { confirmPassword, ...rest } = data;
            const result = await register(rest as any);
            if (result.needsOtp) {
                setEmailForOtp(data.email);
                navigate("/verify-otp", { state: { email: data.email } });
                toast({
                    title: "OTP Sent",
                    description: "Please check your email for the verification code.",
                });
            }
        } catch { /* handled in store */ }
    }

    async function handleOtpSubmit(code: string) {
        if (code.length !== 6) return;
        clearError();
        const searchParams = new URLSearchParams(location.search);
        const shouldRedirectToCourses = searchParams.get("course") === "true";

        try {
            await verifyOtp(emailForOtp, code);
            const user = useAuthStore.getState().user;
            if (user?.role === "ADMIN") {
                navigate("/admin");
            } else if (shouldRedirectToCourses) {
                navigate("/courses");
            } else {
                navigate("/");
            }
            toast({
                title: "Account Verified",
                description: "Welcome to Skill E-School!",
            });
        } catch { /* handled in store */ }
    }

    async function handleResend() {
        if (resendCooldown > 0) return;
        clearError();
        try {
            await resendOtp(emailForOtp);
            setResendCooldown(60);
            toast({
                title: "OTP Resent",
                description: "A new code has been sent to your email.",
            });
        } catch { /* handled in store */ }
    }

    const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

    return (
        <div className="min-h-screen w-full flex overflow-hidden bg-gray-50">
            {/* Left Side - Hero Section */}
            <div className="relative hidden lg:flex w-1/2 flex-col bg-muted p-12 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gray-900" />
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop"
                        alt="Join Skill E-School"
                        className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                </div>

                <div className="relative z-20 flex items-center text-2xl font-bold tracking-tight">
                    <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-600/20">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        Skill E-School
                    </Link>
                </div>

                <div className="relative z-20 mt-auto max-w-lg">
                    <div className="bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                        <blockquote className="space-y-4">
                            <p className="text-3xl font-medium leading-tight">
                                "The best investment you can make is in yourself. Unlock your potential with our expert-led courses."
                            </p>
                            <footer className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                                    <ShieldCheck className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">Blended Learning Platform</div>
                                    <div className="text-white/60 text-sm">Join 10,000+ students worldwide</div>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            {/* Right Side - Forms */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-[480px] space-y-8 py-8 px-2">
                    <div className="flex justify-center mb-2 lg:hidden">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20 group">
                            <GraduationCap className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            {view === "otp" ? "Verify your email" : activeTab === "login" ? "Welcome back" : "Join the academy"}
                        </h1>
                        <p className="text-gray-500">
                            {view === "otp"
                                ? "Enter the 6-digit code sent to your inbox"
                                : activeTab === "login"
                                    ? "Stay updated on your learning progress"
                                    : "Create an account to start your learning journey"
                            }
                        </p>
                    </div>

                    {view === "auth" ? (
                        <div className="space-y-6">
                            <Tabs value={activeTab} onValueChange={(v) => {
                                setActiveTab(v);
                                navigate(v === "login" ? "/login" : "/register");
                                clearError();
                            }} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-xl">
                                    <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-500 font-medium">Login</TabsTrigger>
                                    <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-500 font-medium">Register</TabsTrigger>
                                </TabsList>

                                {error && (
                                    <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5 text-xs font-bold">!</div>
                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                    </div>
                                )}

                                <TabsContent value="login" className="space-y-6 mt-6">
                                    <Form {...loginForm}>
                                        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                            <FormField
                                                control={loginForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={labelClass}>Email Address</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                                                                <Input placeholder="name@example.com" className={cn(inputClass, "pl-10")} {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={labelClass}>Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input type={showPassword ? "text" : "password"} className={cn(inputClass, "pr-10")} {...field} />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-400 hover:text-gray-600 cursor-pointer"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-base font-semibold rounded-lg transition-colors cursor-pointer mt-2" disabled={isLoading}>
                                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In to Academy"}
                                            </Button>
                                        </form>
                                    </Form>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-gray-200" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-gray-50 px-4 text-gray-500 font-medium">Or continue with</span>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full h-11 rounded-lg border-gray-300 bg-white shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium cursor-pointer">
                                        <SiGoogle className="mr-3 h-4 w-4" />
                                        Google Account
                                    </Button>
                                </TabsContent>

                                <TabsContent value="register" className="space-y-6 mt-6">
                                    <Form {...registerForm}>
                                        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={registerForm.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={labelClass}>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="John" className={inputClass} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={registerForm.control}
                                                    name="lastName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={labelClass}>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Doe" className={inputClass} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* <FormField
                                                control={registerForm.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <FormLabel className={labelClass}>Join as a</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                className="grid grid-cols-2 gap-4"
                                                            >
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <RadioGroupItem value="STUDENT" className="peer sr-only" />
                                                                    </FormControl>
                                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 transition-all cursor-pointer">
                                                                        <Users className="mb-2 h-6 w-6 text-gray-500 peer-data-[state=checked]:text-indigo-600" />
                                                                        <span className="text-sm font-semibold">Student</span>
                                                                    </FormLabel>
                                                                </FormItem>
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <RadioGroupItem value="TRAINER" className="peer sr-only" />
                                                                    </FormControl>
                                                                    <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 transition-all cursor-pointer">
                                                                        <User className="mb-2 h-6 w-6 text-gray-500 peer-data-[state=checked]:text-indigo-600" />
                                                                        <span className="text-sm font-semibold">Trainer</span>
                                                                    </FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            /> */}

                                            <FormField
                                                control={registerForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={labelClass}>Email Address</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                                                                <Input placeholder="john@example.com" className={cn(inputClass, "pl-10")} {...field} />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={registerForm.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={labelClass}>Password</FormLabel>
                                                            <FormControl>
                                                                <Input type="password" placeholder="••••••••" className={inputClass} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={registerForm.control}
                                                    name="confirmPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className={labelClass}>Confirm</FormLabel>
                                                            <FormControl>
                                                                <Input type="password" placeholder="••••••••" className={inputClass} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-base font-semibold rounded-lg transition-colors cursor-pointer mt-2" disabled={isLoading}>
                                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                                            </Button>
                                        </form>
                                    </Form>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-gray-100 shadow-xl bg-white rounded-2xl overflow-hidden">
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto mb-4 w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center transform rotate-3 shadow-inner">
                                        <Mail className="h-10 w-10 text-indigo-600 -rotate-3" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">Security Check</CardTitle>
                                    <CardDescription className="text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                                        We've sent a 6-digit verification code to
                                        <span className="block font-semibold text-gray-900 mt-1">{emailForOtp}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 py-6">
                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                                            <p className="text-sm text-red-600 font-medium text-center w-full">{error}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-center scale-110 md:scale-125 py-4">
                                        <InputOTP maxLength={6} onComplete={handleOtpSubmit} disabled={isLoading}>
                                            <InputOTPGroup className="gap-2 md:gap-3">
                                                <InputOTPSlot index={0} className="h-12 w-10 md:h-14 md:w-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500" />
                                                <InputOTPSlot index={1} className="h-12 w-10 md:h-14 md:w-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500" />
                                                <InputOTPSlot index={2} className="h-12 w-10 md:h-14 md:w-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500" />
                                                <InputOTPSlot index={3} className="h-12 w-10 md:h-14 md:w-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500" />
                                                <InputOTPSlot index={4} className="h-12 w-10 md:h-14 md:w-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500" />
                                                <InputOTPSlot index={5} className="h-12 w-10 md:h-14 md:w-12 rounded-lg border-2 border-gray-300 focus:border-indigo-500" />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    <div className="text-center space-y-4">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleResend}
                                            disabled={resendCooldown > 0 || isLoading}
                                            className="rounded-full px-6 h-10 font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                        >
                                            <RotateCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                                            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-6">
                                    <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-900 cursor-pointer" onClick={() => navigate("/login")}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Use a different email address
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}

                    <div className="text-center space-y-4 pt-4">
                        <p className="px-8 text-xs text-gray-400 leading-relaxed max-w-[320px] mx-auto">
                            By continuing, you agree to our{" "}
                            <Link to="/terms" className="underline underline-offset-4 font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="underline underline-offset-4 font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
