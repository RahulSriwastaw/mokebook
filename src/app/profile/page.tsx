
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Target, Calendar, Award, ShieldCheck, Loader2, Save } from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { ProfilePictureUpload } from "@/components/profile/ProfilePictureUpload";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    primaryExam: "JEE",
    targetYear: new Date().getFullYear() + 1,
  });

  const profileRef = useDoc(user ? doc(db, "users", user.uid) : null);

  useEffect(() => {
    if (profileRef.data) {
      setProfileData({
        name: profileRef.data.name || user?.displayName || "",
        email: profileRef.data.email || user?.email || "",
        phone: profileRef.data.phone || "",
        primaryExam: profileRef.data.primaryExam || "JEE",
        targetYear: profileRef.data.targetYear || (new Date().getFullYear() + 1),
      });
    }
  }, [profileRef.data, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    setSaving(true);
    const dataToSave = {
      ...profileData,
      id: user.uid,
      updatedAt: serverTimestamp(),
    };

    setDoc(doc(db, "users", user.uid), dataToSave, { merge: true })
      .then(() => {
        toast({
          title: "Profile Updated",
          description: "Your changes have been saved successfully.",
        });
      })
      .catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: `users/${user.uid}`,
          operation: 'update',
          requestResourceData: dataToSave
        }));
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <header className="space-y-0.5">
              <h1 className="text-xl font-headline font-bold">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your personal information and goals.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1 shadow-sm border-none bg-primary/5">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <ProfilePictureUpload
                    currentPhotoURL={user?.photoURL}
                    displayName={profileData.name}
                    email={profileData.email}
                    size="lg"
                    onUploadSuccess={(url) => {
                      // Force refresh of user data after upload
                      toast({
                        title: "Profile Updated",
                        description: "Your profile picture has been updated!",
                      });
                    }}
                  />
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-headline font-bold">{profileData.name || "Student"}</h2>
                    <p className="text-[11px] text-muted-foreground">{profileData.email}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white text-primary border-primary/20 text-[10px]">
                    <Award className="h-3 w-3 mr-1" /> Silver League
                  </Badge>
                  <div className="w-full pt-3 border-t space-y-2 text-left">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground uppercase font-bold">Level</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '65%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 shadow-sm border-none">
                <CardHeader className="p-5 pb-0">
                  <CardTitle className="text-base font-headline flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" /> Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[10px] font-bold uppercase text-muted-foreground">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            id="name"
                            className="pl-9 h-9 text-xs"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[10px] font-bold uppercase text-muted-foreground">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            id="email"
                            className="pl-9 h-9 text-xs bg-muted/30"
                            disabled
                            value={profileData.email}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-[10px] font-bold uppercase text-muted-foreground">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            id="phone"
                            className="pl-9 h-9 text-xs"
                            placeholder="+91 9876543210"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="exam" className="text-[10px] font-bold uppercase text-muted-foreground">Primary Exam</Label>
                        <div className="relative">
                          <Target className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground z-10" />
                          <Select value={profileData.primaryExam} onValueChange={(v) => setProfileData({ ...profileData, primaryExam: v })}>
                            <SelectTrigger id="exam" className="pl-9 h-9 text-xs">
                              <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JEE">JEE Mains</SelectItem>
                              <SelectItem value="NEET">NEET</SelectItem>
                              <SelectItem value="UPSC">UPSC</SelectItem>
                              <SelectItem value="SSC">SSC CGL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="year" className="text-[10px] font-bold uppercase text-muted-foreground">Target Year</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground z-10" />
                        <Select value={profileData.targetYear.toString()} onValueChange={(v) => setProfileData({ ...profileData, targetYear: parseInt(v) })}>
                          <SelectTrigger id="year" className="pl-9 h-9 text-xs">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary h-9 font-bold mt-2 text-xs" disabled={saving}>
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Save className="h-3.5 w-3.5 mr-2" />}
                      Save Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
