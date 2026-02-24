
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bot, 
  LogIn, 
  Mail, 
  Lock, 
  Sparkles, 
  Loader2, 
  Phone, 
  CheckCircle2, 
  BarChart3, 
  FileSearch,
  Users,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signInAnonymously(auth);
      toast({
        title: "Welcome to Mockbook!",
        description: "You're exploring in demo mode.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Guest Access Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, label: "AI Generation" },
    { icon: FileSearch, label: "PYQ Analysis" },
    { icon: BarChart3, label: "Real Analytics" },
    { icon: Users, label: "Peer Groups" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 gap-12 lg:gap-24 max-w-7xl mx-auto w-full">
        
        {/* Left Side: Marketing/Value Prop */}
        <div className="flex-1 space-y-8 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered Mock Test Platform
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold leading-tight">
              Master Your Exams in <span className="text-primary">Days</span> Not Months
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Personalized mock tests, AI study plans, and real-time performance tracking. 
              Built for serious competitive exam aspirants.
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-700">
                <f.icon className="h-4 w-4 text-primary" />
                {f.label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8 pt-4">
            <div className="space-y-1">
              <p className="text-2xl font-headline font-bold text-primary">95%</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Time Saved</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-headline font-bold text-primary">10K+</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Mocks Created</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-headline font-bold text-primary">500+</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Mock Packs</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full max-w-md relative">
          {/* Background decoration */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

          <Card className="shadow-2xl border-none overflow-hidden bg-white/90 backdrop-blur-xl ring-1 ring-black/5">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2 pb-2">
                <h2 className="text-2xl font-headline font-bold tracking-tight">Get Started Free</h2>
                <p className="text-xs text-muted-foreground">Start your journey to success today</p>
              </div>

              {/* DEMO ACCESS BUTTON - HIGHLIGHTED */}
              <div className="p-1 rounded-2xl bg-primary/5 border border-primary/20">
                <Button 
                  onClick={handleGuestLogin}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold flex flex-col items-center justify-center gap-0 text-sm shadow-lg shadow-primary/20 relative group overflow-hidden"
                  disabled={loading}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>Enter Demo Mode</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">Explore all features instantly</span>
                </Button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground">
                  <span className="bg-white px-3">Or Login With</span>
                </div>
              </div>

              {!showEmailForm ? (
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                    onClick={() => setShowEmailForm(true)}
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    Continue with Email
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-slate-200 text-slate-400 font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                    disabled
                  >
                    <Phone className="h-4 w-4" />
                    Phone (Coming Soon)
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase text-muted-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="h-10 text-sm bg-slate-50/50"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password" title="At least 6 characters" className="text-[10px] font-bold uppercase text-muted-foreground">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-10 text-sm bg-slate-50/50"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" className="w-full h-11 font-bold bg-primary shadow-lg shadow-primary/20" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                      {isLogin ? "Sign In" : "Create Account"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-[10px] h-8 text-muted-foreground hover:text-primary font-bold"
                      onClick={() => setShowEmailForm(false)}
                    >
                      Back to Options
                    </Button>
                  </div>
                </form>
              )}

              <p className="text-center text-[11px] font-bold">
                {isLogin ? "Are you a new student? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "Sign up here" : "Sign in here"}
                </button>
              </p>

              <div className="pt-4 border-t border-slate-50">
                <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
                  By signing in, you agree to our <span className="text-primary hover:underline cursor-pointer">Terms</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { label: "AI Tools", icon: Bot, color: "text-purple-500" },
                  { icon: BarChart3, label: "Analytics", color: "text-blue-500" },
                  { icon: CheckCircle2, label: "Success", color: "text-green-500" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 flex flex-col items-center gap-1.5 group cursor-default">
                    <item.icon className={cn("h-4 w-4", item.color)} />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-6 text-center text-[10px] text-muted-foreground border-t bg-white">
        © 2026 MockAI. All rights reserved. Built for modern aspirants.
      </footer>
    </div>
  );
}
