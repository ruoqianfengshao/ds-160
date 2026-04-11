# DS-160 Helper - Visa Application Assistant

A modern, user-friendly web application to help you complete your DS-160 visa application form with confidence. Built with Nuxt 3, Vue 3, TypeScript, and Supabase.

## ✨ Features

- 📝 **Step-by-step guided form** - Break down the complex DS-160 into manageable steps
- 💾 **Auto-save & Cloud Sync** - Never lose your progress with automatic local and cloud backups
- 🔐 **User Authentication** - Secure sign-up and login with email/password
- 📊 **Multi-Draft Support** - Manage multiple applications simultaneously
- 🚫 **Offline Support** - Continue working even without internet connection
- ⚠️ **Smart Validation** - Catch common mistakes before submission
- 🔔 **High-Risk Field Alerts** - Special warnings for critical fields
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 🌐 **Free Tier** - 3 cloud syncs per month (auto-resets monthly)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

Visit http://localhost:3000

**First time setup?** Follow the [Quick Start Guide](QUICKSTART.md) or [Supabase Setup Guide](supabase/SETUP.md).

## 📦 Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **UI**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Storage**: LocalStorage + Supabase Cloud

## 📖 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Implementation Guide](IMPLEMENTATION_COMPLETE.md)** - Complete feature documentation
- **[Supabase Setup](supabase/SETUP.md)** - Database setup instructions
- **[Database Schema](supabase/schema.sql)** - SQL migration file

## 🎯 Project Structure

```
ds160-helper/
├── pages/              # Route pages
│   ├── auth/          # Login & signup pages
│   ├── dashboard.vue  # Main dashboard
│   ├── profile.vue    # User profile
│   └── form/          # 12-step form pages
├── stores/            # Pinia stores
│   ├── auth.ts       # Authentication state
│   └── ds160.ts      # Form data & sync logic
├── components/        # Reusable Vue components
├── plugins/          # Nuxt plugins
├── middleware/       # Route guards
├── supabase/         # Database migration & docs
└── types/            # TypeScript type definitions
```

## 🔐 Authentication & Security

- **Row Level Security (RLS)** - Users can only access their own data
- **JWT Tokens** - Secure session management
- **Password Validation** - Minimum 8 characters
- **Environment Variables** - Sensitive data kept out of codebase
- **HTTPS Only** - Secure data transmission (in production)

## 💾 Data Sync Strategy

### Offline-First Architecture
```
User Input → localStorage (instant) → Debounce 2s → Supabase (background)
```

### Features
- ✅ Instant save to localStorage
- ✅ Auto-sync to cloud after 2 seconds
- ✅ Manual sync option
- ✅ Offline capability
- ✅ Conflict resolution (server wins)
- ✅ Sync quota management

## 🗄️ Database Schema

### Tables
- **profiles** - User profiles and subscription plans
- **ds160_drafts** - Form drafts with JSONB storage
- **sync_history** - Audit log for all sync operations

### Key Features
- Row Level Security (RLS) on all tables
- Auto-incrementing sync quota
- Monthly quota reset
- JSONB for flexible form data storage

## 🎨 UI/UX Features

- Clean, modern design with gradient backgrounds
- Progress tracking across all steps
- Real-time validation
- Loading states and error messages
- Responsive navigation
- Modal confirmations for destructive actions
- Draft management interface
- Sync status indicators

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm generate
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

## 📝 License

MIT License - feel free to use this project for your own applications!

## 🙏 Acknowledgments

- Built with [Nuxt 3](https://nuxt.com/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

Having issues? Check out:
- [Quick Start Guide](QUICKSTART.md)
- [Troubleshooting Section](QUICKSTART.md#troubleshooting)
- [Implementation Guide](IMPLEMENTATION_COMPLETE.md)

---

**Note**: This is a helper tool for filling out the DS-160 form. Always verify your information on the official U.S. Department of State website before submission.
