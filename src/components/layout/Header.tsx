import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import casablueLogo from "@/assets/casablue-logo.jpeg";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const navItems = [
    { label: t('common.home'), href: "/" },
    { label: t('common.markets'), href: "/markets" },
    { label: "القطاعات", href: "/sectors" },
    { label: t('common.screener'), href: "/screener" },
    { label: t('common.funds'), href: "/funds" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 theme-transition">
      {/* Glowing bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={casablueLogo}
                  alt="Casablue"
                  className="relative w-10 h-10 rounded-xl object-cover border border-border"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">Casablue</span>
                <span className="text-[10px] text-muted-foreground -mt-1">Bourse de Casablanca</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const active = isActive(item.href);

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg transition-all relative group ${
                      active
                        ? "text-foreground bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Actions */}
          <motion.div
            className="hidden md:flex items-center gap-2"
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ThemeToggle />
            <LanguageSwitcher />

            <div className="w-px h-6 bg-border mx-1" />

            <Link to="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg gap-2"
              >
                <User className="w-4 h-4" strokeWidth={1.5} />
                {t('common.login')}
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg shadow-primary/20"
              >
                {t('common.register')}
              </Button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isMenuOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-border/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-all ${
                      active
                        ? "text-foreground bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex gap-2 pt-4 mt-2 border-t border-border/50">
                <Link to="/auth" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link to="/auth" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                    {t('common.register')}
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
