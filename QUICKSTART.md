# DS-160 Helper - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase

#### Option A: Use Existing Supabase Project
If you already have a Supabase project:

1. Get your credentials from https://supabase.com/dashboard
   - Go to Settings > API
   - Copy "Project URL" and "anon public" key

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Edit `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
```

4. Run database migration:
   - Open SQL Editor in Supabase dashboard
   - Copy contents of `supabase/schema.sql`
   - Paste and run

#### Option B: Create New Supabase Project
Follow detailed instructions in `supabase/SETUP.md`

### 3. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

### 4. Test Authentication
1. Go to http://localhost:3000/auth/signup
2. Create an account with any email (use fake email for testing)
3. You'll be redirected to dashboard
4. Start filling the form!

---

## ✨ Key Features to Try

### 1. Create Account & Login
- `/auth/signup` - Register new account
- `/auth/login` - Sign in

### 2. Fill Form with Auto-Save
- Go to any form step
- Type something
- Wait 2 seconds → Auto-saved to cloud!
- Check Supabase dashboard > Table Editor > ds160_drafts

### 3. Multi-Draft Support
- Dashboard > "New Draft" button
- Create multiple applications
- Switch between them easily

### 4. Offline Support
- Disconnect internet
- Keep filling the form
- Data saved locally
- Reconnect → Auto-syncs!

### 5. User Profile
- `/profile` - View your profile
- Check sync quota (3 free/month)
- Change password
- View statistics

---

## 📂 Project Structure

```
ds160-helper/
├── supabase/
│   ├── schema.sql          # Database migration
│   └── SETUP.md            # Detailed setup guide
├── stores/
│   ├── auth.ts             # Authentication state
│   └── ds160.ts            # Form data + sync logic
├── pages/
│   ├── auth/
│   │   ├── login.vue       # Login page
│   │   └── signup.vue      # Registration page
│   ├── profile.vue         # User profile
│   ├── dashboard.vue       # Main dashboard
│   └── form/
│       └── step-*.vue      # Form steps
├── plugins/
│   ├── supabase.client.ts  # Supabase client
│   └── init.client.ts      # Store initialization
├── middleware/
│   └── auth.ts             # Auth guard
├── .env.example            # Environment template
└── nuxt.config.ts          # Nuxt configuration
```

---

## 🔧 Development

### Run Tests
```bash
npm test  # (if tests are set up)
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📝 Environment Variables

Required in `.env`:
```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGci...  # anon, public key

# Optional: For server-side admin operations
SUPABASE_SERVICE_KEY=eyJhbGci...  # service_role key
```

---

## 🎯 Testing Checklist

Basic Flow:
1. ✅ Sign up with new account
2. ✅ Fill in personal info (Step 1)
3. ✅ Data auto-saves to localStorage
4. ✅ Wait 2 seconds → syncs to cloud
5. ✅ Refresh page → data persists
6. ✅ Create second draft
7. ✅ Switch between drafts
8. ✅ Check profile page
9. ✅ Sign out
10. ✅ Sign in again → data restored

---

## 🐛 Troubleshooting

### "Supabase credentials not configured"
**Problem**: Environment variables not loaded

**Solution**:
1. Check `.env` file exists in project root
2. Verify `SUPABASE_URL` and `SUPABASE_KEY` are set
3. Restart dev server: `npm run dev`

### "Row Level Security" errors
**Problem**: Database policies not set up correctly

**Solution**:
1. Open Supabase SQL Editor
2. Run `supabase/schema.sql` again
3. Verify policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

### Auto-sync not working
**Problem**: Check browser console for errors

**Solutions**:
- Verify you're logged in
- Check network tab for API calls
- Ensure Supabase URL is correct
- Try manual sync: Click "Sync to Cloud" button

### Sign up not working
**Problem**: Email confirmation required

**Solution**:
1. Go to Supabase Dashboard
2. Authentication > Settings
3. Disable "Enable email confirmations"
4. Or configure SMTP for real emails

---

## 🚀 Deploy to Production

### Vercel (Recommended)

1. Push code to GitHub

2. Import to Vercel:
   - Go to vercel.com
   - Import your GitHub repo
   - Add environment variables:
     ```
     SUPABASE_URL=...
     SUPABASE_KEY=...
     SUPABASE_SERVICE_KEY=...
     ```

3. Deploy!

### Other Platforms
Works with any Node.js host:
- Netlify
- Railway
- Render
- AWS Amplify

---

## 📚 Documentation

- **Full Implementation Guide**: `IMPLEMENTATION_COMPLETE.md`
- **Supabase Setup**: `supabase/SETUP.md`
- **Database Schema**: `supabase/schema.sql`
- **Nuxt Docs**: https://nuxt.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

## 💡 Tips

### Free Tier Limits
- 3 cloud syncs per month (auto-resets)
- Auto-sync doesn't count if within 1 minute
- Manual sync always counts
- Upgrade to Premium for unlimited syncs

### Best Practices
1. Let auto-save handle most syncs
2. Use manual sync when completing sections
3. Create separate drafts for different applications
4. Export data periodically as backup

### Keyboard Shortcuts
- `Tab` - Navigate between fields
- `Ctrl/Cmd + S` - Manual sync (if implemented)
- `Esc` - Close modals

---

## 🎉 You're Ready!

Everything is set up. Start building your DS-160 application:

1. **Sign up** at `/auth/signup`
2. **Fill the form** starting at Step 1
3. **Data auto-saves** - relax and focus on accuracy
4. **Come back anytime** - your progress is saved
5. **Create multiple drafts** if needed

Questions? Check `IMPLEMENTATION_COMPLETE.md` for detailed docs.

Happy form-filling! 🦞
