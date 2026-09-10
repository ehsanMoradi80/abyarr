import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Copy, Check, QrCode } from 'lucide-react';
import { PartnerConnection } from '../types';
import { strings } from '../constants/strings';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerConnection | null;
  onCreateInvite: () => Promise<string>;
  onConnect: (code: string) => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  partner,
  onCreateInvite,
  onConnect,
  onDisconnect,
}) => {
  const [inviteCode, setInviteCode] = useState<string | null>(partner?.inviteCode || null);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const code = await onCreateInvite();
      setInviteCode(code);
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
      await onConnect(inputCode.trim());
      onClose();
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
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#153F4B] dark:text-[#E6F5F3]">
                  {strings.partnerTitle}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6C898C] hover:bg-[#E8F3F2] dark:hover:bg-[#1B454D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-xs text-[#6C898C] dark:text-[#9BC3C2] leading-relaxed">
                {strings.partnerBody}
              </p>

              {partner && partner.status === 'active' ? (
                <div className="p-4 rounded-2xl bg-[#DDF3F1] dark:bg-[#214D54] text-center space-y-2">
                  <div className="text-sm font-bold text-[#176A73] dark:text-[#B9EFEB]">
                    متصل به: {partner.partnerName || 'همراه شما'}
                  </div>
                  <p className="text-xs text-[#6C898C] dark:text-[#9BC3C2]">
                    ارتباط برقرار است و وضعیت به اشتراک گذاشته می‌شود.
                  </p>
                  <button
                    onClick={onDisconnect}
                    className="mt-2 text-xs font-bold text-[#C95353] dark:text-[#E27878] hover:underline"
                  >
                    {strings.disconnect}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Create Invite */}
                  <div className="p-4 rounded-2xl bg-[#F3FBFA] dark:bg-[#102E35] border border-[#D7E9E7] dark:border-[#2A5C63]">
                    <span className="text-xs font-bold text-[#153F4B] dark:text-[#E6F5F3] block mb-2">
                      روش اول: کد دعوت بساز
                    </span>
                    {inviteCode ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#173E46] border border-[#C8DFDD] dark:border-[#316871]">
                          <span className="font-mono text-base font-bold tracking-widest text-[#168C9B] dark:text-[#5BD0CD]">
                            {inviteCode}
                          </span>
                          <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 text-xs font-bold text-[#168C9B] dark:text-[#5BD0CD] px-2 py-1 rounded-lg bg-[#DDF3F1] dark:bg-[#214D54]"
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'کپی شد' : 'کپی'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-[#6C898C] dark:text-[#9BC3C2]">
                          {strings.waitingForPartner}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full h-10 rounded-xl bg-[#168C9B] dark:bg-[#5BD0CD] text-white dark:text-[#0D343B] font-bold text-xs hover:opacity-90 transition-opacity"
                      >
                        {loading ? 'در حال ساخت...' : strings.createInvite}
                      </button>
                    )}
                  </div>

                  {/* Connect with existing invite */}
                  <form onSubmit={handleConnect} className="p-4 rounded-2xl bg-[#F3FBFA] dark:bg-[#102E35] border border-[#D7E9E7] dark:border-[#2A5C63] space-y-2.5">
                    <span className="text-xs font-bold text-[#153F4B] dark:text-[#E6F5F3] block">
                      روش دوم: کد همراهت را وارد کن
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        value={inputCode}
                        onChange={(e) => {
                          setInputCode(e.target.value);
                          setError('');
                        }}
                        placeholder="AB-1234"
                        className="w-full h-10 px-3 uppercase tracking-wider font-mono text-sm rounded-xl bg-white dark:bg-[#173E46] border border-[#C8DFDD] dark:border-[#316871] text-[#153F4B] dark:text-[#E6F5F3] focus:outline-hidden focus:ring-2 focus:ring-[#168C9B]"
                      />
                    </div>
                    {error && (
                      <p className="text-xs text-[#C95353] dark:text-[#E27878]">
                        {error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 rounded-xl bg-[#DDF3F1] dark:bg-[#214D54] text-[#176A73] dark:text-[#B9EFEB] font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      {loading ? 'در حال اتصال...' : strings.connectInvite}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
