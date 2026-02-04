import { Link } from "react-router-dom";
import casablueLogo from "@/assets/casablue-logo-transparent.png";

interface FooterLink {
  label: string;
  href: string;
  isRoute?: boolean;
}

interface FooterLinks {
  [category: string]: FooterLink[];
}

const footerLinks: FooterLinks = {
  المنتج: [
    { label: "ماسح الأسهم", href: "/screener", isRoute: true },
    { label: "تحليل الأسهم", href: "/markets", isRoute: true },
    { label: "صناديق OPCVM", href: "/funds", isRoute: true },
    { label: "القطاعات", href: "/sectors", isRoute: true },
  ],
  الشركة: [
    { label: "من نحن", href: "#" },
    { label: "المدونة", href: "/blog", isRoute: true },
    { label: "تواصل معنا", href: "mailto:contact@casabourse.ma" },
  ],
  القانوني: [
    { label: "شروط الاستخدام", href: "/terms", isRoute: true },
    { label: "سياسة الخصوصية", href: "/privacy", isRoute: true },
    { label: "إخلاء المسؤولية", href: "/disclaimer", isRoute: true },
  ],
  الموارد: [
    { label: "مركز المساعدة", href: "#" },
    { label: "التعليم", href: "#" },
    { label: "الأسئلة الشائعة", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={casablueLogo}
                alt="Casablue"
                className="w-12 h-12 object-contain drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Casablue</span>
                <span className="text-[10px] text-muted-foreground">Bourse de Casablanca</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              المنصّة المغربية للذكاء المالي. بيانات موثّقة، تحليلات شفافة، وشروحات عربية.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-secondary/50 rounded-xl p-4 mb-8">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">تنويه:</strong> المحتوى المقدّم على هذه المنصّة لأغراض معلوماتية وتعليمية فقط، ولا يشكل توصية استثمارية شخصية أو نصيحة مالية.
            لا نضمن اكتمال أو دقة البيانات في الوقت الحقيقي، يرجى مراجعة المصادر الرسمية. الأداء التاريخي لا يضمن النتائج المستقبلية.
            استشر مختصاً مالياً قبل اتخاذ أي قرار استثماري.{" "}
            <Link to="/disclaimer" className="text-primary hover:underline">اقرأ المزيد</Link>
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2026 CasaBourse.ma. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">مصادر البيانات:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">AMMC</span>
              <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">Bourse de Casablanca</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
