# DS-160 Helper - Visa Application Assistant

A modern web application built with Nuxt 3 to help users complete their DS-160 visa application forms with confidence.

## Features

- **12-Step Guided Process**: Break down the complex form into manageable steps
- **Apple-Inspired Design**: Clean, minimal interface with focus on usability
- **Auto-Save**: Progress automatically saved to browser localStorage
- **High-Risk Field Warnings**: Critical fields highlighted with helpful tips
- **Cloud Sync**: 3 free cloud syncs to access your draft from multiple devices
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Progress Tracking**: Real-time completion percentage
- **Draft Management**: Export/import your application data

## Tech Stack

- **Nuxt 3** - Vue 3 framework
- **Vue 3** - Composition API with TypeScript
- **Pinia** - State management
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

## Project Structure

```
ds160-helper/
├── assets/
│   └── css/
│       └── main.css           # Global styles and Tailwind directives
├── components/
│   └── form/
│       ├── FormInput.vue      # Input component with high-risk alerts
│       ├── FormCheckbox.vue   # Checkbox component
│       ├── FormSelect.vue     # Select dropdown component
│       └── FormNavigation.vue # Step navigation with progress bar
├── layouts/
│   └── default.vue            # Main layout with header/footer
├── pages/
│   ├── index.vue              # Marketing homepage
│   ├── features.vue           # Features page
│   ├── pricing.vue            # Pricing page
│   ├── dashboard.vue          # Application dashboard
│   └── form/
│       ├── step-1.vue         # Personal Information
│       ├── step-2.vue         # Contact Information
│       ├── step-3.vue         # Passport Information
│       ├── step-4.vue         # Travel Information
│       └── step-[5-12].vue    # Additional steps
├── stores/
│   └── ds160.ts               # Pinia store with auto-save logic
├── types/
│   └── index.ts               # TypeScript type definitions
├── reference/
│   └── design/
│       └── 001-reference.md   # Apple design system guidelines
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies

```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Design System

Following Apple's design principles:

- **Typography**: Inter font family, 48px+ hero headlines
- **Colors**: Primary blue, warning orange, neutral grays
- **Spacing**: 8pt grid system
- **Borders**: 1px subtle borders, 6-12px border radius
- **Animations**: Smooth 200ms transitions

## Key Features Implemented

### Auto-Save System
- Automatically saves form data to localStorage after every change
- Debounced to prevent excessive writes
- Preserves data across browser sessions

### High-Risk Field System
- Pre-defined list of critical fields that need special attention
- Orange border and warning icon for high-risk fields
- Contextual tips and best practices displayed inline

### Cloud Sync (Simulated)
- Free users get 3 cloud syncs
- Tracks sync count and status (local/syncing/synced/error)
- Can be upgraded to unlimited in premium tier

### Progressive Form
- 12 steps matching official DS-160 structure
- Progress tracking with completion percentage
- Step validation and navigation
- Can jump to any step from dashboard

### Dashboard
- Overview of draft status
- Progress visualization
- Sync status indicator
- Export/import functionality
- Quick access to all form steps

## State Management

Pinia store (`stores/ds160.ts`) manages:
- Form data for all 12 steps
- Draft metadata (ID, timestamps, progress)
- Auto-save logic
- Sync operations
- High-risk field definitions

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Hamburger menu on mobile
- Touch-friendly form controls
- Optimized layouts for all screen sizes

## Future Enhancements

- [ ] Real cloud sync API integration
- [ ] PDF export functionality
- [ ] Application checklist
- [ ] Common mistakes guide
- [ ] Multi-language support
- [ ] Document upload for passport photo
- [ ] Email notifications
- [ ] Payment integration for premium features

## License

MIT

## Support

For questions or issues, please contact support or visit our help center.
