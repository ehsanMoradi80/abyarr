import React from 'react';

interface CustomBadgeVectorProps {
  badgeId: string;
  unlocked: boolean;
  tier?: 'bronze' | 'silver' | 'gold' | 'diamond';
  size?: number;
  className?: string;
}

export const CustomBadgeVector: React.FC<CustomBadgeVectorProps> = ({
  badgeId,
  unlocked,
  tier = 'bronze',
  size = 64,
  className = '',
}) => {
  const uid = `badge-${badgeId.replace(/[^a-zA-Z0-9_-]/g, '_')}-${unlocked ? 'unlocked' : 'locked'}`;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 select-none transition-transform duration-300 ${
        unlocked ? 'filter drop-shadow-md hover:scale-105' : 'opacity-85'
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Universal Locked Gradients */}
          <linearGradient id={`${uid}-lockPlate`} x1="20" y1="10" x2="80" y2="90">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id={`${uid}-lockRim`} x1="10" y1="10" x2="90" y2="90">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Tier Background Gradients */}
          <linearGradient id={`${uid}-bronzeMedal`} x1="15" y1="10" x2="85" y2="90">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="30%" stopColor="#EA580C" />
            <stop offset="70%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#7C2D12" />
          </linearGradient>

          <linearGradient id={`${uid}-silverMedal`} x1="15" y1="10" x2="85" y2="90">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="60%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id={`${uid}-goldMedal`} x1="15" y1="10" x2="85" y2="90">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="25%" stopColor="#FACC15" />
            <stop offset="65%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          <linearGradient id={`${uid}-diamondMedal`} x1="15" y1="10" x2="85" y2="90">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="30%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Water Droplet Glow */}
          <linearGradient id={`${uid}-waterAqua`} x1="30" y1="20" x2="70" y2="90">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="80%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Flame Embers */}
          <linearGradient id={`${uid}-flameFire`} x1="20" y1="15" x2="80" y2="95">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="30%" stopColor="#F97316" />
            <stop offset="75%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          {/* Gold Sun & Crown Glow */}
          <radialGradient id={`${uid}-sunGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0.8" />
          </radialGradient>

          <linearGradient id={`${uid}-pinkGrad`} x1="30" y1="20" x2="70" y2="90">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id={`${uid}-emeraldGrad`} x1="20" y1="20" x2="80" y2="80">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* 1. FIRST DROP & BRAND-GLASS (نخستین قطره / قطره آغازین) */}
        {(badgeId === 'first-drop' || badgeId === 'brand-glass' || badgeId === 'vol-5') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-bronzeMedal)`} stroke="#FED7AA" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="38" fill="#1E293B" stroke="#FDBA74" strokeWidth="1.5" strokeDasharray="3 2" />
                <ellipse cx="50" cy="74" rx="22" ry="6" fill="#0369A1" fillOpacity="0.5" />
                <ellipse cx="50" cy="74" rx="14" ry="3.5" fill="#38BDF8" fillOpacity="0.7" />
                <path
                  d="M50 20 C50 20 28 50 28 66 C28 78 38 88 50 88 C62 88 72 78 72 66 C72 50 50 20 50 20 Z"
                  fill={`url(#${uid}-waterAqua)`}
                  stroke="#E0F2FE"
                  strokeWidth="2"
                />
                <path d="M36 65 C36 54 44 38 48 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85" />
                <path d="M60 48 L62 54 L68 56 L62 58 L60 64 L58 58 L52 56 L58 54 Z" fill="white" />
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="droplet" />
            )}
          </g>
        )}

        {/* 2. STREAK-1 / STREAK-3 / BRAND-WAVES (نوشنده منظم / شعله تداوم) */}
        {(badgeId === 'streak-1' || badgeId === 'streak-3' || badgeId === 'brand-waves') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-bronzeMedal)`} stroke="#FED7AA" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#0F172A" stroke="#FB923C" strokeWidth="1.5" />
                <path
                  d="M50 16 C50 16 66 32 66 48 C66 54 62 58 60 60 C66 54 72 46 72 40 C72 40 84 56 84 72 C84 86 70 94 50 94 C30 94 16 86 16 72 C16 56 28 40 28 40 C28 46 34 54 40 60 C38 58 34 54 34 48 C34 32 50 16 50 16 Z"
                  fill={`url(#${uid}-flameFire)`}
                />
                <path
                  d="M50 48 C50 48 38 64 38 74 C38 81 43 86 50 86 C57 86 62 81 62 74 C62 64 50 48 50 48 Z"
                  fill={`url(#${uid}-waterAqua)`}
                  stroke="#E0F2FE"
                  strokeWidth="1.5"
                />
                <circle cx="50" cy="74" r="7.5" fill="#F97316" stroke="#FEF08A" strokeWidth="1.5" />
                <text x="50" y="78" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="sans-serif">
                  ۳
                </text>
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="flame" />
            )}
          </g>
        )}

        {/* 3. STREAK-7 (استرایک هفته / هفته طلایی / تداوم یک‌هفته‌ای) */}
        {(badgeId === 'streak-7' || badgeId === 'goal-5') && (
          <g>
            {unlocked ? (
              <>
                <path
                  d="M50 6 L62 18 L79 18 L82 35 L94 47 L86 62 L90 79 L73 84 L62 94 L47 88 L32 94 L23 82 L6 79 L12 62 L6 47 L18 35 L21 18 L38 18 Z"
                  fill={`url(#${uid}-silverMedal)`}
                  stroke="#F8FAFC"
                  strokeWidth="2"
                />
                <circle cx="50" cy="50" r="33" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.5" />
                {Array.from({ length: 7 }).map((_, i) => {
                  const angle = (i * (360 / 7) - 90) * (Math.PI / 180);
                  const cx = 50 + 26 * Math.cos(angle);
                  const cy = 50 + 26 * Math.sin(angle);
                  return <circle key={i} cx={cx} cy={cy} r="2.2" fill="#38BDF8" />;
                })}
                <path
                  d="M50 25 C50 25 64 38 64 54 C64 64 58 72 50 72 C42 72 36 64 36 54 C36 38 50 25 50 25 Z"
                  fill={`url(#${uid}-waterAqua)`}
                  stroke="#BAE6FD"
                  strokeWidth="1.5"
                />
                <circle cx="50" cy="56" r="8" fill="#0284C7" stroke="#E0F2FE" strokeWidth="1.5" />
                <text x="50" y="60.5" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="sans-serif">
                  ۷
                </text>
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="calendar" />
            )}
          </g>
        )}

        {/* 4. STREAK-14 / STREAK-21 (استاد عادت / تثبیت عادت) */}
        {(badgeId === 'streak-14' || badgeId === 'streak-21' || badgeId === 'goal-15') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-goldMedal)`} stroke="#FEF08A" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#1E1B4B" stroke="#C084FC" strokeWidth="1.5" />
                <path
                  d="M28 58 L34 38 L42 48 L50 32 L58 48 L66 38 L72 58 Z"
                  fill={`url(#${uid}-goldMedal)`}
                  stroke="#FEF08A"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="32" r="4.5" fill="#38BDF8" stroke="white" strokeWidth="1" />
                <rect x="33" y="62" width="34" height="14" rx="7" fill="#8B5CF6" stroke="#DDD6FE" strokeWidth="1.2" />
                <text x="50" y="73" textAnchor="middle" fill="white" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
                  {badgeId === 'streak-21' ? '۲۱ روز' : '۱۴ روز'}
                </text>
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="crown" />
            )}
          </g>
        )}

        {/* 5. STREAK-30 / STREAK-60 (قهرمان تداوم ماهانه / ماه قهرمانی) */}
        {(badgeId === 'streak-30' || badgeId === 'streak-60' || badgeId === 'goal-30') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="45" fill={`url(#${uid}-goldMedal)`} stroke="#FEF08A" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#1E1B4B" stroke="#FBBF24" strokeWidth="1.5" />
                <path
                  d="M26 62 L32 38 L42 50 L50 32 L58 50 L68 38 L74 62 Z"
                  fill={`url(#${uid}-goldMedal)`}
                  stroke="#FEF08A"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="32" cy="38" r="3.5" fill="#38BDF8" stroke="white" strokeWidth="1" />
                <circle cx="50" cy="32" r="4.5" fill="#38BDF8" stroke="white" strokeWidth="1.2" />
                <circle cx="68" cy="38" r="3.5" fill="#38BDF8" stroke="white" strokeWidth="1" />
                <rect x="32" y="64" width="36" height="13" rx="6.5" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1.2" />
                <text x="50" y="74" textAnchor="middle" fill="white" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
                  ۳۰ روز
                </text>
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="crown" />
            )}
          </g>
        )}

        {/* 6. CENTURY-100 / VOL-100 / STREAK-100 (باشگاه ۱۰۰ لیوان / افسانه صد روزه) */}
        {(badgeId === 'century-100' || badgeId === 'vol-100' || badgeId === 'streak-100') && (
          <g>
            {unlocked ? (
              <>
                <path
                  d="M50 8 L84 22 C84 56 68 78 50 92 C32 78 16 56 16 22 Z"
                  fill={`url(#${uid}-goldMedal)`}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <path
                  d="M50 15 L78 27 C78 54 64 72 50 83 C36 72 22 54 22 27 Z"
                  fill="#0F172A"
                  stroke="#FBBF24"
                  strokeWidth="1.5"
                />
                <path d="M28 62 C26 48 32 36 38 32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M72 62 C74 48 68 36 62 32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path
                  d="M38 30 L42 66 C43 70 46 72 50 72 C54 72 57 70 58 66 L62 30 Z"
                  fill={`url(#${uid}-waterAqua)`}
                  stroke="#E0F2FE"
                  strokeWidth="1.5"
                />
                <text x="50" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="sans-serif">
                  ۱۰۰
                </text>
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="award" />
            )}
          </g>
        )}

        {/* 7. WATER-MASTER-500 / VOL-250 / VOL-50 (قهرمان آب ۵۰۰ لیوان) */}
        {(badgeId === 'water-master-500' || badgeId === 'vol-250' || badgeId === 'vol-50') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-goldMedal)`} stroke="#FEF08A" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#0F172A" stroke="#FBBF24" strokeWidth="1.5" />
                <path
                  d="M32 26 H68 V46 C68 56 60 64 50 64 C40 64 32 56 32 46 Z"
                  fill={`url(#${uid}-goldMedal)`}
                  stroke="#FEF08A"
                  strokeWidth="2"
                />
                <path d="M32 30 C22 30 22 46 32 46" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M68 30 C78 30 78 46 68 46" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M44 64 H56 V74 H44 Z" fill="#EAB308" />
                <rect x="36" y="74" width="28" height="8" rx="2" fill={`url(#${uid}-goldMedal)`} stroke="#FEF08A" strokeWidth="1" />
                <ellipse cx="50" cy="26" rx="18" ry="4" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="1.5" />
                <path d="M50 14 C48 18 42 22 50 26 C58 22 52 18 50 14 Z" fill="#BAE6FD" />
                <text x="50" y="47" textAnchor="middle" fill="#1E293B" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
                  ۵۰۰
                </text>
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="trophy" />
            )}
          </g>
        )}

        {/* 8. EARLY-BIRD / BRAND-MASCOT (سحرخیز باطراوت / نشاط و انرژی) */}
        {(badgeId === 'early-bird' || badgeId === 'brand-mascot' || badgeId === 'vol-10') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-bronzeMedal)`} stroke="#FED7AA" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="50" cy="56" r="20" fill={`url(#${uid}-sunGlow)`} stroke="#FDE047" strokeWidth="1.5" />
                <path d="M50 26 V32 M30 36 L34 40 M70 36 L66 40 M24 56 H30 M70 56 H76" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M24 74 C40 60 68 62 76 74 C60 78 36 78 24 74 Z" fill="#16A34A" stroke="#86EFAC" strokeWidth="1.2" />
                <circle cx="50" cy="62" r="5" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="48" cy="60" r="1.5" fill="white" />
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="sunrise" />
            )}
          </g>
        )}

        {/* 9. NIGHT-GUARD (آرامش شبانگاهی) */}
        {badgeId === 'night-guard' && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-bronzeMedal)`} stroke="#FED7AA" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#090D16" stroke="#6366F1" strokeWidth="1.5" />
                <path
                  d="M60 22 C42 22 28 36 28 54 C28 72 42 86 60 86 C48 80 40 68 40 54 C40 40 48 28 60 22 Z"
                  fill="#FDE047"
                  stroke="#FEF08A"
                  strokeWidth="1.5"
                />
                <path
                  d="M62 46 C62 46 52 60 52 68 C52 74 57 78 62 78 C67 78 72 74 72 68 C72 60 62 46 62 46 Z"
                  fill={`url(#${uid}-waterAqua)`}
                  stroke="#BAE6FD"
                  strokeWidth="1.5"
                />
                <circle cx="68" cy="30" r="1.5" fill="white" />
                <circle cx="76" cy="42" r="1" fill="#BAE6FD" />
                <circle cx="34" cy="34" r="1.2" fill="#FEF08A" />
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="moon" />
            )}
          </g>
        )}

        {/* 10. DAILY-CHAMPION / BRAND-CLOCK / GOAL-1 (تکمیل ۱۰۰٪ هدف روزانه / نظم و تعادل) */}
        {(badgeId === 'daily-champion' || badgeId === 'brand-clock' || badgeId === 'goal-1' || badgeId === 'routine-6') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-silverMedal)`} stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="28" fill="#0369A1" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 3" />
                <circle cx="50" cy="50" r="19" fill="#0284C7" stroke="#E0F2FE" strokeWidth="2" />
                <circle cx="50" cy="50" r="10" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
                <path
                  d="M50 36 C50 36 42 46 42 52 C42 56 46 60 50 60 C54 60 58 56 58 52 C58 46 50 36 50 36 Z"
                  fill="white"
                />
                <path d="M44 74 L48 78 L58 68" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="target" />
            )}
          </g>
        )}

        {/* 11. PARTNER-SYNC / PARTNER-LINKED / WEEKEND-CARE (هم‌نوشان سلامتی / تعطیلات) */}
        {(badgeId === 'partner-sync' || badgeId === 'partner-linked' || badgeId === 'weekend-care' || badgeId === 'vol-25') && (
          <g>
            {unlocked ? (
              <>
                <circle cx="50" cy="50" r="44" fill={`url(#${uid}-silverMedal)`} stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="37" fill="#1E1B4B" stroke="#C084FC" strokeWidth="1.5" />
                <path
                  d="M40 34 C40 34 24 52 24 64 C24 74 32 82 42 82 C50 82 56 76 56 68 C56 56 40 34 40 34 Z"
                  fill={`url(#${uid}-waterAqua)`}
                  stroke="#BAE6FD"
                  strokeWidth="1.5"
                  fillOpacity="0.9"
                />
                <path
                  d="M60 34 C60 34 76 52 76 64 C76 74 68 82 58 82 C50 82 44 76 44 68 C44 56 60 34 60 34 Z"
                  fill={`url(#${uid}-pinkGrad)`}
                  stroke="#F472B6"
                  strokeWidth="1.5"
                  fillOpacity="0.9"
                />
                <path
                  d="M50 56 C48 52 44 52 43 55 C41 58 50 66 50 66 C50 66 59 58 57 55 C56 52 52 52 50 56 Z"
                  fill="#F43F5E"
                />
              </>
            ) : (
              <LockedMedalPlaceholder uid={uid} iconType="users" />
            )}
          </g>
        )}

        {/* 12. DIAMOND-LEGEND (الماس آبی اقیانوس & Generic fallback) */}
        {badgeId !== 'first-drop' &&
          badgeId !== 'brand-glass' &&
          badgeId !== 'vol-5' &&
          badgeId !== 'streak-1' &&
          badgeId !== 'streak-3' &&
          badgeId !== 'brand-waves' &&
          badgeId !== 'streak-7' &&
          badgeId !== 'goal-5' &&
          badgeId !== 'streak-14' &&
          badgeId !== 'streak-21' &&
          badgeId !== 'goal-15' &&
          badgeId !== 'streak-30' &&
          badgeId !== 'streak-60' &&
          badgeId !== 'goal-30' &&
          badgeId !== 'century-100' &&
          badgeId !== 'vol-100' &&
          badgeId !== 'streak-100' &&
          badgeId !== 'water-master-500' &&
          badgeId !== 'vol-250' &&
          badgeId !== 'vol-50' &&
          badgeId !== 'early-bird' &&
          badgeId !== 'brand-mascot' &&
          badgeId !== 'vol-10' &&
          badgeId !== 'night-guard' &&
          badgeId !== 'daily-champion' &&
          badgeId !== 'brand-clock' &&
          badgeId !== 'goal-1' &&
          badgeId !== 'routine-6' &&
          badgeId !== 'partner-sync' &&
          badgeId !== 'partner-linked' &&
          badgeId !== 'weekend-care' &&
          badgeId !== 'vol-25' && (
            <g>
              {unlocked ? (
                <>
                  <polygon
                    points="50,4 88,24 96,66 66,96 34,96 4,66 12,24"
                    fill={`url(#${uid}-diamondMedal)`}
                    stroke="#E0F2FE"
                    strokeWidth="3"
                  />
                  <circle cx="50" cy="50" r="32" fill="#082F49" stroke="#7DD3FC" strokeWidth="1.5" />
                  <polygon points="50,22 74,38 66,68 34,68 26,38" fill="#38BDF8" stroke="white" strokeWidth="1.8" />
                  <polygon points="50,22 50,68 66,68 74,38" fill="#0284C7" fillOpacity="0.7" />
                  <polygon points="50,22 26,38 34,68" fill="#7DD3FC" fillOpacity="0.8" />
                  <polygon points="34,68 50,82 66,68" fill="#0369A1" stroke="white" strokeWidth="1.5" />
                  <polygon points="34,68 50,82 50,68" fill="#0EA5E9" />
                  <path d="M50 14 L52 20 L58 22 L52 24 L50 30 L48 24 L42 22 L48 20 Z" fill="white" />
                  <circle cx="70" cy="34" r="1.5" fill="white" />
                  <circle cx="30" cy="62" r="1.5" fill="white" />
                </>
              ) : (
                <LockedMedalPlaceholder uid={uid} iconType="gem" />
              )}
            </g>
          )}
      </svg>
    </div>
  );
};

