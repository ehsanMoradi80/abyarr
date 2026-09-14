import React from 'react';
import { AppLogo } from './AppLogo';

interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, right, showLogo = false }) => {
  return (
    <div id="app-header" className="flex items-center justify-between pb-3 pt-2">
      <div className="flex items-center gap-3">

        {showLogo && <AppLogo size={32} className="shrink-0" />}
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-[#F8FAFC] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
};
