# Architecture Changes Summary

## Changes Made

### 1. Removed Firebase/FCM
- Removed `@react-native-firebase/app` and `@react-native-firebase/analytics` dependencies
- Removed Firebase plugins from `app.json`
- Removed `google-services.json` and `GoogleService-Info.plist` references
- Deleted `src/services/analytics.native.ts`
- Kept Google Analytics (web) in `src/services/analytics.ts` for web tracking

### 2. Removed Studio Card
- Removed "استودیو نوش" (Noosh Studio) button from `NooshCompanionCard`
- Removed `NooshShowcaseModal` component and all references
- Removed `isNooshStudioOpen` state from `AppContext`
- Removed Studio buttons from `SettingsScreen`
- Kept the 4-state expression selector in Settings for testing notifications

### 3. Local Notifications (No FCM)
- Notifications are now fully local using `expo-notifications`
- No push notification server required
- All scheduling happens on-device
- Android notification channel configured with MAX priority

### 4. Clerk Authentication
- Replaced custom OTP authentication with Clerk
- Web app uses `@clerk/clerk-react` with `ClerkProvider`
- Expo app uses `@clerk/expo` with `ClerkProvider`
- `AuthScreen` now uses Clerk's `SignIn` component with phone OTP
- `HomeScreen` header shows `UserButton` (signed in) or `SignInButton` (signed out)
- `AppContext` syncs Clerk user with `cloudUser` state via `useUser` hook
- Removed custom OTP routes from server (`/api/auth/otp/request`, `/api/auth/otp/verify`)
- Removed Supabase Edge Functions for OTP (no longer needed)
- Removed `otp_codes` migration (no longer needed)

### 5. Supabase Realtime for Partner Watching
- Added migration `008_abyar_realtime_partner.sql` to enable Realtime on `water_logs` and `profiles` tables
- Created `partner_realtime_status` view for live partner data
- Added `src/services/supabaseClient.ts` for client-side Supabase Realtime
- Updated `AppContext` to subscribe to Realtime channel when partner is active
- Updated `HomeScreen` to display live partner data with "زنده" (Live) indicator
- Partners now see real-time updates when the other person drinks water

## Environment Variables

### Web App (`.env`)
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (for Realtime partner watching)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Expo App (`artifacts/abyar/.env.local`)
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Database Migrations

Run this migration:
1. `008_abyar_realtime_partner.sql` - Enables Realtime for partner watching

## Architecture Summary

```
┌─────────────────┐
│   Mobile App    │
│  (Expo/RN)      │
└────────┬────────┘
         │
         ├─► Clerk Authentication (@clerk/expo)
         │   - Phone OTP via Clerk
         │   - User management via Clerk Dashboard
         │
         ├─► Local Notifications (expo-notifications)
         │   - No FCM required
         │   - All scheduling on-device
         │
         └─► Supabase Realtime
             - Partner watching (live updates)
             - water_logs table subscription
             - profiles table subscription

┌─────────────────┐
│    Web App      │
│  (Vite/React)   │
└────────┬────────┘
         │
         ├─► Clerk Authentication (@clerk/clerk-react)
         │   - Phone OTP via Clerk
         │   - UserButton / SignInButton in header
         │
         └─► Supabase Realtime
             - Partner watching (live updates)
```

## Clerk Setup

1. Sign in to Clerk CLI: `clerk auth login`
2. Initialize: `clerk init --app app_3ImZ8H7uiNl0A29w8TjKGeSZPpK`
3. Environment variables are automatically written to `.env.local`
4. For web app, copy keys to `.env` with `VITE_` prefix
5. Enable phone authentication in Clerk Dashboard:
   - Go to https://dashboard.clerk.com
   - Navigate to your app → User & Authentication
   - Enable "Phone number" under sign-up and sign-in

## Next Steps

1. Run database migration `008_abyar_realtime_partner.sql`
2. Enable phone authentication in Clerk Dashboard
3. Test sign-in flow on web app
4. Test sign-in flow on Expo app
5. Test Realtime partner watching with two devices
