import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { strings, formatNumber, toEnglishDigits } from '../constants/strings';

interface CustomAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const PRESET_GLASSES = [0.5, 1, 1.5, 2, 3, 4, 5, 6];

export const CustomAmountModal: React.FC<CustomAmountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [value, setValue] = useState('2');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = toEnglishDigits(value).replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanDigits);
    if (isNaN(num) || num < 0.5 || num > 20) {
      setError(strings.amountError);
      return;
    }

    onConfirm(Math.round(num * 10) / 10);
    onClose();
  };

  const handlePreset = (p: number) => {
    setValue(p.toString());
    setError('');
  };

  const handleStep = (delta: number) => {
    const cleanDigits = toEnglishDigits(value).replace(/[^0-9.]/g, '');
    const current = parseFloat(cleanDigits) || 0;
    const next = Math.max(0.5, Math.min(20, Math.round((current + delta) * 10) / 10));
    setValue(next.toString());
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const converted = toEnglishDigits(raw).replace(/[^0-9.]/g, '');
    setValue(converted);
    if (error) setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#153F4B]/50 dark:bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#173E46] p-6 shadow-2xl border border-[#D7E9E7] dark:border-[#2A5C63]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D7E9E7] dark:border-[#2A5C63]">
              <h3 className="text-base font-bold text-[#153F4B] dark:text-[#E6F5F3]">
                {strings.customAmount}
              </h3>
              <button
                id="close-custom-amount-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6C898C] hover:bg-[#E8F3F2] dark:hover:bg-[#1B454D] transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="custom-amount-input"
                  className="block text-xs font-semibold text-[#6C898C] dark:text-[#9BC3C2] mb-2 text-right"
                >
                  تعداد لیوان مصرفی (۰.۵ تا ۲۰ لیوان)
                </label>

                {/* Input Container with Steppers and Unit */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="decrease-amount-btn"
                    onClick={() => handleStep(-0.5)}
                    className="w-12 h-14 rounded-2xl bg-[#E8F5F4] dark:bg-[#102E35] border border-[#C8DFDD] dark:border-[#316871] text-[#168C9B] dark:text-[#5BD0CD] flex items-center justify-center hover:bg-[#D4EFEB] active:scale-95 transition-all"
                    title="کاهش نیم لیوان"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="relative flex-1">
                    <input
                      id="custom-amount-input"
                      type="text"
                      inputMode="decimal"
                      autoFocus
                      value={value}
                      onChange={handleChange}
                      placeholder={strings.amountPlaceholder}
                      dir="ltr"
                      className="w-full h-14 pl-16 pr-4 text-center text-2xl font-black bg-[#F3FBFA] dark:bg-[#102E35] border border-[#C8DFDD] dark:border-[#316871] rounded-2xl text-[#153F4B] dark:text-[#E6F5F3] focus:outline-hidden focus:ring-2 focus:ring-[#168C9B] transition-all"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6C898C] dark:text-[#9BC3C2] pointer-events-none select-none bg-white/70 dark:bg-[#173E46]/80 px-1.5 py-0.5 rounded-md border border-[#C8DFDD]/50 dark:border-[#316871]/50">
                      {strings.glass}
                    </span>
                  </div>

                  <button
                    type="button"
                    id="increase-amount-btn"
                    onClick={() => handleStep(0.5)}
                    className="w-12 h-14 rounded-2xl bg-[#E8F5F4] dark:bg-[#102E35] border border-[#C8DFDD] dark:border-[#316871] text-[#168C9B] dark:text-[#5BD0CD] flex items-center justify-center hover:bg-[#D4EFEB] active:scale-95 transition-all"
                    title="افزایش نیم لیوان"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-[#C95353] dark:text-[#E27878] mt-1.5 text-right font-medium">
                    {error}
                  </p>
                )}
              </div>

              {/* Quick Select Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-[#6C898C] dark:text-[#9BC3C2] block text-right">
                  پیشنهادهای سریع:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_GLASSES.map((p) => (
                    <button
                      key={p}
                      id={`preset-glass-${p}`}
                      type="button"
                      onClick={() => handlePreset(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        value === p.toString()
                          ? 'bg-[#168C9B] text-white shadow-xs'
                          : 'bg-[#DDF3F1] text-[#176A73] dark:bg-[#214D54] dark:text-[#B9EFEB] hover:opacity-80'
                      }`}
                    >
                      {p === 0.5 ? 'نیم لیوان' : `${formatNumber(p)} لیوان`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  id="submit-custom-amount-btn"
                  type="submit"
                  className="flex-1 h-12 rounded-2xl bg-[#168C9B] dark:bg-[#5BD0CD] text-white dark:text-[#0D343B] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>ثبت در برنامه</span>
                </button>
                <button
                  id="cancel-custom-amount-btn"
                  type="button"
                  onClick={onClose}
                  className="px-4 h-12 rounded-2xl bg-[#DDF3F1] dark:bg-[#214D54] text-[#176A73] dark:text-[#B9EFEB] font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {strings.cancel}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
