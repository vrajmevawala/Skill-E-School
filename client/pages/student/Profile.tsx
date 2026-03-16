import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
    User, 
    Mail, 
    Phone, 
    Camera, 
    Save, 
    Shield, 
    Loader2,
    Calendar,
    GraduationCap,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import { authService } from "@/services/auth.service";

const StudentProfile = () => {
    const user: any = useAuthStore((s) => s.user);
    const setUser = (useAuthStore((s) => s) as any).setUser;
    const [loading, setLoading] = useState(false);
    
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            firstName: user?.profile?.firstName || "",
            lastName: user?.profile?.lastName || "",
            phoneNumber: user?.profile?.phoneNumber || "",
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.profile?.firstName || "",
                lastName: user.profile?.lastName || "",
                phoneNumber: user.profile?.phoneNumber || "",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = await authService.updateProfile(user.id, data);
            setUser({ ...user, profile: res.user.profile });
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container py-10 max-w-5xl space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-sans">Student Profile</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage your personal information and account preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-none px-3 py-1 font-bold">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        ID: {user.id.slice(0, 8)}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Overview */}
                <Card className="md:col-span-1 border-none shadow-sm bg-white border-b-4 border-b-primary overflow-hidden">
                    <div className="h-24 bg-primary/5 w-full absolute top-0 left-0" />
                    <CardContent className="pt-12 text-center relative">
                        <div className="mx-auto h-24 w-24 rounded-3xl bg-primary text-white flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-white mb-4">
                            {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900">{user.profile?.firstName} {user.profile?.lastName}</h2>
                        <p className="text-sm text-zinc-500 font-medium mb-4">{user.email}</p>
                        
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-zinc-50">
                                {user.role}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border-none">
                                Verified
                            </Badge>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-4 text-left">
                           <div className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>{user.email}</span>
                           </div>
                           <div className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>{user.profile?.phoneNumber || "No phone added"}</span>
                           </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                <Card className="md:col-span-2 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-zinc-50 pb-6 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
                        </div>
                        <CardDescription className="text-zinc-500 font-medium">Update your name and contact details.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="font-bold text-zinc-700">First Name</Label>
                                    <Input 
                                        {...register("firstName")}
                                        className="h-11 rounded-xl bg-zinc-50 border-zinc-200"
                                        placeholder="James"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="font-bold text-zinc-700">Last Name</Label>
                                    <Input 
                                        {...register("lastName")}
                                        className="h-11 rounded-xl bg-zinc-50 border-zinc-200"
                                        placeholder="Miller"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="font-bold text-zinc-700">Phone Number</Label>
                                <Input 
                                    {...register("phoneNumber")}
                                    className="h-11 rounded-xl bg-zinc-50 border-zinc-200"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-bold text-zinc-700">Email Address (Locked)</Label>
                                <Input 
                                    value={user.email}
                                    disabled
                                    className="h-11 rounded-xl bg-zinc-100 border-zinc-200 cursor-not-allowed text-zinc-500 opacity-60"
                                />
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Contact support to change your email.</p>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    type="submit" 
                                    className="h-12 w-full md:w-auto px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving Changes
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
            
            {/* Security Section */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <div className="flex items-center gap-2 text-rose-600">
                        <Shield className="h-5 w-5" />
                        <CardTitle className="text-lg font-bold">Account Security</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50">
                        <div>
                            <p className="font-bold text-zinc-900">Password</p>
                            <p className="text-sm text-zinc-500 font-medium mt-0.5">Change your account password for better security.</p>
                        </div>
                        <Button variant="outline" className="rounded-xl font-bold border-zinc-200">
                            Update Password
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentProfile;
