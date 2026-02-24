"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Target, 
  Zap, 
  ArrowRight, 
  BookOpen, 
  Flame, 
  Trophy, 
  ChevronRight,
  BrainCircuit,
  Calculator,
  Globe,
  Star,
  ArrowLeft,
  LayoutGrid,
  FileSearch
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const examCategories = [
  { id: "ssc", name: "SSC Exams", desc: "CGL, CHSL, MTS, GD", icon: Zap, color: "text-blue-500", bg: "bg-blue-50", target: "2025-26" },
  { id: "railway", name: "Railway", desc: "RRB NTPC, Group D, ALP", icon: Target, color: "text-red-500", bg: "bg-red-50", target: "2025" },
  { id: "banking", name: "Banking", desc: "IBPS, SBI, RBI Grade B", icon: Calculator, color: "text-orange-500", bg: "bg-orange-50", target: "2025" },
  { id: "jee", name: "JEE & NEET", desc: "IIT Entrance, Medical", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50", target: "2026" },
  { id: "upsc", name: "UPSC/State PSC", desc: "Civil Services, CDS", icon: Globe, color: "text-indigo-500", bg: "bg-indigo-50", target: "2025" },
  { id: "teaching", name: "Teaching", desc: "CTET, KVS, State TET", icon: BookOpen, color: "text-green-500", bg: "bg-green-50", target: "2025" },
];

const subjects = [
  { id: "gk", name: "General Knowledge", icon: Globe },
  { id: "quant", name: "Quant Aptitude", icon: Calculator },
  { id: "reasoning", name: "Logical Reasoning", icon: BrainCircuit },
  { id: "science", name: "General Science", icon: Zap },
  { id: "english", name: "English Language", icon: BookOpen },
];

const suggestedChapters = [
  { id: "c1", name: "Trigonometric Ratios", questions: 250, mastery: 42, icon: Target, color: "text-purple-500" },
  { id: "c2", name: "Laws of Motion", questions: 120, mastery: 65, icon: Zap, color: "text-orange-500" },
  { id: "c3", name: "Indian Constitution", questions: 310, mastery: 15, icon: Globe, color: "text-blue-500" },
];

export default function PracticePage() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState("quant");
  const [searchQuery, setSearchQuery] = useState("");
  const [examSearch, setExamSearch] = useState("");

  const filteredExams = examCategories.filter(exam => 
    exam.name.toLowerCase().includes(examSearch.toLowerCase()) || 
    exam.desc.toLowerCase().includes(examSearch.toLowerCase())
  );

  if (!selectedExam) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-3 md:p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <header className="text-center space-y-3 pt-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">
                  <Star className="h-3 w-3 fill-primary" /> Select Your Target
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl font-headline font-bold text-slate-900 tracking-tight leading-tight">
                    Start Your <span className="text-primary">Practice Drills</span>
                  </h1>
                  <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto">
                    Choose a category to unlock topic-wise mastery and AI-curated question banks.
                  </p>
                </div>

                <div className="relative max-w-md mx-auto pt-2">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 mt-1" />
                  <Input 
                    placeholder="Search exams (SSC, JEE, IBPS)..."
                    className="pl-10 h-10 bg-white border-slate-100 rounded-xl shadow-sm focus-visible:ring-primary text-xs"
                    value={examSearch}
                    onChange={(e) => setExamSearch(e.target.value)}
                  />
                </div>
              </header>

              {filteredExams.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredExams.map((exam) => (
                    <Card 
                      key={exam.id} 
                      className="group border-none shadow-sm hover:shadow-md transition-all cursor-pointer rounded-2xl overflow-hidden bg-white"
                      onClick={() => setSelectedExam(exam.id)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", exam.bg, exam.color)}>
                            <exam.icon className="h-5 w-5" />
                          </div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                            TARGET {exam.target}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-bold text-slate-800 truncate">{exam.name}</h3>
                          <p className="text-[10px] text-muted-foreground font-medium truncate">{exam.desc}</p>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Explore</span>
                          <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <FileSearch className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">No matches for "{examSearch}"</h3>
                    <p className="text-xs text-slate-500">Try a different keyword.</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg h-8 text-[10px]" onClick={() => setExamSearch("")}>
                    Reset
                  </Button>
                </div>
              )}

              <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center md:text-left">
                  <h4 className="text-xs font-bold text-slate-800">New Exams Added Weekly</h4>
                  <p className="text-[10px] text-slate-500">Don't see yours? Request a new category.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg h-8 text-[10px] px-4 font-bold border-slate-200">
                  Request Exam
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-3 md:p-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-5">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <button 
                  onClick={() => setSelectedExam(null)}
                  className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-1"
                >
                  <ArrowLeft className="h-2.5 w-2.5" /> Change Target
                </button>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-headline font-bold text-slate-900 tracking-tight">
                    Practice Hub: <span className="text-primary">{examCategories.find(e => e.id === selectedExam)?.name}</span>
                  </h1>
                  <Badge className="bg-green-500 text-white text-[8px] font-bold h-4 px-1.5 rounded-md">LIVE</Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border shadow-sm">
                  <Flame className="h-3.5 w-3.5 text-primary fill-primary" />
                  <span className="text-[10px] font-bold">18 Days</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-lg">
                  <Trophy className="h-3.5 w-3.5 text-accent" />
                  <span className="text-[10px] font-bold">1.2k XP</span>
                </div>
              </div>
            </header>

            {/* Smart Suggested Chapters */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">High Weightage Chapters</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {suggestedChapters.map((chap) => (
                  <Card key={chap.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl bg-white group overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className={cn("p-2 rounded-xl bg-slate-50", chap.color)}>
                          <chap.icon className="h-4 w-4" />
                        </div>
                        <Badge variant="secondary" className="bg-slate-50 text-slate-400 text-[8px] font-bold h-4">{chap.questions} Qs</Badge>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">{chap.name}</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold">
                            <span className="text-slate-400 uppercase">Mastery</span>
                            <span className="text-primary">{chap.mastery}%</span>
                          </div>
                          <Progress value={chap.mastery} className="h-1 bg-slate-50" />
                        </div>
                      </div>
                      <Button className="w-full h-8 rounded-lg bg-slate-900 hover:bg-primary text-white font-bold text-[10px]" asChild>
                        <Link href={`/practice/session/${chap.id}`}>Start Drill</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Advanced Subject Explorer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <aside className="lg:col-span-3 space-y-3">
                <div className="flex items-center gap-2 px-1 mb-1">
                  <LayoutGrid className="h-3.5 w-3.5 text-slate-400" />
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subjects</h2>
                </div>
                <div className="space-y-1 flex lg:flex-col overflow-x-auto no-scrollbar pb-1 lg:pb-0 gap-1 lg:gap-1">
                  {subjects.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubject(sub.id)}
                      className={cn(
                        "flex-shrink-0 lg:w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all text-left whitespace-nowrap",
                        activeSubject === sub.id 
                          ? "bg-primary text-white shadow-md shadow-primary/10" 
                          : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <sub.icon className={cn("h-3.5 w-3.5", activeSubject === sub.id ? "text-white" : "text-slate-400")} />
                        {sub.name}
                      </div>
                      <ChevronRight className={cn("h-3 w-3 hidden lg:block", activeSubject === sub.id ? "text-white" : "text-slate-300")} />
                    </button>
                  ))}
                </div>
              </aside>

              <div className="lg:col-span-9 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder={`Search in ${subjects.find(s => s.id === activeSubject)?.name}...`}
                    className="pl-9 h-10 bg-white border-slate-100 rounded-xl focus-visible:ring-primary shadow-sm text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="border-none shadow-sm rounded-xl bg-white hover:shadow-md transition-all group cursor-pointer">
                      <CardContent className="p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">Chapter Name {i}</h4>
                            <p className="text-[9px] text-muted-foreground font-medium">42 Questions</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-slate-50/50 border-slate-100 text-[8px] font-bold text-slate-400 h-4 px-1">BEGINNER</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Exams Practice */}
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cross-Exam Drills</h2>
                <Button variant="link" className="text-[10px] font-bold text-primary h-auto p-0">View All</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Banking", "UPSC", "GATE", "CUET"].map((ex) => (
                  <Card key={ex} className="border-dashed border border-slate-200 bg-white hover:border-primary/40 transition-all cursor-pointer rounded-xl">
                    <CardContent className="p-3 flex flex-col items-center text-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                        <Target className="h-4 w-4 text-slate-300" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{ex} Practice</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}