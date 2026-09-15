import React from 'react';
import { Home, History, BarChart3, Settings, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onQuickAdd?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onQuickAdd }) => {
  return (
    <div
      id="app-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-lg border-t border-[#E2E8F0] dark:border-[#334155] px-3 shadow-lg"
      style={{
        paddingTop: '8px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-between">

        {/* Tab 1: Home (خانه) */}
        <button
          id="nav-tab-home"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === 'home'
              ? 'text-[#2D9CFF] scale-105'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'home' ? 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF]' : ''
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10.5px] font-bold mt-0.5">خانه</span>
        </button>

        {/* Tab 2: History (تاریخچه) */}
        <button
          id="nav-tab-history"
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === 'history'
              ? 'text-[#2D9CFF] scale-105'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'history' ? 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF]' : ''
            }`}
          >
            <History className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10.5px] font-bold mt-0.5">تاریخچه</span>
        </button>

        {/* Center Quick Add Button (+) */}
        {onQuickAdd && (
          <div className="flex flex-col items-center justify-center -mt-5 px-1">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              id="nav-quick-add-btn"
              onClick={onQuickAdd}
              title="ثبت سریع ۱ لیوان آب"
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E70E8] via-[#2D9CFF] to-[#56B7FF] text-white shadow-lg shadow-[#2D9CFF]/40 flex items-center justify-center border-3 border-white dark:border-[#1E293B] cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </motion.button>
            <span className="text-[10px] font-extrabold text-[#2D9CFF] dark:text-[#56B7FF] mt-1">
              نوشیدن
            </span>
          </div>
        )}

        {/* Tab 3: Stats (گزارش) */}
        <button
          id="nav-tab-stats"
          onClick={() => onTabChange('stats')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === 'stats'
              ? 'text-[#2D9CFF] scale-105'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'stats' ? 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF]' : ''
            }`}
          >
            <BarChart3 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10.5px] font-bold mt-0.5">گزارش</span>
        </button>

        {/* Tab 4: Settings (پروفایل و تنظیمات) */}
        <button
          id="nav-tab-settings"
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
            activeTab === 'settings'
              ? 'text-[#2D9CFF] scale-105'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'settings' ? 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF]' : ''
            }`}
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10.5px] font-bold mt-0.5">تنظیمات</span>
        </button>
      </div>
    </div>
  );
};

