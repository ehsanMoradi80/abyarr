import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ClerkProvider as RealClerkProvider,
  SignedIn as RealSignedIn,
  SignedOut as RealSignedOut,
  UserButton as RealUserButton,
  useUser as useRealUser,
  useSignIn as useRealSignIn,
  useSignUp as useRealSignUp,
} from '@clerk/clerk-react';
import { LogOut, User as UserIcon } from 'lucide-react';

const envKey = (
  import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY ||
  (typeof process !== 'undefined' && (process.env?.VITE_CLERK_PUBLISHABLE_KEY || process.env?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY))
) as string | undefined;

// Clerk is configured only if a real publishable key is provided (not empty, not placeholder)
export const isClerkConfigured = Boolean(
  envKey &&
  envKey.startsWith('pk_') &&
  envKey !== 'pk_test_...' &&
  !envKey.includes('...') &&
  !envKey.includes('YOUR_') &&
  envKey.length > 25,
);

export interface FallbackUser {
  id: string;
  fullName: string | null;
  firstName: string | null;
  primaryPhoneNumber?: { phoneNumber: string };
  primaryEmailAddress?: { emailAddress: string };
  imageUrl?: string;
}

interface FallbackAuthContextType {
  user: FallbackUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signInUser: (identifier: string, name?: string) => Promise<{ createdSessionId: string }>;
  signUpUser: (identifier: string, name?: string) => Promise<{ createdSessionId: string }>;
  signOut: () => Promise<void>;
  setActiveSession: (sessionId: string) => Promise<void>;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'abyar_fallback_auth_user',
  ALL_USERS: 'abyar_fallback_users_list',
};

const FallbackAuthContext = createContext<FallbackAuthContextType>({
  user: null,
  isLoaded: true,
  isSignedIn: false,
  signInUser: async () => ({ createdSessionId: '' }),
  signUpUser: async () => ({ createdSessionId: '' }),
  signOut: async () => {},
  setActiveSession: async () => {},
});

export const FallbackAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FallbackUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoaded, setIsLoaded] = useState(true);

  const signInUser = async (identifier: string, name?: string) => {
    const isEmail = identifier.includes('@');
    const displayName = name || identifier.split('@')[0];
    const newUser: FallbackUser = {
      id: 'usr_' + Math.abs(identifier.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)),
      fullName: displayName,
      firstName: displayName,
      primaryEmailAddress: isEmail ? { emailAddress: identifier } : undefined,
      primaryPhoneNumber: !isEmail ? { phoneNumber: identifier } : undefined,
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    setUser(newUser);
    return { createdSessionId: 'sess_' + newUser.id };
  };

  const signUpUser = async (identifier: string, name?: string) => {
    return signInUser(identifier, name);
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  };

  const setActiveSession = async (_sessionId: string) => {
    // Session state already updated in signIn/signUp
  };

  return (
    <FallbackAuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn: Boolean(user),
        signInUser,
        signUpUser,
        signOut,
        setActiveSession,
      }}
    >
      {children}
    </FallbackAuthContext.Provider>
  );
};

export const ClerkProvider: React.FC<{
  publishableKey?: string;
  children: React.ReactNode;
}> = ({ publishableKey, children }) => {
  if (isClerkConfigured && publishableKey) {
    return <RealClerkProvider publishableKey={publishableKey}>{children}</RealClerkProvider>;
  }

  throw new Error(
    'Clerk authentication is not configured. Set VITE_CLERK_PUBLISHABLE_KEY or EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY with a real Clerk publishable key (starting with pk_). Fake local fallback is disabled in production.'
  );
};

export const SignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isClerkConfigured) {
    return <RealSignedIn>{children}</RealSignedIn>;
  }

  const { user } = useContext(FallbackAuthContext);
  return user ? <>{children}</> : null;
};

export const SignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isClerkConfigured) {
    return <RealSignedOut>{children}</RealSignedOut>;
  }

  const { user } = useContext(FallbackAuthContext);
  return !user ? <>{children}</> : null;
};

