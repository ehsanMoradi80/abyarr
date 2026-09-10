import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, KeyRound, Cloud } from 'lucide-react';
import { strings } from '../constants/strings';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestOtp: (phone: string) => Promise<boolean>;
  onSignIn: (phone: string, code: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onRequestOtp,
  onSignIn,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devModeHint, setDevModeHint] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError(strings.phoneError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const isDev = await onRequestOtp(phone.trim());
      setDevModeHint(isDev);
      setStep('otp');
    } catch {
      setError(strings.authUnavailable);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length < 4) {
      setError(strings.invalidOtp);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSignIn(phone.trim(), code.trim());
      onClose();
    } catch {
      setError(strings.invalidOtp);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#153F4B]/40 dark:bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#173E46] p-6 shadow-xl border border-[#D7E9E7] dark:border-[#2A5C63]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#D7E9E7] dark:border-[#2A5C63]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#DDF3F1] dark:bg-[#214D54] flex items-center justify-center text-[#168C9B] dark:text-[#5BD0CD]">
                  <Cloud className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#153F4B] dark:text-[#E6F5F3]">
                  {strings.login}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6C898C] hover:bg-[#E8F3F2] dark:hover:bg-[#1B454D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="mt-5 space-y-4">
                <p className="text-xs text-[#6C898C] dark:text-[#9BC3C2] leading-relaxed">
                  {strings.loginBody}
                </p>

                <div>
                  <label className="block text-xs font-semibold text-[#6C898C] dark:text-[#9BC3C2] mb-1.5 text-right">
                    {strings.mobile}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      autoFocus
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError('');
                      }}
                      placeholder="09123456789"
                      className="w-full h-12 pl-10 pr-4 rounded-2xl bg-[#F3FBFA] dark:bg-[#102E35] border border-[#C8DFDD] dark:border-[#316871] text-sm text-[#153F4B] dark:text-[#E6F5F3] focus:outline-hidden focus:ring-2 focus:ring-[#168C9B]"
                    />
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C898C]" />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-[#C95353] dark:text-[#E27878] text-right">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-[#168C9B] dark:bg-[#5BD0CD] text-white dark:text-[#0D343B] font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'در حال ارسال...' : strings.continue}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="mt-5 space-y-4">
                <p className="text-xs text-[#6C898C] dark:text-[#9BC3C2] leading-relaxed">
                  {strings.otpBody}
                </p>

                {devModeHint && (
                  <div className="p-2.5 rounded-xl bg-[#DDF3F1] dark:bg-[#214D54] text-[11px] text-[#176A73] dark:text-[#B9EFEB]">
                    {strings.devOnly} (کد تستی: 11111)
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#6C898C] dark:text-[#9BC3C2] mb-1.5 text-right">
                    کد تأیید
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      dir="ltr"
                      autoFocus
                      maxLength={6}
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setError('');
                      }}
                      placeholder="11111"
                      className="w-full h-12 pl-10 pr-4 text-center tracking-widest text-lg font-bold rounded-2xl bg-[#F3FBFA] dark:bg-[#102E35] border border-[#C8DFDD] dark:border-[#316871] text-[#153F4B] dark:text-[#E6F5F3] focus:outline-hidden focus:ring-2 focus:ring-[#168C9B]"
                    />
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C898C]" />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-[#C95353] dark:text-[#E27878] text-right">
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 rounded-2xl bg-[#168C9B] dark:bg-[#5BD0CD] text-white dark:text-[#0D343B] font-bold text-sm hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'در حال بررسی...' : strings.verify}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="px-4 h-12 rounded-2xl bg-[#DDF3F1] dark:bg-[#214D54] text-[#176A73] dark:text-[#B9EFEB] font-semibold text-sm"
                  >
                    بازگشت
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
