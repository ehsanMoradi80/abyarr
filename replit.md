# آب‌یار

آب‌یار یک اپ موبایل فارسی و RTL برای ثبت سریع مصرف آب، یادآوری محلی و مشاهدهٔ پیشرفت روزانه است.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Where things live

- `artifacts/abyar` — اپ Expo و مسیرهای خانه، تاریخچه، آمار، تنظیمات، ورود و همراه
- `artifacts/abyar/context/AppProvider.tsx` — وضعیت local-first، AsyncStorage، یادآور محلی و تنظیمات
- `artifacts/abyar/constants/strings.ts` — متن‌های فارسی و قالب‌بندی عدد/تاریخ
- `supabase/migrations/001_abyar.sql` — اسکیمای ابری و سیاست‌های RLS

## Architecture decisions

- ثبت روزانه ابتدا محلی انجام می‌شود و شبکه منبع UI نیست.
- داده‌های ابری اختیاری هستند؛ RLS باید مالکیت را با `auth.uid()` enforce کند.
- یادآورها روی دستگاه برنامه‌ریزی می‌شوند تا برای هر کاربر job سمت سرور ساخته نشود.
- کد OTP ثابت فقط برای توسعه است و قبل از انتشار باید با SMS واقعی سمت سرور جایگزین شود.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live


## Architecture decisions


## Product

ثبت سریع آب، تاریخچهٔ ۷/۳۰ روزه، آمار هفتگی، یادآورهای محلی، حالت مهمان، حالت تاریک و اتصال اختیاری همراه.

## User preferences


## Gotchas


- `expo-notifications` فقط روی دستگاه زمان‌بندی می‌کند؛ پیش‌نمایش وب نوتیفیکیشن بومی ندارد.
- مقدار داخلی آب همیشه میلی‌لیتر است.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
