# Staging Environment

## Why

Production (`dearly-self.vercel.app`) serves live invitations. A bad deploy
breaks every guest link. A staging environment catches issues before they
reach real users.

## Setup steps

### 1. Create a staging Supabase project

```bash
# Create via dashboard: https://supabase.com/dashboard → New project
# Name: dearly-staging
# Region: same as production (ap-northeast-1)
```

After creation, apply all migrations:

```bash
npx supabase link --project-ref <staging-ref>
npx supabase db push --remote
```

### 2. Connect Vercel to GitHub (recommended)

```bash
vercel git connect
```

This enables **preview deployments** on every push to non-main branches.
Each PR gets its own URL (`dearly-<hash>.vercel.app`).

### 3. Set staging env vars in Vercel

In the Vercel dashboard → Settings → Environment Variables, add the
staging Supabase keys for the **Preview** environment:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<staging-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | staging anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | staging service role key |

Production env vars remain on the **Production** environment only.

### 4. Branch workflow

```
feature-branch → push → Vercel preview deploy (staging Supabase)
                       → review → merge to master
master         → push → manual `vercel deploy --prod` (production Supabase)
```

### 5. Seed staging data

```bash
npx supabase db reset --remote  # applies migrations + seed.sql
```

## Current state

- **Production**: `dearly-self.vercel.app` + `sqadwfqqzzxqqicijhgo`
- **Staging**: not yet created — follow steps above
- **Vercel Git**: not connected — deploy is manual (`vercel deploy --prod`)
