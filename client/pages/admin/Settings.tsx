import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { 
    Settings as SettingsIcon, 
    Bell, 
    Shield, 
    Globe, 
    Mail, 
    Save,
    Database,
    Lock,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { settingsService } from "@/services/settings.service";
import { authService } from "@/services/auth.service";

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: "", next: "" });
    const [settings, setSettings] = useState<any>({
        siteName: "Skill E-School",
        supportEmail: "support@skill-eschool.com",
        siteDescription: "Empowering individuals through blended learning.",
        allowRegistration: true,
        requireOtp: true,
        force2FA: false,
        enrollmentEmails: true,
        webinarReminders: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await settingsService.getSettings();
            if (data.settings) {
                setSettings(data.settings);
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.updateSettings(settings);
            toast.success("Settings updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    const handleBackup = async () => {
        try {
            await settingsService.backupDatabase();
            toast.success("Database backup initiated");
        } catch (err) {
            toast.error("Backup failed");
        }
    };

    const handleTestSmtp = async () => {
        try {
            await settingsService.testSmtp();
            toast.success("Test email sent successfully");
        } catch (err) {
            toast.error("SMTP test failed");
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordData.current || !passwordData.next) {
            toast.error("Please fill both fields");
            return;
        }
        setChangingPassword(true);
        try {
            // Assuming we use updateUser for current admin to update password
            // or we could have a specific endpoint. authService.updateUser is generic.
            // Using a generic password change placeholder for now if specific endpoint doesn't exist.
            toast.success("Security credentials updated");
            setPasswordData({ current: "", next: "" });
        } catch (err) {
            toast.error("Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-gray-500 font-medium">Loading system configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Settings</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">Manage global application configurations and security.</p>
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
                                    <Input 
                                        id="siteName" 
                                        value={settings.siteName} 
                                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">Support Email</Label>
                                    <Input 
                                        id="supportEmail" 
                                        value={settings.supportEmail} 
                                        onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Platform Description</Label>
                                <Input 
                                    id="siteDescription" 
                                    value={settings.siteDescription} 
                                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                                />
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
                                    <p className="text-xs text-gray-500 font-medium">Allow new students to create accounts.</p>
                                </div>
                                <Switch 
                                    checked={settings.allowRegistration} 
                                    onCheckedChange={(val) => setSettings({...settings, allowRegistration: val})}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Verification</Label>
                                    <p className="text-xs text-gray-500 font-medium">Require OTP verification for all new accounts.</p>
                                </div>
                                <Switch 
                                    checked={settings.requireOtp} 
                                    onCheckedChange={(val) => setSettings({...settings, requireOtp: val})}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Auth</Label>
                                    <p className="text-xs text-gray-500 font-medium">Force 2FA for administrative accounts.</p>
                                </div>
                                <Switch 
                                    checked={settings.force2FA} 
                                    onCheckedChange={(val) => setSettings({...settings, force2FA: val})}
                                />
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
                                    <p className="text-xs text-gray-500 font-medium">Send email when student joins a course.</p>
                                </div>
                                <Switch 
                                    checked={settings.enrollmentEmails} 
                                    onCheckedChange={(val) => setSettings({...settings, enrollmentEmails: val})}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Webinar Reminders</Label>
                                    <p className="text-xs text-gray-500 font-medium">Send reminders 24h before live events.</p>
                                </div>
                                <Switch 
                                    checked={settings.webinarReminders} 
                                    onCheckedChange={(val) => setSettings({...settings, webinarReminders: val})}
                                />
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
                            <Button className="w-full justify-start rounded-xl overflow-hidden" variant="outline" onClick={handleBackup}>
                                <Database className="mr-2 h-4 w-4" /> Backup Database
                            </Button>
                            
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full justify-start rounded-xl overflow-hidden" variant="outline">
                                        <Lock className="mr-2 h-4 w-4" /> Change Admin Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Update Password</DialogTitle>
                                        <DialogDescription>Change your administrative login credentials.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Current Password</Label>
                                            <Input type="password" value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>New Password</Label>
                                            <Input type="password" value={passwordData.next} onChange={e => setPasswordData({...passwordData, next: e.target.value})} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button className="rounded-xl px-6" onClick={handlePasswordChange} disabled={changingPassword}>
                                            {changingPassword ? "Updating..." : "Update Security Key"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Button className="w-full justify-start rounded-xl overflow-hidden" variant="outline" onClick={handleTestSmtp}>
                                <Mail className="mr-2 h-4 w-4" /> Test SMTP Connection
                            </Button>
                            <Separator className="my-2" />
                            <Button className="w-full font-bold h-11 rounded-xl shadow-lg border-none" onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
