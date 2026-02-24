"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Zap, 
  TrendingUp, 
  HelpCircle,
  Award,
  BarChart3,
  Users
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const recentSeries = [
  { id: 1, name: "RRB Group D Mock Test Series", progress: 45, tests: "45/100", icon: Zap, color: "bg-red-500", image: "https://picsum.photos/seed/rrb1/640/360" },
  { id: 2, name: "SSC CGL Tier-I Mega Pack", progress: 12, tests: "12/45", icon: Award, color: "bg-blue-500", image: "https://picsum.photos/seed/ssc1/640/360" },
  { id: 3, name: "Current Affairs 2024 Daily", progress: 88, tests: "88/100", icon: TrendingUp, color: "bg-orange-500", image: "https://picsum.photos/seed/ca1/640/360" },
];

const liveQuizzes = [
  { id: 1, title: "General Knowledge for Railways", questions: 20, marks: 20, duration: "10m", live: true, image: "https://picsum.photos/seed/quiz1/640/360" },
  { id: 2, title: "SSC MTS Quant Booster: #24", questions: 25, marks: 50, duration: "20m", live: true, image: "https://picsum.photos/seed/quiz2/640/360" },
  { id: 3, title: "Daily Vocabulary Challenge", questions: 10, marks: 10, duration: "5m", live: false, image: "https://picsum.photos/seed/quiz3/640/360" },
];

const categories = ["SSC", "JEE", "NEET", "UPSC", "Railway", "Banking", "Teaching"];

