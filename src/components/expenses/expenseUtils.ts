
import { Home, Heart, Stethoscope, Wifi, Car, ShoppingCart, CreditCard, Plane, User } from "lucide-react";

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "housing": "bg-blue-100 text-blue-800 border-blue-200",
    "health": "bg-green-100 text-green-800 border-green-200",
    "food": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "transportation": "bg-purple-100 text-purple-800 border-purple-200",
    "entertainment": "bg-pink-100 text-pink-800 border-pink-200",
    "utilities": "bg-orange-100 text-orange-800 border-orange-200",
    "personal": "bg-teal-100 text-teal-800 border-teal-200",
    "travel": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "trips": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "other": "bg-gray-100 text-gray-800 border-gray-200"
  };
  return colors[category] || "bg-slate-100 text-slate-800 border-slate-200";
};

export const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    "housing": Home,
    "health": Stethoscope,
    "food": ShoppingCart,
    "transportation": Car,
    "entertainment": Heart,
    "utilities": Wifi,
    "personal": User,
    "travel": Plane,
    "trips": Plane,
    "other": CreditCard
  };
  return icons[category] || Home;
};
