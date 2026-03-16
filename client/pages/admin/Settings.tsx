import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
    Settings as SettingsIcon, 
    Bell, 
    Shield, 
    Globe, 
    Mail, 
    Save,
    Database,
    Lock
} from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings updated successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">System Settings</h1>
                <p className="text-sm text-zinc-500 font-medium mt-1">Manage global application configurations and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-bold">General Configuration</CardTitle>
                            </div>
                            <CardDescription>Basic settings for your academy platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input id="siteName" defaultValue="Skill E-School" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input id="supportEmail" defaultValue="support@skill-eschool.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Platform Description</Label>
                                <Input id="siteDescription" defaultValue="Empowering individuals through blended learning." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-bold">Security & Authentication</CardTitle>
                            </div>
                            <CardDescription>Control how users access and interact with the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>User Registration</Label>
                                    <p className="text-xs text-zinc-500 font-medium">Allow new students to create accounts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Verification</Label>
                                    <p className="text-xs text-zinc-500 font-medium">Require OTP verification for all new accounts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Auth</Label>
                                    <p className="text-xs text-zinc-500 font-medium">Force 2FA for administrative accounts.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-bold">Email Notifications</CardTitle>
                            </div>
                            <CardDescription>Configure which automated emails get sent.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enrollment Confirmation</Label>
                                    <p className="text-xs text-zinc-500 font-medium">Send email when student joins a course.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Webinar Reminders</Label>
                                    <p className="text-xs text-zinc-500 font-medium">Send reminders 24h before live events.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" variant="outline">
                                <Database className="mr-2 h-4 w-4" /> Backup Database
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Lock className="mr-2 h-4 w-4" /> Change Admin Password
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Mail className="mr-2 h-4 w-4" /> Test SMTP Connection
                            </Button>
                            <Separator className="my-2" />
                            <Button className="w-full font-bold" onClick={handleSave} disabled={loading}>
                                <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