export default function TestSeriesPage() {
  const [categorySearch, setCategorySearch] = useState("");

  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-2 md:p-6 space-y-4 md:space-y-6 pb-16 overflow-y-auto">
          <div className="relative max-w-lg md:max-w-xl mx-auto w-full px-1">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
            <Input 
              placeholder="Search exams (JEE, NEET, SSC)..." 
              className="pl-8 md:pl-10 h-9 md:h-11 shadow-sm border-primary/20 bg-white text-xs md:text-sm rounded-xl focus-visible:ring-primary"
            />
          </div>

          <section className="space-y-3 md:space-y-4 w-full">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm md:text-base font-headline font-bold flex items-center gap-2">
                <BookOpen className="h-3 md:h-4 w-3 md:w-4 text-primary" /> Enrolled Series
              </h2>
              <Button variant="link" size="sm" className="text-primary text-[10px] md:text-[11px] font-bold h-auto p-0" asChild>
                <Link href="/tests/my-series">View All</Link>
              </Button>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max gap-2 md:gap-3 pb-4">
                {recentSeries.map((series) => (
                  <Link key={series.id} href={`/tests/series/${series.id}`} className="block group">
                    <Card className="w-[200px] md:w-[240px] shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer border-none bg-white overflow-hidden rounded-xl md:rounded-2xl h-full">
                      <div className="relative aspect-video w-full">
                        <Image 
                          src={series.image} 
                          alt={series.name} 
                          fill 
                          className="object-cover transition-transform group-hover:scale-105 duration-500"
                          data-ai-hint="exam preparation"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 md:gap-1.5 text-white">
                          <div className={`p-1 rounded-md ${series.color} shadow-sm`}>
                            <series.icon className="h-2.5 md:h-3 w-2.5 md:w-3" />
                          </div>
                          <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-tight">Mock Series</span>
                        </div>
                      </div>
                      <CardContent className="p-2 md:p-3 space-y-2 md:space-y-2.5">
                        <h3 className="text-xs md:text-sm font-bold whitespace-normal line-clamp-2 leading-tight h-6 md:h-8 group-hover:text-primary transition-colors">
                          {series.name}
                        </h3>
                        <div className="space-y-1 md:space-y-1.5">
                          <div className="flex justify-between text-[8px] md:text-[9px] font-bold">
                            <span className="text-muted-foreground">{series.tests} Completed</span>
                            <span className="text-primary">{series.progress}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${series.progress}%` }} />
                          </div>
                        </div>
                        <div className="w-full h-6 md:h-8 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground text-[8px] md:text-[11px] font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                          Continue
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          <section className="space-y-3 md:space-y-4 w-full">
            <h2 className="text-sm md:text-base font-headline font-bold flex items-center gap-2 px-1">
              <Zap className="h-3 md:h-4 w-3 md:w-4 text-accent" /> Live & Free
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {liveQuizzes.map((quiz) => (
                <Link key={quiz.id} href={`/tests/instructions/live-${quiz.id}`} className="group block">
                  <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-all border-none bg-white border-l-4 border-l-accent flex flex-col h-full rounded-xl md:rounded-2xl">
                    <div className="relative aspect-video w-full shrink-0">
                      <Image 
                        src={quiz.image} 
                        alt={quiz.title} 
                        fill 
                        className="object-cover"
                        data-ai-hint="online quiz"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-2 left-2 gap-1 md:gap-1.5">
                        {quiz.live && (
                          <Badge className="bg-accent text-[8px] md:text-[9px] h-3 md:h-4 px-1.5 md:px-2 font-bold animate-pulse rounded-md">
                            LIVE NOW
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 text-[8px] md:text-[9px] h-3 md:h-4 px-1.5 md:px-2 font-bold rounded-md">
                          FREE
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-3 md:p-4 pb-2">
                      <CardTitle className="text-xs md:text-sm font-bold leading-snug group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0 flex-1">
                      <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-[11px] text-muted-foreground font-medium mb-3 md:mb-4">
                        <span className="flex items-center gap-1"><HelpCircle className="h-3 md:h-3.5 w-3 md:w-3.5" /> {quiz.questions} Qs</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 md:h-3.5 w-3 md:w-3.5" /> {quiz.duration}</span>
                      </div>
                      <div className="w-full h-7 md:h-9 flex items-center justify-center rounded-xl bg-accent text-white text-[10px] md:text-[12px] font-bold shadow-md shadow-accent/10 mt-auto group-hover:scale-[1.02] transition-transform">
                        Register Free
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3 md:space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <h2 className="text-sm md:text-base font-headline">Browse Categories</h2>
              <div className="relative w-full sm:w-48 md:w-56">
                <Search className="absolute left-2 md:left-2.5 top-1/2 -translate-y-1/2 h-3 md:h-4 w-3 md:w-4 text-muted-foreground" />
                <Input 
                  placeholder="Filter category..." 
                  className="pl-8 md:pl-9 h-8 md:h-9 text-xs bg-white border-primary/10 rounded-lg"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>
            </div>
            
            <Card className="shadow-sm overflow-hidden border-none bg-white rounded-xl md:rounded-[2rem]">
              <Tabs defaultValue="Railway" className="flex flex-col md:flex-row min-h-[250px] md:min-h-[300px]">
                <TabsList className="flex md:flex-col items-center md:items-start justify-start h-auto w-full md:w-40 md:w-44 bg-slate-50 p-1 md:p-1.5 md:border-r gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat} 
                        className="flex-1 md:w-full justify-center md:justify-start text-xs md:text-xs font-bold px-2 md:px-3 py-1.5 md:py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-xl whitespace-nowrap transition-all"
                      >
                        {cat}
                      </TabsTrigger>
                    ))
                  ) : (
                    <div className="p-2 md:p-3 text-xs md:text-xs text-muted-foreground font-bold italic w-full text-center md:text-left">No results</div>
                  )}
                </TabsList>
                
                <div className="flex-1 p-3 md:p-4 md:p-6">
                  <TabsContent value="Railway" className="mt-0 outline-none">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                      {[1, 2, 3].map((i) => (
                        <Link key={i} href={`/tests/series/rrb-ntpc-${i}`} className="group block">
                          <Card className="hover:border-primary/40 border-dashed border-2 transition-all cursor-pointer bg-white overflow-hidden flex flex-col h-full shadow-sm rounded-xl md:rounded-2xl">
                            <div className="relative aspect-video w-full">
                              <Image 
                                src={`https://picsum.photos/seed/railway${i}/640/360`}
                                alt="Railway Exam"
                                fill
                                className="object-cover"
                                data-ai-hint="railway platform"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                              <div className="absolute top-2 right-2">
                                <Badge variant="outline" className="text-[8px] md:text-[9px] h-4 md:h-5 border-none bg-white/90 backdrop-blur font-bold rounded-md">
                                  <Users className="h-2 md:h-2.5 w-2 md:w-2.5 mr-0.5 md:mr-1" /> 12k+ Enrolled
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-2 md:p-3 space-y-2 md:space-y-3 flex-1 flex flex-col">
                              <div className="flex justify-between items-start">
                                <div className="p-1.5 md:p-2 rounded-xl bg-primary/10 text-primary">
                                  <Zap className="h-3 md:h-4 w-3 md:w-4" />
                                </div>
                                <Badge className="bg-slate-900 text-[8px] md:text-[13px] font-bold rounded-md">2024 PATTERN</Badge>
                              </div>
                              <h4 className="text-xs md:text-sm md:text-[13px] font-bold leading-snug line-clamp-2 h-8 md:h-9 group-hover:text-primary transition-colors">
                                RRB NTPC Graduate Level 2024 Exam Booster
                              </h4>
                              <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium">152 Tests | 12 Free Mocks</p>
                              <div className="w-full h-6 md:h-8 flex items-center justify-center rounded-xl bg-primary text-white text-[10px] md:text-[11px] font-bold shadow-sm mt-auto group-hover:scale-[1.02] transition-transform">
                                View Series
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>
                  
                  {categories.filter(c => c !== "Railway").map(cat => (
                    <TabsContent key={cat} value={cat} className="mt-0 outline-none text-center py-8 md:py-16">
                      <div className="space-y-3">
                        <BookOpen className="h-8 md:h-10 w-8 md:w-10 text-slate-200 mx-auto" />
                        <div className="space-y-1">
                          <p className="text-sm md:text-base font-bold text-slate-800">Explore {cat}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">Detailed test series for {cat} are available in full catalog.</p>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 md:h-10 text-[10px] md:text-[11px] font-bold border-primary text-primary rounded-xl" asChild>
                          <Link href="/tests/my-series">Browse My Content</Link>
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}