import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Check, Droplets, Sparkles } from 'lucide-react';
import { formatNumber, formatGlasses, strings } from '../constants/strings';

export interface CupSize {
  id: string;
  name: string;
  volumeMl: number;
  glasses: number;
  iconType: 'cup' | 'glass' | 'mug' | 'bottle' | 'flask';
  description: string;
}

export const COMMON_CUP_SIZES: CupSize[] = [
  {
    id: 'cup-200',
    name: 'فنجان / استکان',
    volumeMl: 200,
    glasses: 0.8,
    iconType: 'cup',
    description: '۲۰۰ میلی‌لیتر',
  },
  {
    id: 'cup-250',
    name: 'لیوان معمولی',
    volumeMl: 250,
    glasses: 1,
    iconType: 'glass',
    description: '۲۵۰ میلی‌لیتر',
  },
  {
    id: 'cup-300',
    name: 'ماگ / لیوان بزرگ',
    volumeMl: 300,
    glasses: 1.2,
    iconType: 'mug',
    description: '۳۰۰ میلی‌لیتر',
  },
  {
    id: 'cup-500',
    name: 'قمقمه / بطری',
    volumeMl: 500,
    glasses: 2,
    iconType: 'bottle',
    description: '۵۰۰ میلی‌لیتر',
  },
  {
    id: 'cup-750',
    name: 'بطری بزرگ',
    volumeMl: 750,
    glasses: 3,
    iconType: 'flask',
    description: '۷۵۰ میلی‌لیتر',
  },
];

interface CupSelectorProps {
  onAddWater: (glasses: number) => void;
  selectedCupId?: string;
  onSelectCup?: (cup: CupSize) => void;
}

