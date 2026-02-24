
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  Trash2, 
  Loader2,
  AlertTriangle,
  CreditCard,
  History,
  Zap,
  CheckCircle2,
  Coins,
  Crown,
  Gift,
  Copy,
  Share2,
  MessageCircle,
  Send,
  Users,
  TrendingUp
} from "lucide-react";
import { useAuth, useUser, useFirestore, useDoc } from "@/firebase";
import { signOut, deleteUser } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [copied, setCopied] = useState(false);

  const userRef = user ? doc(db, "users", user.uid) : null;
  const { data: userData } = useDoc(userRef);

  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    studyReminders: true,
    examUpdates: true
  });

  useEffect(() => {
    if (userData?.settings?.notifications) {
      setNotifications(userData.settings.notifications);
    }
  }, [userData]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/login");
    }
  };

  const handleToggleNotification = async (key: keyof typeof notifications) => {
    if (!user || !db) return;

    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    
    setIsSaving(true);
    updateDoc(doc(db, "users", user.uid), {
      "settings.notifications": newNotifications,
      updatedAt: serverTimestamp()
    })
    .then(() => {
      toast({
        title: "Preference Saved",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} updated.`,
      });
    })
    .catch((err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `users/${user.uid}`,
        operation: 'update',
        requestResourceData: { "settings.notifications": newNotifications }
      }));
    })
    .finally(() => setIsSaving(false));
  };

  const handleDeleteAccount = async () => {
    if (!auth?.currentUser) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(auth.currentUser);
      toast({
        title: "Account Deleted",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Action Required",
        description: "Please re-login to perform this action.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyCode = () => {
    const code = user?.uid?.substring(0, 8).toUpperCase() || "MOCKBOOK10";
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: "Code Copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const plans = [
    {
      name: "Basic Plan",
      monthlyPrice: "₹499",
      yearlyPrice: "₹4,999",
      credits: "1,000 AI Credits",
      features: ["All Chapter Tests", "Basic AI Planner", "PDF Summary"],
      badge: "Individual"
    },
    {
      name: "Pro Member",
      monthlyPrice: "₹1,499",
      yearlyPrice: "₹14,999",
      credits: "10,000 AI Credits",
      features: ["Unlimited Mocks", "Advanced Insights", "Priority Support", "Video Solutions"],
      badge: "Best Value",
      isPopular: true
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-3 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-headline font-bold">Settings</h1>
                  <p className="text-[11px] text-muted-foreground">Manage plan and preferences.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border shadow-sm">
                 <Coins className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                 <div className="text-right">
                   <p className="text-[8px] font-bold text-muted-foreground uppercase leading-none">Balance</p>
                   <p className="text-[11px] font-bold text-yellow-700 leading-none">{(userData?.totalPoints || 0).toLocaleString()} Coins</p>
                 </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <aside className="lg:col-span-3">
                <Card className="shadow-sm border-none bg-white p-1.5">
                  <div className="space-y-0.5">
                    {[
                      { id: "subscriptions", icon: CreditCard, label: "Subscriptions" },
                      { id: "refer", icon: Gift, label: "Refer & Earn" },
                      { id: "billing", icon: History, label: "History" },
                      { id: "notifications", icon: Bell, label: "Notifications" },
                      { id: "security", icon: Shield, label: "Security" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          activeTab === item.id 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </Card>
              </aside>

              <div className="lg:col-span-9 space-y-6">
                {activeTab === "subscriptions" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden border-l-4 border-l-primary">
                      <CardHeader className="p-4 bg-primary/5 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">Plan: {userData?.plan === "premium" ? "Pro" : "Free"}</CardTitle>
                            <p className="text-[10px] text-muted-foreground">Management & status.</p>
                          </div>
                        </div>
                        {userData?.plan === "premium" && (
                          <Badge className="bg-primary text-[8px] font-bold">PRO ACTIVE</Badge>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 grid grid-cols-3 gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">Next Renewal</p>
                          <p className="text-[11px] font-bold">12 Mar 2026</p>
                        </div>
                        <div className="space-y-0.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-center col-span-2">
                          <p className="text-[8px] font-bold text-muted-foreground uppercase">Payment Method</p>
                          <p className="text-[11px] font-bold">Visa ending in 4242</p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={cn("text-xs font-bold", billingCycle === 'monthly' ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <Switch 
                          checked={billingCycle === 'yearly'} 
                          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')} 
                        />
                        <span className={cn("text-xs font-bold", billingCycle === 'yearly' ? "text-foreground" : "text-muted-foreground")}>Yearly <Badge className="ml-1 bg-green-500 text-[8px] h-4">SAVE 20%</Badge></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plans.map((plan) => (
                        <Card key={plan.name} className={cn(
                          "relative overflow-hidden group border shadow-sm transition-all",
                          plan.isPopular && "ring-1 ring-primary border-primary"
                        )}>
                          {plan.isPopular && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg">
                              RECOMMENDED
                            </div>
                          )}
                          <CardHeader className="p-4">
                            <Badge variant="secondary" className="w-fit text-[8px] h-4 mb-1">{plan.badge}</Badge>
                            <CardTitle className="text-sm font-headline font-bold">{plan.name}</CardTitle>
                            <div className="mt-1 flex items-baseline gap-1">
                              <span className="text-xl font-headline font-bold">{billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}</span>
                              <span className="text-[9px] text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-3">
                            <ul className="space-y-1.5">
                              {plan.features.map((feat) => (
                                <li key={feat} className="flex items-center gap-2 text-[10px] text-slate-600">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                                  {feat}
                                </li>
                              ))}
                            </ul>
                            <Button className={cn("w-full font-bold h-8 text-[10px]", plan.isPopular ? "bg-primary" : "bg-slate-900")}>
                              {userData?.plan === (plan.isPopular ? "premium" : "free") ? "Current Plan" : "Upgrade Now"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "refer" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <Card className="bg-gradient-to-br from-primary to-accent text-white border-none shadow-lg overflow-hidden relative">
                      <CardContent className="p-6 space-y-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <Gift className="h-5 w-5" />
                          <Badge variant="secondary" className="bg-white/20 text-white border-none text-[8px] font-bold">GIVE 500, GET 500</Badge>
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-2xl font-headline font-bold">Invite Friends</h2>
                          <p className="text-white/80 text-[11px]">Both get 500 coins instantly when they join with your code.</p>
                        </div>
                        <div className="p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col sm:flex-row items-center gap-2">
                          <div className="flex-1 px-3 py-1 text-center sm:text-left">
                            <p className="text-[8px] font-bold uppercase opacity-60">Your Code</p>
                            <p className="text-lg font-mono font-bold">{user?.uid?.substring(0, 8).toUpperCase() || "MOCKBOOK10"}</p>
                          </div>
                          <Button 
                            onClick={handleCopyCode}
                            className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold h-9 px-4 text-xs"
                          >
                            {copied ? <CheckCircle2 className="h-3 w-3 mr-2" /> : <Copy className="h-3 w-3 mr-2" />}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="shadow-sm border-none bg-white">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-bold">Quick Share</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 grid grid-cols-2 gap-2">
                          {[
                            { name: "WhatsApp", icon: MessageCircle, color: "bg-green-500" },
                            { name: "Telegram", icon: Send, color: "bg-blue-400" },
                          ].map((social) => (
                            <Button 
                              key={social.name}
                              variant="outline" 
                              className={cn("h-10 flex flex-col items-center justify-center gap-0.5 border-none text-white", social.color)}
                            >
                              <social.icon className="h-3 w-3" />
                              <span className="text-[9px] font-bold">{social.name}</span>
                            </Button>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="shadow-sm border-none bg-white">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-bold">Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground">Gold Milestone</span>
                            <span className="text-primary">8/20 Friends</span>
                          </div>
                          <Progress value={40} className="h-1.5" />
                          <p className="text-[9px] text-center text-muted-foreground">Invite 12 more for Gold Badge!</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <Card className="shadow-sm border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Bell className="h-3.5 w-3.5 text-primary" /> Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      {[
                        { id: "push", label: "Push Alerts", desc: "Mobile/Browser notifications." },
                        { id: "studyReminders", label: "Study Reminders", desc: "Keep your streak alive." },
                        { id: "examUpdates", label: "Exam Updates", desc: "New mock test alerts." }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-1">
                          <div className="space-y-0.5">
                            <Label className="text-xs font-bold">{item.label}</Label>
                            <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch 
                            checked={notifications[item.id as keyof typeof notifications]} 
                            onCheckedChange={() => handleToggleNotification(item.id as keyof typeof notifications)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {activeTab === "security" && (
                  <Card className="shadow-sm border border-red-100 bg-red-50/30">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-bold text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5" /> Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-[10px] text-red-600/70 leading-relaxed mb-2">
                        Deleting your account will permanently remove all your progress, test attempts, and active subscriptions. This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 h-9 text-[10px] font-bold bg-white" onClick={handleLogout}>
                          <LogOut className="h-3.5 w-3.5 mr-1.5" /> Log Out
                        </Button>
                        <Button variant="destructive" className="flex-1 h-9 text-[10px] font-bold" onClick={handleDeleteAccount} disabled={isDeleting}>
                          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "billing" && (
                   <Card className="shadow-sm border-none">
                     <CardHeader className="p-4">
                       <CardTitle className="text-sm font-bold flex items-center gap-2">
                         <History className="h-3.5 w-3.5 text-primary" /> Billing History
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="p-4 pt-0">
                       <div className="text-center py-8">
                         <History className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                         <p className="text-xs font-medium text-muted-foreground">No recent transactions found.</p>
                       </div>
                     </CardContent>
                   </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
