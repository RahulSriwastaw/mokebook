
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { StatsOverview } from "@/components/home/StatsOverview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Zap, 
  BarChart3, 
  Bot, 
  ChevronRight, 
  Clock, 
  Users, 
  Loader2,
  TrendingUp,
  Award,
  Target,
  ArrowRight,
  Flame,
  Sparkles,
  Globe,
  ShieldCheck,
  Trophy,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, orderBy, limit } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userDoc = useDoc(user && db ? doc(db, "users", user.uid) : null);
  
  const activePlansQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, "users", user.uid, "study_plans"),
      orderBy("updatedAt", "desc"),
      limit(1)
    );
  }, [db, user]);

  const { data: plans } = useCollection(activePlansQuery);
  const activePlan = plans?.[0];

  // Granular Task-based progress calculation for the Dashboard
  const calculateTaskProgress = (plan: any) => {
    if (!plan?.dailyTasks) return 0;
    const allTasks = plan.dailyTasks.flatMap((d: any) => d.tasks || []);
    if (allTasks.length === 0) return 0;
    const completedTasks = allTasks.filter((t: any) => t.status === 'completed').length;
    return Math.round((completedTasks / allTasks.length) * 100);
  };

  const progressPercentage = activePlan ? calculateTaskProgress(activePlan) : 0;

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    const recentTests = [
      {
        id: "mock-5",
        title: "JEE Full Mock #5",
        score: "235/360",
        percentile: "92.4%",
        date: "2d ago",
        status: "completed",
      },
      {
        id: "phys-em",
        title: "Physics: Electromagnetism",
        score: "45/60",
        percentile: "88.1%",
        date: "5d ago",
        status: "completed",
      },
    ];

    const categories = [
      { name: "JEE Mains", tests: 45, icon: Zap, color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-700" },
      { name: "NEET", tests: 38, icon: BookOpen, color: "bg-green-500", lightColor: "bg-green-50", textColor: "text-green-700" },
      { name: "UPSC", tests: 25, icon: BarChart3, color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-700" },
      { name: "SSC CGL", tests: 32, icon: Users, color: "bg-orange-500", lightColor: "bg-orange-50", textColor: "text-orange-700" },
    ];

    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-3 md:p-4 space-y-4 overflow-y-auto">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h1 className="text-lg md:text-xl font-headline font-bold tracking-tight text-slate-900">
                  Welcome Back, {user.displayName || userDoc.data?.name || "Aspirant"}! 🌅
                </h1>
                <p className="text-[9px] md:text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Target className="h-3 w-3 text-primary" />
                  Target: <span className="text-slate-900 font-bold uppercase">{userDoc.data?.primaryExam || "Competitive Exams"} {userDoc.data?.targetYear || "2026"}</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 md:gap-2 shrink-0">
                <div className="p-1 md:p-1.5 bg-white rounded-xl border shadow-sm flex flex-col items-center gap-0.5 min-w-[60px] md:min-w-[70px]">
                  <Flame className="h-3 md:h-3.5 w-3 md:w-3.5 text-primary fill-primary" />
                  <span className="text-[9px] md:text-[11px] font-bold text-slate-900">18 Days</span>
                  <span className="text-[6px] md:text-[7px] font-bold text-muted-foreground uppercase">Streak</span>
                </div>
                <div className="p-1 md:p-1.5 bg-white rounded-xl border shadow-sm flex flex-col items-center gap-0.5 min-w-[60px] md:min-w-[70px]">
                  <Award className="h-3 md:h-3.5 w-3 md:w-3.5 text-accent" />
                  <span className="text-[9px] md:text-[11px] font-bold text-slate-900">1.2k</span>
                  <span className="text-[6px] md:text-[7px] font-bold text-muted-foreground uppercase">Points</span>
                </div>
                <div className="p-1 md:p-1.5 bg-white rounded-xl border shadow-sm flex flex-col items-center gap-0.5 min-w-[60px] md:min-w-[70px]">
                  <TrendingUp className="h-3 md:h-3.5 w-3 md:w-3.5 text-blue-500" />
                  <span className="text-[9px] md:text-[11px] font-bold text-slate-900">Top 4%</span>
                  <span className="text-[6px] md:text-[7px] font-bold text-muted-foreground uppercase">Rank</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
              <div className="lg:col-span-8 space-y-3 md:space-y-4">
                <FeaturedCarousel />
                
                <section className="space-y-2 md:space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm md:text-sm font-headline font-bold text-slate-900">Recent Performance</h2>
                    <Button variant="ghost" size="sm" className="text-primary font-bold text-[8px] md:text-[9px] h-6 px-1.5" asChild>
                      <Link href="/analytics" className="flex items-center gap-1">
                        Full Analytics <ChevronRight className="h-2 md:h-2.5 w-2 md:w-2.5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {recentTests.map((test, i) => (
                      <Link key={i} href={`/tests/results/${test.id}`} className="block group">
                        <Card className="hover:shadow-md transition-all border-none bg-white h-full shadow-sm rounded-xl md:rounded-2xl overflow-hidden">
                          <CardContent className="p-2 md:p-3 space-y-2 md:space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <h3 className="text-[10px] md:text-[11px] font-bold text-slate-800">{test.title}</h3>
                                <p className="text-[7px] md:text-[8px] font-bold text-primary uppercase tracking-wider">{test.date}</p>
                              </div>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-500 text-[6px] md:text-[7px] font-bold h-3 md:h-4 px-1 md:px-1.5">COMPLETED</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-1.5 md:gap-2 border-y py-1.5 md:py-2 border-slate-50">
                              <div>
                                <p className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase">Score</p>
                                <p className="text-sm md:text-sm font-bold text-slate-900">{test.score}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase">Percentile</p>
                                <p className="text-sm md:text-sm font-bold text-primary">{test.percentile}</p>
                              </div>
                            </div>

                            <div className="w-full h-6 md:h-7 rounded-xl flex items-center justify-center text-[8px] md:text-[9px] font-bold bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                              Review Solutions
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="space-y-2 md:space-y-2.5">
                  <h2 className="text-sm md:text-sm font-headline font-bold text-slate-900">Explore Categories</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                    {categories.map((cat) => (
                      <Link key={cat.name} href="/tests" className="group block">
                        <Card className="hover:shadow-lg cursor-pointer transition-all border-none bg-white relative overflow-hidden h-full shadow-sm rounded-xl md:rounded-2xl">
                          <CardContent className="p-2 md:p-3 flex flex-col items-center text-center space-y-1 relative z-10">
                            <div className={`p-1.5 md:p-2 rounded-xl ${cat.lightColor} ${cat.textColor} group-hover:scale-110 transition-transform`}>
                              <cat.icon className="h-3 md:h-4 w-3 md:w-4" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-[10px] md:text-[11px] text-slate-900">{cat.name}</p>
                              <p className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">{cat.tests} Series</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 space-y-3 md:space-y-4">
                <StatsOverview />

                {activePlan ? (
                  <Card className="bg-white border-none shadow-sm overflow-hidden rounded-2xl ring-1 ring-slate-100">
                    <CardHeader className="p-4 bg-primary/5 flex flex-row items-center justify-between space-y-0 border-b border-primary/10">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <CardTitle className="text-xs font-bold uppercase tracking-wider">Active Study Path</CardTitle>
                      </div>
                      <Badge className="bg-green-500 text-white text-[8px] font-bold h-4">IN PROGRESS</Badge>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{activePlan.topic}</h3>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{activePlan.summary}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Mastery Progress</span>
                          <span className="text-primary">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-1.5" />
                      </div>

                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-[11px] rounded-xl group" asChild>
                        <Link href={`/study-plans/${activePlan.id}`}>
                          Continue Learning <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-primary/5 border-primary/20 shadow-none border-dashed overflow-hidden rounded-2xl">
                    <CardHeader className="p-4">
                      <CardTitle className="text-[11px] font-headline font-bold flex items-center gap-1.5 text-slate-800">
                        <Bot className="h-3.5 w-3.5 text-primary" /> AI Smart Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="p-2.5 bg-white/80 rounded-xl border border-primary/5 shadow-sm">
                        <p className="text-[10px] text-slate-600 leading-relaxed italic">
                          "You haven't created a study plan yet! Let our AI analyze your goals and build a 7-day roadmap for you."
                        </p>
                      </div>
                      <Button variant="link" className="p-0 h-auto text-primary font-bold text-[9px] group" asChild>
                        <Link href="/study-plans/create" className="flex items-center">
                          Generate Path <ArrowRight className="h-2.5 w-2.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card className="overflow-hidden shadow-lg border-none bg-slate-900 text-white relative rounded-2xl">
                  <div className="absolute top-0 right-0 p-2">
                     <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                      <span className="text-[7px] font-bold uppercase tracking-widest text-accent">Live</span>
                    </div>
                  </div>
                  <CardHeader className="p-4 space-y-1">
                    <div className="p-1.5 bg-white/10 rounded-lg w-fit mb-1 backdrop-blur-sm">
                      <Zap className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <CardTitle className="text-sm font-headline font-bold">Daily Physics Quiz</CardTitle>
                    <CardDescription className="text-white/60 text-[9px]">Challenge 1,200+ students.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2.5">
                    <div className="flex items-center justify-between text-[9px]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-white/40" />
                        <span>Ends in 05:42:10</span>
                      </div>
                      <span className="font-bold text-accent">+500 XP</span>
                    </div>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-8 text-[10px] shadow-lg shadow-accent/20 rounded-xl" asChild>
                      <Link href="/tests/instructions/daily-physics-quiz">Join Live Quiz</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const heroImg = PlaceHolderImages.find(img => img.id === "hero-exam");

  return (
    <div className="flex flex-col min-h-screen bg-white font-headline overflow-x-hidden selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        <section className="relative pt-12 pb-12">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3 text-primary" />
                Next-Gen Competitive Prep
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
                Ace Any Exam <br />
                <span className="text-primary italic">With AI Precision</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 max-w-lg leading-relaxed">
                Personalized mock tests, adaptive study paths, and deep rank-predicting analytics. Join 50,000+ top aspirants.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button size="lg" className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-[13px] shadow-lg shadow-primary/20 group" asChild>
                  <Link href="/login">
                    Get Started Free <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="h-11 px-6 rounded-xl text-slate-600 font-bold text-[13px]" asChild>
                  <Link href="/tests">Explore Mocks</Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-video rounded-[1.5rem] border-8 border-slate-900/5 shadow-2xl overflow-hidden bg-slate-100">
                <Image 
                  src={heroImg?.imageUrl || "https://picsum.photos/seed/landing/1200/600"}
                  alt="Platform Preview"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-xl shadow-lg border border-white/20 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[7px] font-bold text-slate-400 uppercase">Success Rate</p>
                    <p className="text-11px font-bold text-slate-900">92% Users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-slate-50/50">
          <div className="container mx-auto px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1 text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Platform <span className="text-primary italic">Superpowers</span></h2>
                <p className="text-slate-500 text-[13px]">Designed for high-density learning and maximum efficiency.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="md:col-span-2 lg:col-span-3 bg-slate-900 text-white border-none overflow-hidden group p-6 flex flex-col justify-between min-h-[220px] rounded-2xl">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Dynamic AI Planner</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs">
                    Analyzes your mock test errors to build a personalized 7-day study schedule automatically.
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="link" className="text-primary p-0 h-auto text-[10px] font-bold">Learn more</Button>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800" />)}
                  </div>
                </div>
              </Card>

              <Card className="md:col-span-2 lg:col-span-3 bg-white border-none shadow-sm p-6 flex flex-col justify-between rounded-2xl">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Deep Insights</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Track your percentile, speed, and accuracy vs. rankers. Get predicted scores for your target exams.
                  </p>
                </div>
                <div className="mt-4 flex gap-1 items-end h-8">
                  {[30, 60, 45, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </Card>

              <Card className="md:col-span-2 lg:col-span-2 bg-primary/5 border-none p-6 space-y-3 rounded-2xl shadow-sm">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h4 className="font-bold text-sm">Error Bank</h4>
                <p className="text-[10px] text-slate-500">Auto-collects mistakes into a personalized revision quiz pool.</p>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-2 bg-accent/5 border-none p-6 space-y-3 rounded-2xl shadow-sm">
                <Globe className="h-6 w-6 text-accent" />
                <h4 className="font-bold text-sm">Live Mocks</h4>
                <p className="text-[10px] text-slate-500">Real-time nationwide test simulation with thousands of peers.</p>
              </Card>

              <Card className="md:col-span-4 lg:col-span-2 bg-green-500/5 border-none p-6 space-y-3 rounded-2xl shadow-sm">
                <Zap className="h-6 w-6 text-green-600" />
                <h4 className="font-bold text-sm">Flash Practice</h4>
                <p className="text-[10px] text-slate-500">Quick 5-minute drills for concepts you struggle with most.</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center space-y-12">
            <h2 className="text-2xl md:text-3xl font-bold">Master Exams in <span className="text-primary italic">3 Tight Steps</span></h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Select Target", desc: "Choose from 12,000+ tests.", icon: Target },
                { step: "02", title: "Practice AI Mocks", desc: "Adaptive difficulty levels.", icon: BookOpen },
                { step: "03", title: "Scale Ranks", desc: "Real-time rank improvement.", icon: Award },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary mb-4 transition-transform group-hover:-translate-y-1">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 max-w-[180px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50/50">
          <div className="container mx-auto px-6">
            <Card className="bg-slate-900 border-none rounded-[2rem] overflow-hidden text-center p-12 space-y-6">
              <div className="space-y-4 max-w-lg mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Ready to be a <span className="text-primary italic">Topper?</span>
                </h2>
                <p className="text-slate-400 text-[13px]">Join 50,000+ smart students. Start your first AI mock today.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <Button size="lg" className="h-11 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-[13px]" asChild>
                    <Link href="/login">Join Mockbook Free</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      
      <footer className="py-10 border-t bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-1 text-primary text-base tracking-tight">
            <span className="bg-primary text-white p-0.5 rounded-md text-[7px]">M</span>
            <span>Mockbook</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/tests" className="hover:text-primary transition-colors">Test Series</Link>
            <Link href="/practice" className="hover:text-primary transition-colors">Practice</Link>
            <Link href="/refer" className="hover:text-primary transition-colors">Refer</Link>
          </div>
          <p>© 2026 MockAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
