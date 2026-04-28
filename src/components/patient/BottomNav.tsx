import React from 'react';
import { Home, Calendar, BrainCircuit, BookOpen, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'appointments', label: t('appointments'), icon: Calendar },
    { id: 'ai', label: t('ai_assistant'), icon: BrainCircuit },
    { id: 'blog', label: t('blog'), icon: BookOpen },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <div className="h-16 bg-white border-t border-slate-200 flex justify-around items-center px-2 pb-safe shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors duration-200 ${
              isActive ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-full transition-colors ${isActive ? 'bg-sky-50' : 'bg-transparent'}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
