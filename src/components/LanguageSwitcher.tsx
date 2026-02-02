import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇲🇦' },
  { code: 'fr', name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'es', name: 'Español', dir: 'ltr', flag: '🇪🇸' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'ar');

  useEffect(() => {
    const lang = languages.find(l => l.code === currentLang);
    if (lang) {
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.dir;
    }
  }, [currentLang]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  const current = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] text-white text-sm font-medium transition-colors border border-[#2a2e39]">
        <Globe className="w-4 h-4 text-[#2962ff]" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1e222d] border-[#2a2e39] min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer text-white hover:bg-[#2a2e39] flex items-center gap-3 ${
              currentLang === lang.code ? 'bg-[#2962ff]/20' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