export const CupSelector: React.FC<CupSelectorProps> = ({
  onAddWater,
}) => {
  const [selectedId, setSelectedId] = useState<string>('cup-250');
  const [multiplier, setMultiplier] = useState<number>(1);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const selectedCup = COMMON_CUP_SIZES.find((c) => c.id === selectedId) || COMMON_CUP_SIZES[1];

  const handleSelect = (cup: CupSize) => {
    setSelectedId(cup.id);
  };

  const handleAddSelected = (cup?: CupSize, count: number = multiplier) => {
    const targetCup = cup || selectedCup;
    const totalGlasses = Math.round(targetCup.glasses * count * 10) / 10;
    onAddWater(totalGlasses);

    setJustAddedId(targetCup.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 900);
  };

  // Render SVG Icon depending on cup type
  const renderCupIcon = (type: CupSize['iconType'], isSelected: boolean) => {
    switch (type) {
      case 'cup':
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        );
      case 'mug':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a3 3 0 0 1 0 6h-1" />
            <path d="M5 6h13v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z" />
            <line x1="5" y1="10" x2="18" y2="10" strokeDasharray="2 2" />
          </svg>
        );
      case 'bottle':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2h4" />
            <path d="M10 2v3a2 2 0 0 1-1 1.73A4 4 0 0 0 7 10v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10a4 4 0 0 0-2-3.27A2 2 0 0 1 14 5V2" />
            <line x1="7" y1="14" x2="17" y2="14" />
          </svg>
        );
      case 'flask':
        return (
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2h6" />
            <path d="M10 2v4a3 3 0 0 1-.8 2L5 18a2 2 0 0 0 1.6 3h10.8a2 2 0 0 0 1.6-3L14.8 8A3 3 0 0 1 14 6V2" />
            <line x1="7" y1="15" x2="17" y2="15" strokeDasharray="2 2" />
          </svg>
        );
      case 'glass':
      default:
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4h14l-2 15a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 4Z" />
            <line x1="6" y1="9" x2="18" y2="9" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with Title and Multiplier Quick Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-[#2D9CFF]" />
          <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F8FAFC]">
            انتخاب اندازه لیوان یا ظرف
          </h3>
        </div>

        {/* Multiplier Pills (۱ بار، ۲ بار، ۳ بار) */}
        <div className="flex items-center gap-1 bg-[#E6F4FF] dark:bg-[#1E3A5F] p-1 rounded-xl">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              id={`multiplier-btn-${m}`}
              onClick={() => setMultiplier(m)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                multiplier === m
                  ? 'bg-white dark:bg-[#0B192C] text-[#2D9CFF] shadow-2xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-[#F8FAFC]'
              }`}
            >
              {formatNumber(m)}×
            </button>
          ))}
        </div>
      </div>

      {/* Selectable Cup Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {COMMON_CUP_SIZES.map((cup) => {
          const isSelected = selectedId === cup.id;
          const wasJustAdded = justAddedId === cup.id;
          const calculatedGlasses = Math.round(cup.glasses * multiplier * 10) / 10;

          return (
            <motion.div
              key={cup.id}
              id={`cup-card-${cup.volumeMl}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(cup)}
              className={`relative flex flex-col items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all text-center select-none ${
                isSelected
                  ? 'bg-gradient-to-b from-[#E6F4FF] to-[#D5EDFF] dark:from-[#1E3A5F] dark:to-[#172E4C] border-[#2D9CFF] shadow-md ring-2 ring-[#2D9CFF]/20'
                  : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] hover:border-[#2D9CFF]/40 hover:bg-[#F2F6FA] dark:hover:bg-[#24344D] shadow-2xs'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#2D9CFF] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}

              {/* Volume Tag in ML */}
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full mb-1 ${
                isSelected
                  ? 'bg-[#2D9CFF]/15 text-[#0066CC] dark:bg-[#2D9CFF]/30 dark:text-[#8ED3FF]'
                  : 'bg-[#F1F5F9] dark:bg-[#0B192C] text-[#64748B] dark:text-[#94A3B8]'
              }`}>
                {formatNumber(cup.volumeMl)} ml
              </span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center my-1 transition-all ${
                isSelected
                  ? 'bg-[#2D9CFF] text-white shadow-xs'
                  : 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#2D9CFF]'
              }`}>
                {renderCupIcon(cup.iconType, isSelected)}
              </div>

              {/* Title & Glasses calculation */}
              <div className="mt-1 space-y-0.5">
                <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] line-clamp-1 block">
                  {cup.name}
                </span>
                <span className="text-[11px] font-extrabold text-[#2D9CFF] block">
                  {formatGlasses(calculatedGlasses)}
                </span>
              </div>

              {/* Instant Tap-To-Add Button inside each card */}
              <motion.button
                id={`quick-log-${cup.volumeMl}-btn`}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddSelected(cup, multiplier);
                }}
                className={`mt-2.5 w-full py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  wasJustAdded
                    ? 'bg-[#10B981] text-white'
                    : isSelected
                    ? 'bg-[#2D9CFF] text-white hover:opacity-90 shadow-2xs'
                    : 'bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] hover:bg-[#2D9CFF] hover:text-white'
                }`}
              >
                {wasJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{strings.added}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ثبت {multiplier > 1 ? `(${formatNumber(multiplier)}×)` : ''}</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Action Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] flex items-center justify-center text-[#2D9CFF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] block">
              انتخاب فعلی: {selectedCup.name} ({formatNumber(selectedCup.volumeMl)} میلی‌لیتر)
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              معادل {formatGlasses(Math.round(selectedCup.glasses * multiplier * 10) / 10)} {multiplier > 1 ? `(${formatNumber(multiplier)} مرتبه)` : ''}
            </span>
          </div>
        </div>

        <motion.button
          id="confirm-selected-cup-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleAddSelected()}
          className="px-4 py-2 rounded-xl bg-[#2D9CFF] hover:bg-[#1E70E8] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>ثبت سریع آب</span>
        </motion.button>
      </div>
    </div>
  );
};
