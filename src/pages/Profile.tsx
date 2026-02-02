import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Camera,
  LogOut,
  Save,
  Loader2,
  Calendar,
  Shield,
  Settings,
  Key,
  Bell,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, profile, signOut, updateProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "تم تسجيل الخروج",
      description: "إلى اللقاء!",
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl || null,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "تم الحفظ",
        description: "تم تحديث معلومات حسابك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);

      toast({
        title: "تم رفع الصورة",
        description: "تم تحديث صورة الملف الشخصي بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع الصورة. تأكد من إعداد bucket التخزين في Supabase.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              العودة
            </button>

            <h1 className="text-3xl font-bold text-foreground mb-2">الملف الشخصي</h1>
            <p className="text-muted-foreground">إدارة معلومات حسابك الشخصي</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1"
            >
              <Card>
                <CardContent className="pt-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-4 border-primary/20">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {profile?.full_name ? getInitials(profile.full_name) : <User className="w-8 h-8" />}
                        </AvatarFallback>
                      </Avatar>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </label>
                    </div>

                    <h2 className="mt-4 text-xl font-semibold text-foreground">
                      {profile?.full_name || "مستخدم كازابلو"}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>

                  <Separator className="my-6" />

                  {/* Account Info */}
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        تاريخ الانضمام: {profile?.created_at ? formatDate(profile.created_at) : "غير متوفر"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>حساب مجاني</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Sign Out */}
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 space-y-6"
            >
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>المعلومات الشخصية</CardTitle>
                      <CardDescription>تحديث اسمك ومعلومات الاتصال</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">الاسم الكامل</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="أدخل اسمك الكامل"
                            className="pr-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="pr-10 bg-muted"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">رابط صورة الملف الشخصي</Label>
                      <Input
                        id="avatarUrl"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        dir="ltr"
                      />
                      <p className="text-xs text-muted-foreground">
                        يمكنك إدخال رابط صورة مباشرة أو رفع صورة من خلال النقر على الصورة الشخصية
                      </p>
                    </div>

                    <Button type="submit" className="gap-2" disabled={saving}>
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      حفظ التغييرات
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>الأمان</CardTitle>
                      <CardDescription>إدارة إعدادات الأمان لحسابك</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">كلمة المرور</p>
                        <p className="text-sm text-muted-foreground">آخر تحديث منذ 30 يومًا</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (user?.email) {
                          await supabase.auth.resetPasswordForEmail(user.email, {
                            redirectTo: `${window.location.origin}/auth?mode=reset`,
                          });
                          toast({
                            title: "تم الإرسال",
                            description: "تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني",
                          });
                        }
                      }}
                    >
                      تغيير
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">المصادقة الثنائية</p>
                        <p className="text-sm text-muted-foreground">غير مفعّلة</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      قريبًا
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>التفضيلات</CardTitle>
                      <CardDescription>إدارة تفضيلات الإشعارات والعرض</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">إشعارات البريد الإلكتروني</p>
                        <p className="text-sm text-muted-foreground">تلقي تحديثات السوق والأخبار</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      قريبًا
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">منطقة الخطر</CardTitle>
                  <CardDescription>إجراءات لا يمكن التراجع عنها</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div>
                      <p className="font-medium text-foreground">حذف الحساب</p>
                      <p className="text-sm text-muted-foreground">حذف حسابك وجميع بياناتك بشكل نهائي</p>
                    </div>
                    <Button variant="destructive" size="sm" disabled>
                      حذف الحساب
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
