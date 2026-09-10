import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Mail, Lock, User, Cloud, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { useSignIn, useSignUp, isClerkConfigured } from '../lib/clerk';
import { useApp } from '../context/AppContext';

type AuthMode = 'signin' | 'signup';
type Step = 'main' | 'verify-email';

export const AuthScreen: React.FC = () => {
  const { setCurrentScreen, showToast } = useApp();
  const { signIn, setActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [step, setStep] = useState<Step>('main');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBack = () => {
    if (step === 'verify-email') {
      setStep('main');
      setCode('');
    } else {
      setCurrentScreen('main');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      if (isClerkConfigured) {
        window.location.href = `/.clerk/sign-in?strategy=oauth_google&redirect_url=${encodeURIComponent(window.location.origin)}`;
      } else {
        if (!signInLoaded || !signIn) return;
        setLoading(true);
        const result = await signIn.create({
          identifier: 'user@google.com',
          password: 'demo-google-login',
        });
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          showToast('ورود با حساب گوگل با موفقیت انجام شد');
          setCurrentScreen('main');
        }
      }
    } catch (err: any) {
      setError('خطا در اتصال به گوگل');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInLoaded || !signIn) return;
    if (!password) {
      setError('رمز عبور را وارد کنید');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim() || username.trim(),
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        showToast('ورود با موفقیت انجام شد');
        setCurrentScreen('main');
      } else if (result.status === 'needs_first_factor') {
        const factors = result.supportedFirstFactors;
        const emailCodeFactor = factors?.find((f: any) => f.strategy === 'email_code');
        if (emailCodeFactor && 'emailAddressId' in emailCodeFactor) {
          await signIn.prepareFirstFactor({ 
            strategy: 'email_code',
            emailAddressId: (emailCodeFactor as any).emailAddressId 
          });
          setStep('verify-email');
        } else {
          setError('روش تأیید پشتیبانی نمی‌شود');
        }
      }
    } catch (err: any) {
      const code = err.errors?.[0]?.code;
      if (code === 'form_identifier_not_found') {
        setError('حسابی با این مشخصات یافت نشد');
      } else if (code === 'form_password_incorrect') {
        setError('رمز عبور اشتباه است');
      } else {
        setError(err.errors?.[0]?.message || 'خطا در ورود');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded || !signUp) return;
    if (!email.trim() && !username.trim()) {
      setError('ایمیل یا نام کاربری را وارد کنید');
      return;
    }
    if (!password || password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const pending = await signUp.create({
        emailAddress: email.trim() || undefined,
        username: username.trim() || undefined,
        password,
        firstName: firstName.trim() || undefined,
      });

      if (pending.status === 'complete') {
        await setActiveSignUp({ session: pending.createdSessionId });
        showToast('ثبت نام با موفقیت انجام شد');
        setCurrentScreen('main');
      } else if (pending.status === 'missing_requirements') {
        const verifiable = pending.verifications?.emailAddress?.status;
        if (verifiable === 'unverified') {
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setStep('verify-email');
        }
      }
    } catch (err: any) {
      const code = err.errors?.[0]?.code;
      if (code === 'form_identifier_exists') {
        setError('این ایمیل یا نام کاربری قبلاً ثبت شده');
      } else {
        setError(err.errors?.[0]?.message || 'خطا در ثبت نام');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!signUp) return;
        const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });
        if (result.status === 'complete') {
          await setActiveSignUp({ session: result.createdSessionId });
          showToast('ثبت نام با موفقیت انجام شد');
          setCurrentScreen('main');
        }
      } else {
        if (!signIn) return;
        const result = await signIn.attemptFirstFactor({ strategy: 'email_code', code: code.trim() });
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          showToast('ورود با موفقیت انجام شد');
          setCurrentScreen('main');
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'کد تأیید اشتباه است');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (step === 'verify-email') return 'تأیید ایمیل';
    return mode === 'signin' ? 'ورود به حساب' : 'ثبت نام';
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F6FA] dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-md mx-auto pt-2 mb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            aria-label="بازگشت"
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] shadow-2xs hover:border-[#2D9CFF] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">{getTitle()}</h1>
          <div className="w-10 h-10" />
        </div>
      </div>

      <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center py-4">
        <motion.div
          key={step + mode}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-5"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] mx-auto flex items-center justify-center shadow-2xs">
              <Cloud className="w-6 h-6" />
            </div>
            <h2 className="text-base font-black text-[#1E293B] dark:text-[#F8FAFC]">همگام‌سازی ابری</h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">با ورود به حساب، سوابق مصرف شما امن ذخیره می‌شود.</p>
            {!isClerkConfigured && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>حالت حساب کاربری محلی (فعال)</span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {step === 'main' && (
            <>
              {/* Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-12 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#0B192C] text-[#1E293B] dark:text-[#F8FAFC] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>ورود با گوگل</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#334155]" />
                <span className="text-[11px] text-[#94A3B8]">یا</span>
                <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#334155]" />
              </div>

              {mode === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#2D9CFF]" />
                      <span>ایمیل یا نام کاربری</span>
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="email@example.com"
                      value={email || username}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.includes('@')) { setEmail(v); setUsername(''); }
                        else { setUsername(v); setEmail(''); }
                      }}
                      className="w-full h-12 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:border-[#2D9CFF]"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#2D9CFF]" />
                      <span>رمز عبور</span>
                    </label>
                    <input
                      type="password"
                      dir="ltr"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:border-[#2D9CFF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF] text-white font-bold text-xs shadow-md shadow-[#2D9CFF]/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'در حال ورود...' : 'ورود'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#2D9CFF]" />
                      <span>نام (اختیاری)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="نام شما"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:border-[#2D9CFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#2D9CFF]" />
                      <span>ایمیل یا نام کاربری</span>
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="email@example.com"
                      value={email || username}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v.includes('@')) { setEmail(v); setUsername(''); }
                        else { setUsername(v); setEmail(''); }
                      }}
                      className="w-full h-12 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:border-[#2D9CFF]"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#2D9CFF]" />
                      <span>رمز عبور</span>
                    </label>
                    <input
                      type="password"
                      dir="ltr"
                      placeholder="حداقل ۸ کاراکتر"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:border-[#2D9CFF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF] text-white font-bold text-xs shadow-md shadow-[#2D9CFF]/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
                  </button>
                </form>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                  className="text-xs font-bold text-[#2D9CFF] hover:underline cursor-pointer"
                >
                  {mode === 'signin' ? 'حساب ندارید؟ ثبت نام کنید' : 'حساب دارید؟ وارد شوید'}
                </button>
              </div>
            </>
          )}

          {step === 'verify-email' && (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] text-center">
                کد ۶ رقمی ارسال‌شده به ایمیل را وارد کنید
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2D9CFF]" />
                  <span>کد تأیید</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B192C] border border-[#CBD5E1] dark:border-[#475569] text-center text-lg font-black tracking-widest text-[#1E293B] dark:text-[#F8FAFC] focus:outline-hidden focus:border-[#2D9CFF]"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2D9CFF] to-[#56B7FF] text-white font-bold text-xs shadow-md shadow-[#2D9CFF]/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'در حال بررسی...' : 'تأیید'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('main'); setCode(''); }}
                className="w-full py-2 text-xs font-bold text-[#64748B] hover:text-[#2D9CFF] text-center cursor-pointer"
              >
                بازگشت
              </button>
            </form>
          )}

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>حریم خصوصی و داده‌های شما محفوظ است</span>
          </div>
        </motion.div>
      </div>

      <div className="w-full max-w-md mx-auto h-4" />
    </div>
  );
};
