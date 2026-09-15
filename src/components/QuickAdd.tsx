import React from 'react';
import { motion } from 'motion/react';
import { Plus, Sliders } from 'lucide-react';
import { formatGlasses, strings } from '../constants/strings';

interface QuickAddProps {
  onAdd: (glasses: number) => void;
  onOpenCustom: () => void;
}

const QUICK_AMOUNTS = [
  { amount: 0.5, label: 'نصف لیوان', icon: '' },
  { amount: 1, label: '۱ لیوان', icon: '' },
  { amount: 2, label: '۲ لیوان', icon: '' },
  { amount: 3, label: '۳ لیوان', icon: '' },
];

export const QuickAdd: React.FC<QuickAddProps> = ({ onAdd, onOpenCustom }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#153F4B] dark:text-[#E6F5F3]">
          {strings.quickAdd}
        </h3>
        <button
          id="open-custom-amount-btn"
          onClick={onOpenCustom}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#168C9B] dark:text-[#5BD0CD] hover:opacity-80 transition-opacity px-2.5 py-1 rounded-xl bg-[#DDF3F1]/60 dark:bg-[#214D54]/50"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{strings.customAmount}</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {QUICK_AMOUNTS.map((item) => (
          <motion.button
            key={item.amount}
            id={`quick-add-${item.amount}-glass`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAdd(item.amount)}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#173E46] border border-[#D7E9E7] dark:border-[#2A5C63] shadow-xs hover:border-[#168C9B]/40 dark:hover:border-[#5BD0CD]/40 hover:bg-[#F3FBFA] dark:hover:bg-[#1A454E] transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[#DDF3F1] dark:bg-[#214D54] flex items-center justify-center text-[#168C9B] dark:text-[#5BD0CD] mb-1.5 group-hover:scale-110 transition-transform text-sm">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-sm sm:text-base font-black text-[#168C9B] dark:text-[#5BD0CD]">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
