
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Trophy,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Bookmark,
  Smile,
  Frown,
  User as UserIcon,
  BookOpen,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const marksDistributionData = [
  { marks: "0-5", students: 800 },
  { marks: "5-10", students: 1500 },
  { marks: "10-15", students: 2800 },
  { marks: "15-20", students: 4200 },
  { marks: "20-25", students: 5100 },
  { marks: "25-30", students: 4500 },
  { marks: "30-35", students: 3200 },
  { marks: "35-40", students: 1800 },
  { marks: "40-45", students: 900 },
  { marks: "45-50", students: 300 },
];

const leaderboardData = [
  { name: "A.D.", score: "48/50", rank: 1 },
  { name: "Vikas Kumar", score: "47/50", rank: 2 },
  { name: "TENSAI", score: "46/50", rank: 3 },
  { name: "Kuldeep Sen", score: "45/50", rank: 4 },
  { name: "Zain Ali", score: "44/50", rank: 5 },
  { name: "Rahul Raj", score: "43/50", rank: 6 },
  { name: "Sneha W.", score: "42/50", rank: 7 },
];

const mockSolutions = [
  {
    id: 1,
    status: "incorrect",
    time: "00:07",
    accuracy: "42%",
    text: "यदि P का 40 प्रतिशत = Q का 0.5 = R का 2/7 है, तो P : Q : R ज्ञात कीजिए।",
    points: -0.33
  },
  {
    id: 2,
    status: "incorrect",
    time: "00:04",
    accuracy: "78%",
    text: "सरल करें: 1 / (5 + √3) + 1 / (5 - √3)",
    points: -0.33
  },
  {
    id: 3,
    status: "correct",
    time: "00:14",
    accuracy: "82%",
    text: "एक ट्रेन 2 मिनट में 1.5 किमी की यात्रा करती है। यह 2 घंटे और 10 मिनट में कितनी दूरी तय करेगी?",
    points: 1.0
  },
  {
    id: 4,
    status: "unattempted",
    time: "--:--",
    accuracy: "19%",
    text: "दो व्यक्ति, X and Y, एक मैदान किराए पर लेते हैं। X 10 भैंसों को 5 महीने के लिए और 12 भेड़ों को 3 महीने के लिए रखता है। Y 15 भेड़ों को 4 महीने के...",
    points: 0
  }
];

