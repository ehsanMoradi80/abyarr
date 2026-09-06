---
name: Supabase public connector security
description: The installed Supabase connector uses a public key, so server-side persistence must not depend on direct table writes.
---

Use locked-down tables with narrowly scoped SECURITY DEFINER RPCs that validate the API's signed-session hash before reading or writing user data.

**Why:** Direct PostgREST writes through the installed connector are evaluated as anon and correctly fail under RLS; opening table policies would expose private water data.

**How to apply:** Keep service-role credentials out of the mobile app, grant only the required RPC functions to anon/authenticated, and keep the HMAC session plus database session row as the API authorization boundary.