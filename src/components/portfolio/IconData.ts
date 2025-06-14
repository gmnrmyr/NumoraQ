
import { 
  Bitcoin, Coins, Building, Banknote, Plus, Trash2, 
  Wallet, CreditCard, PiggyBank, TrendingUp, DollarSign,
  Landmark, Gift, Shield, Target, Zap, Gem, Star,
  Users, Globe, Smartphone, Monitor, Car, Home,
  Briefcase, GraduationCap, Heart, Music, Gamepad2,
  Camera, Palette, Coffee, Book, Plane, ShoppingBag
} from "lucide-react";

export const iconMap: { [key: string]: any } = {
  // Financial
  Bitcoin, Coins, Building, Banknote, Wallet, CreditCard, 
  PiggyBank, TrendingUp, DollarSign, Landmark, Gift,
  
  // Investment & Trading
  Shield, Target, Zap, Gem, Star,
  
  // Tech & Digital
  Users, Globe, Smartphone, Monitor, Gamepad2,
  
  // Physical Assets
  Car, Home, Camera, Book,
  
  // Business & Professional
  Briefcase, GraduationCap, Palette,
  
  // Lifestyle & Entertainment
  Heart, Music, Coffee, Plane, ShoppingBag
};

export const iconOptions = [
  // Financial Icons
  { value: 'Bitcoin', label: 'Bitcoin', category: 'Crypto' },
  { value: 'Coins', label: 'Coins', category: 'Crypto' },
  { value: 'Wallet', label: 'Wallet', category: 'Financial' },
  { value: 'CreditCard', label: 'Credit Card', category: 'Financial' },
  { value: 'PiggyBank', label: 'Savings', category: 'Financial' },
  { value: 'TrendingUp', label: 'Stocks/Growth', category: 'Investment' },
  { value: 'DollarSign', label: 'Cash', category: 'Financial' },
  { value: 'Landmark', label: 'Bank/Institution', category: 'Financial' },
  
  // Investment & Assets
  { value: 'Shield', label: 'Insurance/Protection', category: 'Investment' },
  { value: 'Target', label: 'Goal/Target', category: 'Investment' },
  { value: 'Zap', label: 'Energy/Fast', category: 'Investment' },
  { value: 'Gem', label: 'Precious/Rare', category: 'Investment' },
  { value: 'Star', label: 'Premium/Star', category: 'Investment' },
  { value: 'Gift', label: 'Gift/Bonus', category: 'Investment' },
  
  // Tech & Digital
  { value: 'Users', label: 'Social/Community', category: 'Tech' },
  { value: 'Globe', label: 'Global/Web', category: 'Tech' },
  { value: 'Smartphone', label: 'Mobile/App', category: 'Tech' },
  { value: 'Monitor', label: 'Computer/Digital', category: 'Tech' },
  { value: 'Gamepad2', label: 'Gaming/NFT', category: 'Tech' },
  
  // Physical Assets
  { value: 'Building', label: 'Real Estate', category: 'Physical' },
  { value: 'Home', label: 'House/Property', category: 'Physical' },
  { value: 'Car', label: 'Vehicle', category: 'Physical' },
  { value: 'Camera', label: 'Equipment', category: 'Physical' },
  { value: 'Book', label: 'Books/Education', category: 'Physical' },
  
  // Business & Professional
  { value: 'Briefcase', label: 'Business', category: 'Business' },
  { value: 'GraduationCap', label: 'Education', category: 'Business' },
  { value: 'Palette', label: 'Creative/Art', category: 'Business' },
  
  // Lifestyle
  { value: 'Heart', label: 'Health/Personal', category: 'Lifestyle' },
  { value: 'Music', label: 'Entertainment', category: 'Lifestyle' },
  { value: 'Coffee', label: 'Food/Lifestyle', category: 'Lifestyle' },
  { value: 'Plane', label: 'Travel', category: 'Lifestyle' },
  { value: 'ShoppingBag', label: 'Shopping/Retail', category: 'Lifestyle' },
  { value: 'Banknote', label: 'Cash/Money', category: 'Financial' }
];

export const groupedIcons = iconOptions.reduce((acc, icon) => {
  if (!acc[icon.category]) {
    acc[icon.category] = [];
  }
  acc[icon.category].push(icon);
  return acc;
}, {} as Record<string, typeof iconOptions>);
