
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/contexts/TranslationContext";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'pt-br', label: 'Português (BR)', flag: '🇧🇷' },
  ];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto min-w-[140px] bg-white/10 border-white/20 text-white hover:bg-white/20">
        <div className="flex items-center gap-2">
          <Globe size={16} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200">
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
