
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Clock, 
  Bookmark, 
  User as UserIcon, 
  Filter, 
  Zap, 
  AlertCircle, 
  XCircle, 
  Eye, 
  Flag,
  ArrowLeft,
  Star,
  Loader2,
  Menu,
  Languages,
  RotateCcw,
  Info,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  CircleMinus,
  Check,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/firebase";
import { Separator } from "@/components/ui/separator";
import useEmblaCarousel from 'embla-carousel-react';

const mockQuestions = [
  {
    id: "q-1",
    number: 1,
    text: "Which of the following is the unit of measure for electrical resistance?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    section: "General Intelligence and Reasoning",
    correct: 2,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:25",
    accuracy: "82%",
  },
  {
    id: "q-2",
    number: 2,
    text: "If a car travels at a constant speed of 60 km/h, how far will it travel in 15 minutes?",
    options: ["10 km", "15 km", "20 km", "25 km"],
    section: "General Intelligence and Reasoning",
    correct: 1,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:45",
    accuracy: "65%",
  },
  {
    id: "q-3",
    number: 3,
    text: "Find the odd one out: Circle, Square, Triangle, Cylinder.",
    options: ["Circle", "Square", "Triangle", "Cylinder"],
    section: "General Intelligence and Reasoning",
    correct: 3,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:20",
    accuracy: "91%",
  },
  {
    id: "q-4",
    number: 4,
    text: "Who was the first woman Prime Minister of India?",
    options: ["Pratibha Patil", "Indira Gandhi", "Sushma Swaraj", "Sarojini Naidu"],
    section: "General Intelligence and Reasoning",
    correct: 1,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:15",
    accuracy: "95%",
  },
  {
    id: "q-5",
    number: 5,
    text: "What is the chemical symbol for Gold?",
    options: ["Ag", "Fe", "Au", "Pb"],
    section: "General Intelligence and Reasoning",
    correct: 2,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:10",
    accuracy: "88%",
  },
  {
    id: "q-6",
    number: 6,
    text: "If 2x + 5 = 15, then what is the value of x?",
    options: ["5", "10", "7.5", "2.5"],
    section: "General Intelligence and Reasoning",
    correct: 0,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:30",
    accuracy: "78%",
  },
  {
    id: "q-7",
    number: 7,
    text: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
    options: ["His own", "His son's", "His father's", "His nephew's"],
    section: "General Intelligence and Reasoning",
    correct: 1,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "01:10",
    accuracy: "42%",
  },
  {
    id: "q-8",
    number: 8,
    text: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    section: "General Intelligence and Reasoning",
    correct: 1,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:12",
    accuracy: "94%",
  },
  {
    id: "q-9",
    number: 9,
    text: "Plants release which gas during photosynthesis?",
    options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    section: "General Intelligence and Reasoning",
    correct: 2,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:18",
    accuracy: "85%",
  },
  {
    id: "q-10",
    number: 10,
    text: "Find the next number in the series: 2, 4, 8, 16, ...",
    options: ["24", "30", "32", "20"],
    section: "General Intelligence and Reasoning",
    correct: 2,
    marks: 1.0,
    negative: -0.33,
    status: "not-visited",
    timeTaken: "00:00",
    avgTime: "00:15",
    accuracy: "92%",
  }
];

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [reattemptMode, setReattemptMode] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number | null>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<number, string>>(
    mockQuestions.reduce((acc, q, idx) => ({ ...acc, [idx]: idx === 0 ? "visited" : "not-visited" }), {})
  );
  
  // Slider State
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    duration: 25,
    watchDrag: true 
  });

  // Timer State
  const [secondsLeft, setSecondsLeft] = useState(35 * 60);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const navigateTo = useCallback((idx: number) => {
    setCurrentIdx(idx);
    if (questionStatus[idx] === "not-visited") {
      setQuestionStatus(prev => ({ ...prev, [idx]: "visited" }));
    }
    if (emblaApi) emblaApi.scrollTo(idx);
  }, [emblaApi, questionStatus]);

  // Sync Carousel Scroll to State
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      const snapIndex = emblaApi.selectedScrollSnap();
      if (snapIndex !== currentIdx) {
        setCurrentIdx(snapIndex);
        if (questionStatus[snapIndex] === "not-visited") {
          setQuestionStatus(prev => ({ ...prev, [snapIndex]: "visited" }));
        }
      }
    };

    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, currentIdx, questionStatus]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f4f7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">Preparing Exam Hall</p>
            <p className="text-[10px] text-slate-400 font-medium">Please wait while we secure your environment...</p>
          </div>
        </div>
      </div>
    );
  }

  const id = params?.id ? String(params.id) : "demo";
  const currentQ = mockQuestions[currentIdx];

  const handleOptionSelect = (idx: number) => {
    setSelectedOptions({ ...selectedOptions, [currentIdx]: idx });
    setQuestionStatus({ ...questionStatus, [currentIdx]: "answered" });
  };

  const clearSelection = () => {
    const newOptions = { ...selectedOptions };
    delete newOptions[currentIdx];
    setSelectedOptions(newOptions);
    setQuestionStatus({ ...questionStatus, [currentIdx]: "visited" });
  };

  const markForReview = () => {
    setQuestionStatus({ ...questionStatus, [currentIdx]: "marked" });
    if (currentIdx < mockQuestions.length - 1) {
      navigateTo(currentIdx + 1);
    }
  };

  const handleSaveAndNext = () => {
    if (currentIdx < mockQuestions.length - 1) {
      navigateTo(currentIdx + 1);
    } else {
      setShowSubmit(true);
    }
  };

  const getStatusColor = (idx: number) => {
    const status = questionStatus[idx];
    if (idx === currentIdx) return "ring-2 ring-offset-1 ring-primary border-primary";
    
    switch (status) {
      case "answered": return "bg-blue-500 text-white border-blue-600";
      case "visited": return "bg-slate-400 text-white border-slate-500";
      case "marked": return "bg-[#e91e63] text-white border-[#c2185b]";
      default: return "bg-white text-slate-800 border-slate-200";
    }
  };

  const stats = {
    answered: Object.values(questionStatus).filter(s => s === "answered").length,
    unattempted: Object.values(questionStatus).filter(s => s === "visited" || s === "not-visited").length,
    notVisited: Object.values(questionStatus).filter(s => s === "not-visited").length,
    marked: Object.values(questionStatus).filter(s => s === "marked").length,
  };

  const MobileQuestionPalette = () => (
    <div className="flex flex-col h-full bg-white relative">
      <Tabs defaultValue="grid" className="w-full flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 bg-slate-50 h-14 p-0 rounded-none border-b shrink-0">
          <TabsTrigger value="grid" className="h-full font-bold text-xs rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-slate-900 border-r">Grid View</TabsTrigger>
          <TabsTrigger value="list" className="h-full font-bold text-xs rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-slate-900">List View</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
          <div className="flex items-center gap-3 py-2 border-b">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Info className="h-4 w-4 text-slate-600" />
            </div>
            <span className="text-sm font-bold text-slate-700">View Instructions</span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-[#e91e63]"><Star className="h-4 w-4 fill-current" /></div>
              <span className="text-[11px] font-medium text-slate-500">Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-400" />
              <span className="text-[11px] font-medium text-slate-500">Unattempted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
              <span className="text-[11px] font-medium text-slate-500">Unseen</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-[11px] font-medium text-slate-500">Attempted</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between group cursor-pointer">
              <h3 className="text-sm font-bold text-slate-800 flex-1">General Intelligence and Reasoning</h3>
              <ChevronUp className="h-4 w-4 text-slate-400" />
            </div>

            <div className="flex items-center gap-4 py-2 border-t border-b border-dashed">
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 text-[#e91e63] fill-current" />
                <span className="text-xs font-bold text-slate-700">{stats.marked}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-slate-700">{stats.answered}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-xs font-bold text-slate-700">{stats.unattempted}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border border-slate-200" />
                <span className="text-xs font-bold text-slate-700">{stats.notVisited}</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {mockQuestions.map((q, i) => (
                <button
                  key={q.id}
                  className={cn(
                    "w-11 h-11 rounded-xl border font-bold text-sm flex items-center justify-center transition-all shadow-sm active:scale-95",
                    getStatusColor(i)
                  )}
                  onClick={() => navigateTo(i)}
                >
                  {q.number}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Tabs>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 uppercase tracking-wide rounded-xl shadow-lg shadow-primary/20"
          onClick={() => setShowSubmit(true)}
        >
          Submit Test
        </Button>
      </div>
    </div>
  );

  const DesktopQuestionPalette = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 grid grid-cols-2 gap-2 bg-white shrink-0 border-b">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div className="w-5 h-5 rounded-md bg-green-600 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">{stats.answered}</div>
          <span className="text-[10px] font-bold text-slate-600">Answered</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div className="w-5 h-5 rounded-md bg-red-600 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">{stats.unattempted}</div>
          <span className="text-[10px] font-bold text-slate-600">Skipped</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div className="w-5 h-5 rounded-md bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">{stats.marked}</div>
          <span className="text-[10px] font-bold text-slate-600">Marked</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div className="w-5 h-5 rounded-md bg-white border border-slate-300 text-[10px] font-bold text-slate-800 flex items-center justify-center shadow-sm">{stats.notVisited}</div>
          <span className="text-[10px] font-bold text-slate-600">Not Visited</span>
        </div>
      </div>
      <div className="bg-primary/5 px-4 py-2 border-b border-primary/10">
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
          Palette: {currentQ.section}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-3">
          {mockQuestions.map((q, i) => (
            <button
              key={q.id}
              className={cn(
                "w-9 h-9 rounded-xl border-b-4 text-[11px] font-bold flex items-center justify-center transition-all hover:scale-110 shadow-sm active:scale-95",
                getStatusColor(i)
              )}
              onClick={() => navigateTo(i)}
            >
              {q.number}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3 shrink-0 bg-slate-50 border-t">
        <Button size="sm" variant="outline" className="bg-white border-slate-200 text-slate-600 text-[10px] font-bold h-9 rounded-xl hover:bg-slate-100">
          Question Paper
        </Button>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-[10px] font-bold h-9 rounded-xl shadow-md shadow-primary/10" onClick={() => setShowSubmit(true)}>
          Submit
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <header className="md:hidden bg-slate-950 text-white px-4 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full border-2 border-white/10 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent animate-[spin_4s_linear_infinite]" />
            <Clock className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="text-sm font-bold tracking-tight">{formatTime(secondsLeft)}</span>
            <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider truncate max-w-[160px]">
              {id.toUpperCase()}: {currentQ.section}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-9 w-9">
            <Languages className="h-4 w-4" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[320px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Question Palette</SheetTitle>
              </SheetHeader>
              <MobileQuestionPalette />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <header className="hidden md:flex bg-slate-900 text-white px-4 py-2 items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold uppercase tracking-wide">RRB Group D Mock</h1>
            <p className="text-[11px] opacity-90 truncate max-w-[200px]">Test ID: {id.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold bg-white/10 px-4 py-1 rounded-full border border-white/10">
           <Clock className="h-4 w-4 mr-2 text-primary" /> {formatTime(secondsLeft)}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase opacity-60">Rate Test</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3 w-3 text-white/50 fill-white/50" />)}
            </div>
          </div>
          <Button variant="outline" className="h-8 text-[10px] font-bold border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl" asChild>
            <Link href="/analytics">ANALYTICS</Link>
          </Button>
        </div>
      </header>

      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shadow-sm">
            {currentQ.number}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>00:02</span>
          </div>
          <div className="flex gap-1.5 ml-1">
            <Badge className="bg-green-50 text-green-700 border-green-100 text-[9px] font-bold h-5 px-1.5 rounded-md">+1.0</Badge>
            <Badge className="bg-red-50 text-red-600 border-red-100 text-[9px] font-bold h-5 px-1.5 rounded-md">-0.33</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <Bookmark className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
          <Star className="h-4 w-4 cursor-pointer hover:text-yellow-500 transition-colors" />
        </div>
      </div>

      <nav className="hidden md:flex bg-white border-b px-4 py-1.5 items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase mr-2 shrink-0">Sections</span>
          {["General Intelligence and Reasoning"].map((sec) => {
            const isActive = currentQ.section === sec;
            return (
              <button
                key={sec}
                onClick={() => {
                  const firstIdx = mockQuestions.findIndex(q => q.section === sec);
                  if (firstIdx !== -1) navigateTo(firstIdx);
                }}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap",
                  isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-transparent text-slate-600 hover:bg-slate-100"
                )}
              >
                {sec}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500">Language</span>
          <select className="text-[11px] border rounded-lg px-2 py-1 bg-slate-50 font-bold outline-none border-slate-200">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative md:border-r">
          <div className="hidden md:flex flex-wrap items-center gap-3 px-4 py-2 bg-slate-50 border-b shrink-0">
            <span className="text-sm font-bold text-slate-800">Q No. {currentQ.number}</span>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-blue-500" />
                <span>Avg: {currentQ.avgTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Marks:</span>
                <span className="bg-green-100 text-green-700 px-1.5 rounded-md">{currentQ.marks}</span>
              </div>
              <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 font-bold h-5 rounded-md">
                {currentQ.accuracy} accuracy
              </Badge>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button onClick={markForReview} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors">
                <Bookmark className="h-3 w-3" /> Mark
              </button>
              <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-red-500 transition-colors">
                <Flag className="h-3 w-3" /> Report
              </button>
            </div>
          </div>

          {/* Swipeable Question Slider */}
          <div className="flex-1 overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {mockQuestions.map((q, qIdx) => (
                <div key={q.id} className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto p-4 md:p-10 pb-24 md:pb-10">
                  <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
                    <p className="text-[15px] md:text-xl text-slate-800 leading-relaxed font-semibold">
                      {q.text}
                    </p>

                    <div className="space-y-3">
                      {q.options.map((opt, i) => {
                        const isSelected = selectedOptions[qIdx] === i;
                        return (
                          <button 
                            key={i} 
                            onClick={() => handleOptionSelect(i)}
                            className={cn(
                              "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group shadow-sm",
                              isSelected 
                                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                : "border-slate-100 bg-white hover:border-slate-300"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border shrink-0 transition-colors",
                              isSelected ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300"
                            )}>
                              {i + 1}
                            </div>
                            <span className={cn(
                              "text-sm font-medium",
                              isSelected ? "text-primary font-bold" : "text-slate-700"
                            )}>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-between px-4 gap-2 z-20">
            <Button 
              variant="outline" 
              className="flex-1 h-10 border-slate-200 text-slate-600 font-bold text-[10px] rounded-xl px-0 uppercase tracking-tight"
              onClick={markForReview}
            >
              Mark & Next
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-10 border-slate-200 text-slate-600 font-bold text-[10px] rounded-xl px-0 uppercase tracking-tight"
              onClick={clearSelection}
            >
              Clear
            </Button>
            <Button 
              className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white font-bold text-[10px] rounded-xl px-0 uppercase tracking-tight shadow-lg shadow-primary/20"
              onClick={handleSaveAndNext}
            >
              Save & Next
            </Button>
          </footer>

          <footer className="hidden md:flex h-16 border-t bg-white items-center justify-between px-4 md:px-6 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <Button 
              variant="outline" 
              className="bg-slate-100 border-none text-slate-600 font-bold h-10 px-4 md:px-6 text-[11px] rounded-xl hover:bg-slate-200 transition-colors"
              onClick={() => navigateTo(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Re-attempt</span>
              <Switch checked={reattemptMode} onCheckedChange={setReattemptMode} className="data-[state=checked]:bg-primary" />
            </div>

            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold h-10 px-6 md:px-12 text-[11px] rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              onClick={handleSaveAndNext}
            >
              {currentIdx === mockQuestions.length - 1 ? "Finish Test" : "Next Question"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </footer>
        </div>

        <div className="hidden md:flex w-[300px] bg-white border-l flex-col shrink-0 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
                <UserIcon className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">
                {user?.displayName || "Demo Student"}
              </span>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
          <DesktopQuestionPalette />
        </div>
      </div>

      <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
        <DialogContent className="max-w-[340px] rounded-[2.5rem] p-4 md:p-6 space-y-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Submit Test Confirmation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-0.5">
            {/* Time Left Row */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3 text-slate-500">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Time Left</span>
              </div>
              <span className="text-sm font-bold text-primary">{formatTime(secondsLeft)}</span>
            </div>
            <Separator className="bg-slate-100/80" />

            {/* Attempted Row */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3 text-slate-500">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Attempted</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{stats.answered}</span>
            </div>
            <Separator className="bg-slate-100/80" />

            {/* Unattempted Row */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3 text-slate-500">
                <CircleMinus className="h-5 w-5" />
                <span className="text-sm font-medium">Unattempted</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{mockQuestions.length - stats.answered}</span>
            </div>
            <Separator className="bg-slate-100/80" />

            {/* Marked Row */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3 text-slate-500">
                <Star className="h-5 w-5" />
                <span className="text-sm font-medium">Marked</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{stats.marked}</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
              Are you sure you want to submit the test?
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-2">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl text-base shadow-sm"
              onClick={() => router.push(`/analytics`)}
            >
              Yes
            </Button>
            <Button 
              variant="secondary"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold h-12 rounded-2xl text-base"
              onClick={() => setShowSubmit(false)}
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
