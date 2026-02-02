import { TrendingUp } from "lucide-react";

const footerLinks = {
  المنتج: ["ماسح الأسهم", "تحليل الأسهم", "صناديق OPCVM", "التنبيهات", "API"],
  الشركة: ["من نحن", "الوظائف", "المدونة", "تواصل معنا"],
  القانوني: ["شروط الاستخدام", "سياسة الخصوصية", "المنهجيات", "إخلاء المسؤولية"],
  الموارد: ["مركز المساعدة", "التعليم", "المصطلحات", "الأسئلة الشائعة"],
};

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">مالية</span>
                <span className="text-[10px] text-muted-foreground">Financial Intelligence</span>
              </div>
            </div>
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
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
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
            استشر مختصاً مالياً قبل اتخاذ أي قرار استثماري.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 مالية. جميع الحقوق محفوظة.
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