export const FallbackUserButton: React.FC<{ appearance?: any }> = () => {
  const { user, signOut } = useContext(FallbackAuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  if (!user) return null;

  const displayName = user.fullName || user.firstName || 'کاربر آب‌یار';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="پروفایل کاربر"
        className="w-9 h-9 rounded-2xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center font-bold text-xs shadow-2xs border border-[#2D9CFF]/30 hover:border-[#2D9CFF] transition-all cursor-pointer"
      >
        <span>{initial}</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#E2E8F0] dark:border-[#334155]">
            <div className="w-8 h-8 rounded-xl bg-[#E6F4FF] dark:bg-[#1E3A5F] text-[#0066CC] dark:text-[#8ED3FF] flex items-center justify-center font-bold text-xs">
              {initial}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1E293B] dark:text-[#F8FAFC] truncate">{displayName}</p>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate">
                {user.primaryEmailAddress?.emailAddress || user.primaryPhoneNumber?.phoneNumber || 'حالت محلی'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="w-full mt-2 py-2 px-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const UserButton: React.FC<{ appearance?: any }> = ({ appearance }) => {
  if (isClerkConfigured) {
    return <RealUserButton appearance={appearance} />;
  }
  return <FallbackUserButton appearance={appearance} />;
};

export function useUser() {
  if (isClerkConfigured) {
    return useRealUser();
  }

  const { user, isLoaded, isSignedIn } = useContext(FallbackAuthContext);
  return {
    user,
    isLoaded,
    isSignedIn,
  };
}

export function useSignIn() {
  if (isClerkConfigured) {
    return useRealSignIn();
  }

  const { signInUser, setActiveSession, isLoaded } = useContext(FallbackAuthContext);

  const signIn = {
    create: async ({ identifier, password }: { identifier: string; password?: string }) => {
      if (!identifier.trim()) {
        const err: any = new Error('شناسه کاربری را وارد کنید');
        err.errors = [{ code: 'form_identifier_not_found', message: 'حسابی با این مشخصات یافت نشد' }];
        throw err;
      }
      const res = await signInUser(identifier.trim());
      return {
        status: 'complete',
        createdSessionId: res.createdSessionId,
        supportedFirstFactors: [] as any[],
      } as any;
    },
    supportedFirstFactors: [] as any[],
    prepareFirstFactor: async (_params: any) => {},
    attemptFirstFactor: async (_params: any) => {
      return {
        status: 'complete',
        createdSessionId: 'sess_verified',
      } as any;
    },
  };

  const setActive = async ({ session }: { session: string | null }) => {
    if (session) {
      await setActiveSession(session);
    }
  };

  return {
    signIn,
    setActive,
    isLoaded,
  };
}

export function useSignUp() {
  if (isClerkConfigured) {
    return useRealSignUp();
  }

  const { signUpUser, setActiveSession, isLoaded } = useContext(FallbackAuthContext);

  const signUp = {
    create: async ({
      emailAddress,
      username,
      password,
      firstName,
    }: {
      emailAddress?: string;
      username?: string;
      password?: string;
      firstName?: string;
    }) => {
      const identifier = emailAddress || username || firstName || 'کاربر آب‌یار';
      const res = await signUpUser(identifier, firstName || username);
      return {
        status: 'complete',
        createdSessionId: res.createdSessionId,
        verifications: {
          emailAddress: { status: 'verified' },
        },
      } as any;
    },
    prepareEmailAddressVerification: async (_params: any) => {},
    attemptEmailAddressVerification: async (_params: any) => {
      return {
        status: 'complete',
        createdSessionId: 'sess_verified',
      } as any;
    },
  };

  const setActive = async ({ session }: { session: string | null }) => {
    if (session) {
      await setActiveSession(session);
    }
  };

  return {
    signUp,
    setActive,
    isLoaded,
  };
}
