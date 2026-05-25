import React from 'react';
import { Home, Award, Briefcase, User } from 'lucide-react';
import type { LanguageStrings } from '../data/translations';

interface BottomNavProps {
  activeTab: 'home' | 'skills' | 'schemes' | 'profile';
  setActiveTab: (tab: 'home' | 'skills' | 'schemes' | 'profile') => void;
  labels: LanguageStrings;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, labels }) => {
  const navItems = [
    { id: 'home' as const, label: labels.homeTitle, icon: Home },
    { id: 'skills' as const, label: labels.assessmentTitle, icon: Award },
    { id: 'schemes' as const, label: labels.exploreSchemes, icon: Briefcase },
    { id: 'profile' as const, label: labels.profileTitle, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-2 px-4 flex justify-around items-center z-40 max-w-[480px] mx-auto shadow-lg shadow-teal-900/5 dark:bg-slate-900 dark:border-slate-800">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 focus:outline-none ${
              isActive
                ? 'text-teal-600 dark:text-teal-400 scale-105 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'
            }`}
            aria-label={item.label}
          >
            <div className={`p-2 rounded-full transition-colors ${
              isActive ? 'bg-teal-50 dark:bg-teal-950/50' : 'bg-transparent'
            }`}>
              <Icon size={24} className="stroke-[2.25]" />
            </div>
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-wide text-center">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