export default function AnalyticsPage() {
  const [activeSolutionFilter, setActiveSolutionFilter] = useState("all");
  const params = useParams();
  const testId = params?.id || "rrb-group-d-mock";

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Compact */}
          <header className="p-3 md:p-4 bg-white border-b shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h1 className="text-xl font-headline font-bold text-slate-900">Analysis & Performance</h1>
                <p className="text-[10px] text-muted-foreground font-medium">Detailed sectional summary and rank prediction.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="h-8 px-4 rounded-lg text-[10px] font-bold bg-white border-slate-200">
                  Download PDF
                </Button>
                <Button className="h-8 px-4 rounded-lg text-[10px] font-bold bg-primary shadow-sm" onClick={() => window.history.back()}>
                  Re-attempt Test
                </Button>
              </div>
            </div>
          </header>

          <Tabs defaultValue="analysis" className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white border-b sticky top-0 z-30">
              <div className="max-w-7xl mx-auto px-4">
                <TabsList className="h-11 w-full justify-start bg-transparent p-0 gap-6">
                  {["analysis", "solutions", "leaderboard"].map((tab) => (
                    <TabsTrigger 
                      key={tab}
                      value={tab} 
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary font-bold text-[11px] md:text-xs px-0 uppercase tracking-wider"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto w-full">
                
                {/* --- ANALYSIS TAB --- */}
                <TabsContent value="analysis" className="m-0 p-3 md:p-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    {[
                      { label: "Rank", value: "22972/25787", icon: Trophy, color: "bg-red-500", text: "text-red-500" },
                      { label: "Score", value: "11.5/50", icon: Award, color: "bg-purple-500", text: "text-purple-500" },
                      { label: "Attempted", value: "7/25", icon: Zap, color: "bg-blue-400", text: "text-blue-400" },
                      { label: "Accuracy", value: "85.71%", icon: CheckCircle2, color: "bg-green-500", text: "text-green-500" },
                      { label: "Percentile", value: "14.25%", icon: TrendingUp, color: "bg-indigo-500", text: "text-indigo-500" },
                    ].map((stat) => (
                      <Card key={stat.label} className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg text-white shrink-0", stat.color)}>
                            <stat.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">{stat.label}</p>
                            <p className={cn("text-sm font-bold leading-none", stat.text)}>{stat.value}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
                    <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                          <Zap className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-bold text-slate-800">You scored <span className="text-primary italic">23.5 Marks</span> less than cutoff!</h3>
                          <p className="text-[10px] text-muted-foreground">Cutoff: 35.0 | Your Score: 11.5</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-1.5 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="text-center px-4 border-r">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase">Gap</p>
                            <p className="text-lg font-bold text-red-500">-23.5</p>
                         </div>
                         <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] h-8 rounded-lg">
                            Unlock Coaching
                         </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-8 space-y-4">
                      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
                        <CardHeader className="p-4 border-b">
                          <CardTitle className="text-sm font-headline">Sectional Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader className="bg-slate-50/50">
                              <TableRow>
                                <TableHead className="text-[10px] h-10 font-bold uppercase">Section Name</TableHead>
                                <TableHead className="text-[10px] h-10 font-bold uppercase">Score</TableHead>
                                <TableHead className="text-[10px] h-10 font-bold uppercase text-center">Accuracy</TableHead>
                                <TableHead className="text-[10px] h-10 font-bold uppercase text-right">Time</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[
                                { name: "Quantitative Aptitude", score: "11.5/50", accuracy: "85.7%", time: "19:54 / 30m", color: "text-red-500" },
                                { name: "General Intelligence", score: "24.0/50", accuracy: "92.1%", time: "22:10 / 30m", color: "text-green-600" },
                                { name: "General Science", score: "18.5/50", accuracy: "78.4%", time: "12:45 / 30m", color: "text-blue-600" },
                              ].map((row) => (
                                <TableRow key={row.name} className="hover:bg-slate-50/30">
                                  <TableCell className="text-[11px] font-bold py-3">{row.name}</TableCell>
                                  <TableCell className={cn("text-[11px] font-bold", row.color)}>{row.score}</TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 text-[9px] h-5 px-2 font-bold">{row.accuracy}</Badge>
                                  </TableCell>
                                  <TableCell className="text-right text-[10px] font-mono text-muted-foreground">{row.time}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-headline flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" /> Marks Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[220px] p-4 pt-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={marksDistributionData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                              <XAxis dataKey="marks" tick={{fontSize: 9}} axisLine={false} tickLine={false} />
                              <YAxis tick={{fontSize: 9}} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '10px'}} />
                              <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: 'hsl(var(--primary))'}} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                      <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-headline">Strengths & Weaknesses</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2.5">
                           <div className="p-3 rounded-xl bg-red-50 border border-red-100 space-y-2">
                              <p className="text-[9px] font-bold text-red-700 uppercase flex items-center gap-1.5">
                                 <AlertCircle className="h-3 w-3" /> Critical Weakness
                              </p>
                              <h4 className="text-[11px] font-bold text-slate-800">Trigonometric Ratios</h4>
                              <div className="flex items-center gap-2">
                                 <div className="h-1.5 flex-1 bg-red-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-600" style={{ width: '12%' }} />
                                 </div>
                                 <span className="text-[10px] font-bold text-red-600">12%</span>
                              </div>
                           </div>
                           <div className="p-3 rounded-xl bg-green-50 border border-green-100 space-y-2">
                              <p className="text-[9px] font-bold text-green-700 uppercase flex items-center gap-1.5">
                                 <CheckCircle2 className="h-3 w-3" /> Area of Strength
                              </p>
                              <h4 className="text-[11px] font-bold text-slate-800">Time & Speed</h4>
                              <div className="flex items-center gap-2">
                                 <div className="h-1.5 flex-1 bg-green-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600" style={{ width: '92%' }} />
                                 </div>
                                 <span className="text-[10px] font-bold text-green-600">92%</span>
                              </div>
                           </div>
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
                         <CardHeader className="p-4 pb-2">
                           <CardTitle className="text-sm font-headline">Rank Predictor</CardTitle>
                         </CardHeader>
                         <CardContent className="p-4 flex flex-col items-center">
                            <div className="w-full h-8 bg-slate-100 rounded-lg relative mb-6">
                               <div className="absolute top-1/2 left-[14%] -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg z-10" />
                               <div className="absolute -top-7 left-[14%] -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Rank 22972</div>
                               <div className="flex justify-between px-2 pt-10">
                                  {["-10", "14", "38", "50"].map((v) => (
                                     <span key={v} className="text-[9px] font-bold text-muted-foreground">{v}</span>
                                  ))}
                               </div>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground italic mt-3">
                               "Projected rank in the top 88%."
                            </p>
                         </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* --- SOLUTIONS TAB - COMPACT --- */}
                <TabsContent value="solutions" className="m-0 p-3 md:p-4 space-y-4">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { id: "all", label: "All", count: 25 },
                      { id: "incorrect", label: "Incorrect", count: 2 },
                      { id: "unattempted", label: "Unattempted", count: 23 },
                    ].map((filter) => (
                      <Button
                        key={filter.id}
                        size="sm"
                        variant={activeSolutionFilter === filter.id ? "default" : "outline"}
                        onClick={() => setActiveSolutionFilter(filter.id)}
                        className={cn(
                          "rounded-full h-8 px-4 text-[10px] font-bold transition-all",
                          activeSolutionFilter === filter.id ? "bg-primary text-white shadow-sm" : "bg-white text-slate-500 border-slate-200"
                        )}
                      >
                        {filter.label} ({filter.count})
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="px-1">
                      <h3 className="text-sm font-bold text-slate-800">संख्यात्मक योग्यता (Quantitative Aptitude)</h3>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">25 Questions</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {mockSolutions.map((q, idx) => (
                        <Card key={q.id} className="border-none shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                          <CardContent className="p-3.5 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform",
                                  q.status === "incorrect" ? "bg-red-500" : q.status === "correct" ? "bg-green-500" : "bg-slate-300"
                                )}>
                                  {q.id}
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{q.time}</span>
                                  </div>
                                  <div className="h-3 w-px bg-slate-200" />
                                  <div className="flex items-center gap-1">
                                    {q.status === "incorrect" ? <Frown className="h-3.5 w-3.5" /> : <Smile className="h-3.5 w-3.5" />}
                                    <span>{q.accuracy} accuracy</span>
                                  </div>
                                </div>
                              </div>
                              <Bookmark className="h-4 w-4 text-slate-300 cursor-pointer hover:text-primary transition-colors" />
                            </div>
                            
                            <p className="text-sm font-medium text-slate-700 leading-snug">
                              {q.text}
                            </p>

                            <Separator className="bg-slate-100" />

                            <div className="flex items-center justify-between">
                               <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-primary p-0 hover:bg-transparent flex items-center gap-1" asChild>
                                 <Link href={`/tests/solutions/${testId}?q=${idx}`}>
                                   VIEW SOLUTION <ChevronRight className="h-3 w-3" />
                                 </Link>
                               </Button>
                               {q.points !== 0 && (
                                 <Badge className={cn("text-[9px] h-5 px-1.5 rounded-md", q.points > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                                   {q.points > 0 ? `+${q.points}` : q.points}
                                 </Badge>
                               )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* --- LEADERBOARD TAB - COMPACT --- */}
                <TabsContent value="leaderboard" className="m-0 flex flex-col h-full bg-white relative">
                  <div className="p-3 md:p-4 space-y-4 pb-20">
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        className="w-full max-w-lg rounded-full h-10 bg-white border-slate-100 shadow-sm flex items-center justify-center gap-2 group relative overflow-hidden"
                        onClick={() => window.location.reload()}
                      >
                        <span className="text-blue-600 font-bold text-sm">Reattempt Test</span>
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <ArrowRight className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
                           <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                      </Button>
                    </div>

                    <div className="relative pt-6 pb-3 px-4 rounded-[2rem] bg-[#fffef0] border border-yellow-100 shadow-sm max-w-2xl mx-auto">
                      <div className="flex items-end justify-center gap-4 md:gap-10">
                        {/* Rank 2 */}
                        <div className="flex flex-col items-center gap-2 mb-3">
                          <div className="relative">
                            <Avatar className="h-14 w-14 border-2 border-white shadow-lg">
                              <AvatarImage src="https://picsum.photos/seed/shallu/100" />
                              <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full border-2 border-[#fffef0] flex items-center justify-center text-white text-[9px] font-bold">2</div>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-800">Shallu</p>
                            <p className="text-[9px] font-bold text-slate-500">50/50</p>
                          </div>
                        </div>

                        {/* Rank 1 */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <div className="absolute -inset-3 bg-yellow-400/10 rounded-full animate-pulse" />
                            <Avatar className="h-20 w-20 border-4 border-orange-400 shadow-xl relative z-10 ring-4 ring-white/50">
                              <AvatarImage src="https://picsum.photos/seed/ayodhya/100" />
                              <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-1 -right-1 w-7 h-7 bg-orange-400 rounded-full border-2 border-[#fffef0] flex items-center justify-center text-white text-xs font-bold z-20">1</div>
                          </div>
                          <div className="text-center pt-1">
                            <p className="text-xs font-bold text-slate-900">Ayodhya</p>
                            <p className="text-[10px] font-bold text-slate-600">50/50</p>
                          </div>
                        </div>

                        {/* Rank 3 */}
                        <div className="flex flex-col items-center gap-2 mb-3">
                          <div className="relative">
                            <Avatar className="h-14 w-14 border-2 border-white shadow-lg">
                              <AvatarImage src="https://picsum.photos/seed/dhanesh/100" />
                              <AvatarFallback>D</AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full border-2 border-[#fffef0] flex items-center justify-center text-white text-[9px] font-bold">3</div>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-800">Dhanesh</p>
                            <p className="text-[9px] font-bold text-slate-500">50/50</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="max-w-xl mx-auto divide-y border-t mt-4">
                      {leaderboardData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2.5 group hover:bg-slate-50 transition-colors px-3 rounded-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}</span>
                            <Avatar className="h-8 w-8 border border-white shadow-sm">
                              <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px]">{item.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-[13px] font-bold text-slate-700 group-hover:text-primary transition-colors">{item.name}</span>
                          </div>
                          <span className="text-[13px] font-bold text-slate-900">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#e8f0fe] border-t border-blue-100 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
                    <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-slate-900">22972</span>
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-slate-300 text-white"><UserIcon className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 leading-none">Aspirant (You)</span>
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Top 88%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-slate-900">11.5/50.0</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase leading-none">Score</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

              </div>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
