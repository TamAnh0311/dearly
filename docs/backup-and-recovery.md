# Backup & Recovery

## Current setup

- **Supabase project**: `dearly` (`sqadwfqqzzxqqicijhgo`)
- **Region**: `ap-northeast-1` (Tokyo)
- **Postgres version**: 17.11
- **Plan**: Free tier

## Backup schedule

Supabase Free tier provides **daily automatic backups** retained for 7 days.
PITR (point-in-time recovery) is available on the Pro plan.

## Restore process

1. Go to **Supabase Dashboard → Settings → Database → Backups**.
2. Select the backup to restore from.
3. Click **Restore** — this replaces the entire database.

**Warning**: Restoring overwrites all current data. If you only need to
recover specific rows, export the backup first and cherry-pick.

## Recommendations

- **Upgrade to Pro** when revenue justifies it — enables PITR (restore to
  any second in the last 7 days) instead of daily snapshots.
- **Weekly manual export**: run `pg_dump` via `supabase db dump --remote`
  and store the SQL file in a secure location (e.g. encrypted S3 bucket).
- **Test a restore annually** on a throwaway Supabase project to verify
  the backup is usable.

## Manual backup command

```bash
npx supabase db dump --remote -f backup-$(date +%Y-%m-%d).sql
```

## Storage backups

Supabase Storage (photos) is **not included** in database backups.
Consider enabling Supabase Storage replication or periodically syncing
the `wedding-photos` bucket to an external store.
