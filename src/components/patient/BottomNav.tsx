import React from 'react';
import { Home, Calendar, BrainCircuit, FileText, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'خانه', icon: Home },
    { id: 'appointments', label: 'نوبت ها', icon: Calendar },
    { id: 'ai', label: 'هوش مصنوعی', icon: BrainCircuit },
    { id: 'records', label: 'سوابق', icon: FileText },
    { id: 'profile', label: 'حساب', icon: User },
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
