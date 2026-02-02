import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { z } from "zod";
import casablueLogo from "@/assets/casablue-logo.jpeg";

// Validation schemas
const emailSchema = z.string().email({ message: "البريد الإلكتروني غير صالح" });
const passwordSchema = z.string().min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });

type AuthMode = "login" | "register" | "forgot";

const Auth = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  const [resetSent, setResetSent] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; fullName?: string } = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    if (mode !== "forgot") {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
    }

    if (mode === "register" && !fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "خطأ في تسجيل الدخول",
              description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك مجدداً",
          });
        }
      } else if (mode === "register") {
        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "الحساب موجود مسبقاً",
              description: "هذا البريد الإلكتروني مسجل بالفعل. جرب تسجيل الدخول",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: "يمكنك الآن استخدام حسابك",
          });
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`,
        });

        if (error) throw error;

        setResetSent(true);
        toast({
          title: "تم إرسال رابط الاستعادة",
          description: "تحقق من بريدك الإلكتروني لاستعادة كلمة المرور",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const modeConfig = {
    login: {
      title: "تسجيل الدخول",
      subtitle: "مرحباً بك مجدداً في كازابلو",
      buttonText: "تسجيل الدخول",
      switchText: "ليس لديك حساب؟",
      switchLink: "إنشاء حساب جديد",
      switchMode: "register" as AuthMode,
    },
    register: {
      title: "إنشاء حساب",
      subtitle: "انضم إلى كازابلو واكتشف الفرص",
      buttonText: "إنشاء حساب",
      switchText: "لديك حساب بالفعل؟",
      switchLink: "تسجيل الدخول",
      switchMode: "login" as AuthMode,
    },
    forgot: {
      title: "استعادة كلمة المرور",
      subtitle: "أدخل بريدك الإلكتروني لاستعادة كلمة المرور",
      buttonText: "إرسال رابط الاستعادة",
      switchText: "تذكرت كلمة المرور؟",
      switchLink: "العودة لتسجيل الدخول",
      switchMode: "login" as AuthMode,
    },
  };

  const config = modeConfig[mode];

  return (
    <div className="min-h-screen bg-background flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <img
              src={casablueLogo}
              alt="Casablue"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <span className="text-2xl font-bold text-foreground">كازابلو</span>
          </Link>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{config.title}</h1>
            <p className="text-muted-foreground">{config.subtitle}</p>
          </div>

          {/* Reset Password Success */}
          {resetSent && mode === "forgot" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">تم إرسال الرابط</h3>
              <p className="text-muted-foreground text-sm mb-4">
                تحقق من بريدك الإلكتروني واتبع التعليمات لاستعادة كلمة المرور
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setMode("login");
                  setResetSent(false);
                }}
              >
                العودة لتسجيل الدخول
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Google Auth */}
              {mode !== "forgot" && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full mb-6 h-12 gap-3"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    المتابعة مع Google
                  </Button>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-4 text-muted-foreground">أو</span>
                    </div>
                  </div>
                </>
              )}

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {/* Full Name - Register only */}
                <AnimatePresence mode="wait">
                  {mode === "register" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label htmlFor="fullName" className="text-foreground">الاسم الكامل</Label>
                      <div className="relative mt-1.5">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="أدخل اسمك الكامل"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`h-12 pr-10 ${errors.fullName ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.fullName}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-foreground">البريد الإلكتروني</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`h-12 pr-10 ${errors.email ? 'border-destructive' : ''}`}
                      dir="ltr"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password - Not for forgot mode */}
                <AnimatePresence mode="wait">
                  {mode !== "forgot" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-foreground">كلمة المرور</Label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => setMode("forgot")}
                            className="text-sm text-primary hover:underline"
                          >
                            نسيت كلمة المرور؟
                          </button>
                        )}
                      </div>
                      <div className="relative mt-1.5">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`h-12 pr-10 pl-10 ${errors.password ? 'border-destructive' : ''}`}
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.password}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 gap-2 mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {config.buttonText}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Switch Mode */}
              <p className="text-center text-muted-foreground mt-6">
                {config.switchText}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(config.switchMode);
                    setErrors({});
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {config.switchLink}
                </button>
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 via-background to-green-500/10 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(41,98,255,0.2)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-green-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 animate-pulse" />
              <img
                src={casablueLogo}
                alt="Casablue"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-primary/50"
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-foreground mb-4"
          >
            منصتك الأولى للاستثمار
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            انضم إلى آلاف المستثمرين الذين يستخدمون كازابلو لتتبع وتحليل سوق الأسهم المغربية
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { value: "75+", label: "سهم" },
              { value: "14", label: "قطاع" },
              { value: "10K+", label: "مستخدم" },
            ].map((stat, i) => (
              <div key={i} className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