// Subcomponent: Matte Graphite/Slate Locked Medal with Embossed Outline & Padlock
interface LockedMedalPlaceholderProps {
  uid: string;
  iconType: string;
}

const LockedMedalPlaceholder: React.FC<LockedMedalPlaceholderProps> = ({ uid, iconType }) => {
  return (
    <>
      {/* Outer Slate/Iron Rim */}
      <circle cx="50" cy="50" r="44" fill={`url(#${uid}-lockPlate)`} stroke={`url(#${uid}-lockRim)`} strokeWidth="3" />
      <circle cx="50" cy="50" r="36" fill="#0F172A" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Dim Metallic Icon Silhouette */}
      <g opacity="0.35" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {iconType === 'droplet' && <path d="M50 28 C50 28 34 46 34 58 C34 67 41 74 50 74 C59 74 66 67 66 58 C66 46 50 28 50 28 Z" />}
        {iconType === 'flame' && <path d="M50 24 C50 24 38 42 38 56 C38 66 44 72 50 72 C56 72 62 66 62 56 C62 42 50 24 50 24 Z" />}
        {iconType === 'calendar' && <rect x="32" y="32" width="36" height="34" rx="4" />}
        {iconType === 'crown' && <path d="M30 60 L36 40 L44 50 L50 36 L56 50 L64 40 L70 60 Z" />}
        {iconType === 'award' && <circle cx="50" cy="46" r="14" />}
        {iconType === 'trophy' && <path d="M34 32 H66 V48 C66 56 60 62 50 62 C40 62 34 56 34 48 Z" />}
        {iconType === 'sunrise' && <circle cx="50" cy="56" r="16" />}
        {iconType === 'moon' && <path d="M58 30 C44 30 34 42 34 56 C34 70 44 78 58 78 C50 72 44 64 44 54 C44 44 50 36 58 30 Z" />}
        {iconType === 'target' && <circle cx="50" cy="50" r="18" />}
        {iconType === 'users' && <circle cx="44" cy="46" r="8" />}
        {iconType === 'gem' && <polygon points="50,26 68,40 60,66 40,66 32,40" />}
      </g>

      {/* Prominent High-Contrast Brass/Steel Padlock */}
      <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.6))">
        {/* Shackle */}
        <path
          d="M42 46 V38 C42 33.6 45.6 30 50 30 C54.4 30 58 33.6 58 38 V46"
          stroke="#CBD5E1"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Lock Body */}
        <rect x="36" y="44" width="28" height="22" rx="4" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Keyhole */}
        <circle cx="50" cy="53" r="2.5" fill="#0F172A" />
        <path d="M49 54 L48 60 H52 L51 54 Z" fill="#0F172A" />
      </g>
    </>
  );
};
