# Supabase Setup Guide for DS-160 Helper

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name**: ds160-helper
   - **Database Password**: (Choose a strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for project to be created (~2 minutes)

## Step 2: Run Database Migration

1. Go to your project's SQL Editor: 
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

2. Copy and paste the entire contents of `supabase/schema.sql`

3. Click "Run" to execute the migration

4. You should see success messages for:
   - Tables created (profiles, ds160_drafts, sync_history)
   - Indexes created
   - RLS policies enabled
   - Functions created

## Step 3: Get API Credentials

1. Go to "Settings" > "API" in your Supabase project

2. Copy the following values:

   **Project URL**:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **API Key (anon, public)**:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **Service Role Key** (Optional, for admin operations):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 4: Configure Environment Variables

1. Create `.env` file in project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-public-key-here
   SUPABASE_SERVICE_KEY=your-service-role-key-here
   ```

## Step 5: Configure Authentication

### Enable Email Authentication

1. Go to "Authentication" > "Providers" in Supabase dashboard
2. Ensure "Email" is enabled
3. Configure email templates (optional):
   - Go to "Authentication" > "Email Templates"
   - Customize confirmation and password reset emails

### Email Confirmation Settings

**Option 1: Disable email confirmation (for testing)**
1. Go to "Authentication" > "Settings"
2. Uncheck "Enable email confirmations"

**Option 2: Use real email (for production)**
1. Configure SMTP settings in "Authentication" > "Settings"
2. Or use Supabase's built-in email service

### Optional: Enable OAuth Providers

**Google OAuth**:
1. Go to "Authentication" > "Providers"
2. Enable "Google"
3. Add your Google OAuth Client ID and Secret

**GitHub OAuth**:
1. Go to "Authentication" > "Providers"
2. Enable "GitHub"
3. Add your GitHub OAuth App credentials

## Step 6: Test Database Connection

Run this query in SQL Editor to verify setup:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Test functions
SELECT public.check_sync_quota('00000000-0000-0000-0000-000000000000');
```

## Step 7: Verify Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Visit `/auth/signup`
   - Create a test account
   - Verify you're redirected to dashboard

3. Test database operations:
   - Fill in form data
   - Click "Sync to Cloud"
   - Check Supabase dashboard > "Table Editor" > "ds160_drafts"
   - Verify your data is saved

## Troubleshooting

### "Supabase credentials not configured"
- Check `.env` file exists and has correct values
- Restart dev server after adding environment variables

### "Row Level Security" errors
- Verify RLS policies were created correctly
- Check user is authenticated (JWT token present)
- Use SQL Editor to debug:
  ```sql
  SELECT auth.uid(); -- Should return current user ID
  ```

### Email not sending
- Check "Authentication" > "Settings" > Email settings
- For testing, disable email confirmation
- Check spam folder

### Sync quota not resetting
- Verify `check_sync_quota` function is working
- Check `sync_reset_at` column in profiles table
- Manually reset for testing:
  ```sql
  UPDATE profiles 
  SET sync_count = 0, 
      sync_reset_at = NOW() + INTERVAL '1 month'
  WHERE id = auth.uid();
  ```

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Service role key kept secret (never commit to git)
- ✅ Anon key is public-safe
- ✅ Auth policies restrict data to user's own records
- ✅ Functions use SECURITY DEFINER appropriately
- ✅ `.env` file is in `.gitignore`

## Production Deployment

### Vercel

1. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY`

2. Deploy:
   ```bash
   npm run build
   ```

### Database Backups

1. Enable automated backups:
   - Go to "Settings" > "Database"
   - Enable "Point in Time Recovery" (Pro plan)

2. Manual backup:
   - Go to "Settings" > "Database"
   - Click "Backup now"

## Monitoring

### Check Database Usage
- Dashboard > "Settings" > "Usage"
- Monitor:
  - Database size
  - Auth users count
  - API requests
  - Bandwidth

### Query Performance
- Dashboard > "Database" > "Query Performance"
- Add indexes for slow queries

### Realtime Subscriptions (Optional)
If implementing real-time features:
```typescript
const subscription = supabase
  .channel('ds160_drafts')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'ds160_drafts',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## Support

- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database migration
3. ✅ Configure environment variables
4. ✅ Test authentication
5. ⬜ (Optional) Enable OAuth providers
6. ⬜ (Optional) Customize email templates
7. ⬜ Deploy to production
8. ⬜ Set up monitoring and alerts
