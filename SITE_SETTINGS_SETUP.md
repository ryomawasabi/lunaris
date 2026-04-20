# Site Settings System Setup Guide

## Overview
Complete Site Settings system for YINYANG GUARDIAN admin panel with support for store information, social media links, shipping settings, and announcement management.

## Files Created

### 1. API Route
**Location:** `/src/app/api/admin/settings/route.ts`

Handles GET and PATCH requests for site settings:
- **GET** `/api/admin/settings` - Fetch all settings (returns defaults if table doesn't exist)
- **PATCH** `/api/admin/settings` - Update settings with a JSON object of key-value pairs

Features:
- Admin authentication check
- Graceful fallback to defaults if `site_settings` table doesn't exist
- Input validation for all settings keys
- Upsert pattern for safe updates

### 2. Admin Settings Page
**Location:** `/src/app/admin/settings/page.tsx`

A fully functional 'use client' component with sections:
- **Store Information** - name, email, phone, address
- **Social Media Links** - Instagram, Facebook, Twitter, Pinterest, TikTok
- **Shipping & Currency** - free shipping threshold, currency selection
- **Announcement Bar** - add/remove/reorder rotating messages

Features:
- Real-time form validation
- Toast notifications for success/error feedback
- Loading states with spinner
- Reordering announcements with up/down controls
- Live form state management
- Tailwind styling following design system

### 3. Database Migration
**Location:** `/supabase-site-settings.sql`

SQL migration script that:
- Creates `site_settings` table with key-value structure
- Adds timestamps (created_at, updated_at)
- Implements Row Level Security (RLS)
- Creates update trigger for timestamps
- Inserts default values for all settings keys

## Setup Instructions

### Step 1: Create the Database Table
Run the migration in Supabase:
```sql
-- Go to Supabase Dashboard → SQL Editor → New Query
-- Copy and paste the contents of supabase-site-settings.sql
-- Execute the query
```

Alternatively, you can manually execute:
```bash
psql -d your_database -f supabase-site-settings.sql
```

### Step 2: Verify the Files
Check that both files exist in your Next.js project:
```bash
ls -la src/app/api/admin/settings/route.ts
ls -la src/app/admin/settings/page.tsx
```

### Step 3: Test the Settings Page
1. Start the development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/admin/settings`

3. Try fetching settings by opening the browser console and running:
```javascript
fetch('/api/admin/settings')
  .then(res => res.json())
  .then(data => console.log(data))
```

## Supported Settings

All settings are stored as strings in the database:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `store_name` | string | "YINYANG GUARDIAN" | Your store name |
| `store_email` | string | "" | Contact email |
| `store_phone` | string | "" | Contact phone |
| `store_address` | string | "" | Store address |
| `instagram_url` | string | "https://instagram.com" | Instagram profile URL |
| `facebook_url` | string | "https://facebook.com" | Facebook page URL |
| `twitter_url` | string | "https://twitter.com" | Twitter profile URL |
| `pinterest_url` | string | "https://pinterest.com" | Pinterest profile URL |
| `tiktok_url` | string | "" | TikTok profile URL |
| `free_shipping_threshold` | string | "150" | Free shipping amount in USD |
| `announcement_messages` | string (JSON) | '["Free Shipping..."]' | Array of announcements |
| `currency` | string | "USD" | Store currency (USD, EUR, GBP, CAD, AUD, JPY) |

## Design System Compliance

All styles follow the YINYANG GUARDIAN design system:
- **Headings:** `font-serif text-xl/text-3xl text-dark`
- **Body text:** `font-sans text-sm text-warm`
- **Labels:** `font-sans text-sm font-medium text-dark`
- **Cards:** `bg-white border border-stone-light rounded-lg p-6`
- **Primary button:** `bg-gold text-cream hover:bg-gold-dark`
- **Secondary button:** `border border-stone-light hover:bg-stone-light`
- **Form inputs:** `border border-stone-light focus:ring-2 focus:ring-gold`

## Features

### Admin Authentication
All endpoints require admin authentication via `isAdmin()` function from `/lib/supabase/queries.ts`

### Error Handling
- Table not found gracefully returns defaults
- Invalid setting keys rejected with 400 error
- Upsert failures logged and reported
- Network errors handled with toast notifications

### Real-time Updates
- Settings load on page mount
- Changes reflected immediately in form
- Cancel button reloads from server
- Save button updates server and local state

### Announcement Management
- Add new announcements with Add button or Enter key
- Remove announcements with delete button
- Reorder with up/down arrow buttons
- Messages stored as JSON array in database
- Real-time synchronization with settings object

### Toast Notifications
- Success toast appears for 3 seconds on save
- Error toast shows if save fails
- Auto-dismisses
- Fixed position in top-right corner

## API Usage Examples

### Fetch Settings
```typescript
const settings = await fetch('/api/admin/settings').then(r => r.json())
console.log(settings.store_name) // "YINYANG GUARDIAN"
```

### Update Single Setting
```typescript
const response = await fetch('/api/admin/settings', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ store_email: 'hello@yinyang.com' })
})
const updated = await response.json()
```

### Update Multiple Settings
```typescript
const response = await fetch('/api/admin/settings', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    store_name: 'New Name',
    currency: 'EUR',
    free_shipping_threshold: '100'
  })
})
```

## Troubleshooting

### "Settings table does not exist"
Run the SQL migration first (Step 1 above)

### Settings not saving
- Check browser console for errors
- Verify admin auth is working
- Check Supabase dashboard RLS policies

### Announcements not reordering
- Check that announcements array is properly parsed from JSON
- Verify React state updates are triggering re-renders

### Toast notifications not appearing
- Check CSS is compiled (run `npm run build`)
- Verify Tailwind classes are in content list

## Future Enhancements
- Add setting groups/categories
- Implement settings history/audit log
- Add bulk import/export functionality
- Create webhook triggers on setting changes
- Add setting validation rules
- Implement settings versioning
