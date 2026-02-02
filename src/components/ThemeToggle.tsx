import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "black";

const themes = [
  { id: "light" as Theme, label: "أبيض", icon: Sun, description: "وضع النهار" },
  { id: "dark" as Theme, label: "أزرق غامق", icon: Moon, description: "الوضع الليلي" },
  { id: "black" as Theme, label: "أسود", icon: Monitor, description: "AMOLED" },
];

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark", "black"].includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "black");
    root.classList.add(newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const getCurrentIcon = () => {
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      case "black":
        return Monitor;
      default:
        return Moon;
    }
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentIcon className="w-5 h-5" strokeWidth={1.5} />
            </motion.div>
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`flex items-center gap-3 cursor-pointer ${
                isActive ? "bg-primary/10 text-primary" : ""
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.description}</span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeTheme"
                  className="mr-auto w-2 h-2 bg-primary rounded-full"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
