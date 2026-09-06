import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Users, Copy, Check, Heart, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { strings } from '../constants/strings';

export const PartnerScreen: React.FC = () => {
  const {
    partner,
    createPartnerInvite,
    connectPartner,
    disconnectPartner,
    setCurrentScreen,
    showToast,
  } = useApp();

  const [inviteCode, setInviteCode] = useState<string | null>(partner?.inviteCode || null);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const code = await createPartnerInvite();
      setInviteCode(code);
      showToast('کد دعوت با موفقیت ساخته شد');
    } catch {
      setError('ساخت کد دعوت با خطا مواجه شد.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode || inputCode.trim().length < 4) {
      setError(strings.codeError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await connectPartner(inputCode.trim());
      showToast(strings.connectSuccess);
      setCurrentScreen('main');
    } catch {
      setError('کد دعوت نامعتبر است یا منقضی شده است.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('کد با موفقیت کپی شد');
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('آیا از قطع اتصال همراه اطمینان دارید؟')) {
      await disconnectPartner();
      showToast('ارتباط با همراه قطع شد');
      setCurrentScreen('main');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300">
      {/* Top Header - Icon Only Back Button */}
      <div className="w-full max-w-md mx-auto pt-2 mb-2">
        <div className="flex items-center justify-between">
          <button
            id="partner-back-btn"
            onClick={() => setCurrentScreen('main')}
            aria-label="بازگشت"
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] shadow-2xs hover:border-[#2D9CFF] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <h1 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">
            همراه سلامت
          </h1>

          <div className="w-10 h-10" />
        </div>
      </div>

      {/* Center Container */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center py-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-5"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] mx-auto flex items-center justify-center shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">
              انگیزه دوچندان با همراه
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              پیشرفت مصرف آب یکدیگر را به صورت زنده دنبال کنید.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {partner && partner.status === 'active' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] border border-[#2D9CFF]/30 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#2D9CFF] text-white mx-auto flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-current" />
                </div>
                <h4 className="text-sm font-black text-[#0066CC] dark:text-[#8ED3FF]">
                  متصل به: {partner.partnerName || 'همراه سلامت'}
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  وضعیت اشتراک‌گذاری فعال است.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDisconnect}
                className="w-full h-11 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-100 transition-colors cursor-pointer"
              >
                قطع اتصال همراه
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Option 1: Invite Code Generation */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#334155]">
                <h4 className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                  ۱. ارسال کد دعوت به همراه
                </h4>

                {inviteCode ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-11 px-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#475569] flex items-center justify-center font-mono font-black text-sm text-[#0066CC] dark:text-[#8ED3FF] tracking-wider">
                      {inviteCode}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="h-11 px-4 rounded-xl bg-[#2D9CFF] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#1E70E8]"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'کپی شد' : 'کپی'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#475569] text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] hover:border-[#2D9CFF] cursor-pointer"
                  >
                    ساخت کد دعوت جدید
                  </button>
                )}
              </div>

              {/* Option 2: Connect via Received Code */}
              <form onSubmit={handleConnect} className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#334155]">
                <h4 className="text-xs font-black text-[#1E293B] dark:text-[#F8FAFC]">
                  ۲. وارد کردن کد دعوت
                </h4>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="کد ۶ رقمی..."
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    className="flex-1 h-11 px-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#475569] text-center font-mono font-bold text-sm tracking-wider focus:outline-hidden focus:border-[#2D9CFF]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 px-4 rounded-xl bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    اتصال
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
            <Shield className="w-3.5 h-3.5" />
            <span>تنها درصد پیشرفت و زمان مصرف به اشتراک گذاشته می‌شود</span>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-md mx-auto h-4" />
    </div>
  );
};
