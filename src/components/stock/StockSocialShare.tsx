import { motion } from "framer-motion";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2, 
  MessageCircle,
  Check,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface StockSocialShareProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    change: number;
  };
}

const StockSocialShare = ({ stock }: StockSocialShareProps) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${stock.name} (${stock.symbol}) - ${stock.price.toFixed(2)} MAD ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%`;
  
  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#1877f2] hover:text-white",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-[#1da1f2] hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(stock.name)}`,
      color: "hover:bg-[#0a66c2] hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: "hover:bg-[#25d366] hover:text-white",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("تم نسخ الرابط!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("فشل نسخ الرابط");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <span className="text-xs text-muted-foreground hidden sm:inline">مشاركة:</span>
      
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-lg bg-secondary/50 text-muted-foreground transition-all ${link.color}`}
          title={`مشاركة على ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
        title="نسخ الرابط"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </motion.div>
  );
};

export default StockSocialShare;
