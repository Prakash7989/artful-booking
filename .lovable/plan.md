

# KalaBooking - Complete Platform Plan

## Overview
A full-stack booking platform for discovering and booking Indian folk and classical artists, featuring a warm traditional Indian aesthetic with saffron, maroon, and gold colors.

---

## Phase 1: Foundation & Database

### Database Schema (Supabase)
- **users** - Extended auth with role management
- **user_roles** - Separate table for admin/artisan/customer roles (security best practice)
- **artisan_profiles** - Artist details, experience, pricing, approval status
- **states** - All 28 Indian states + 8 UTs with images
- **art_forms** - Traditional art forms linked to states
- **availability** - Artisan calendar with blocked/available dates
- **bookings** - Booking records with status tracking
- **media** - Photos/videos with Supabase Storage
- **reviews** - Post-performance ratings
- **transactions** - Payment records with commission tracking

### Authentication Setup
- **Customers**: Email + Password login
- **Artisans**: Phone + OTP login (via Twilio SMS integration)
- **Admins**: Email + Password with role-based access

---

## Phase 2: Public User Experience

### Home Page
- Hero section: "Book Authentic Indian Folk Artists from Every State"
- Warm traditional design with Indian patterns and cultural imagery
- Featured artists carousel
- Quick search by state or art form
- Trust indicators (verified artists, instant booking, secure payments)

### Discovery Flow
**States Grid Page**
- Visual grid of all Indian states with traditional artwork
- State cards showing art form count and artist count
- Filter and search functionality

**State Detail Page**
- State hero with cultural imagery
- List of native art forms with descriptions
- Featured artists from that state

**Art Form Page**
- Art form description and history
- Grid of verified artists practicing this form
- Filter by price, experience, availability

**Artist Listings**
- Artist cards with photo, name, experience, base price
- Availability indicator (green/yellow/red)
- Quick "Check Availability" button
- Preview video thumbnail

### Artist Profile Page
- Full bio and story
- Photo gallery (uploaded to Supabase Storage)
- Video gallery (direct uploads)
- Art form badges
- Past performances section
- Pricing table (base + add-ons)
- Interactive availability calendar
- **"Book Instantly"** prominent CTA
- Contact details HIDDEN until booking complete

---

## Phase 3: Auto-Booking System

### Booking Flow
1. User selects date from availability calendar
2. User enters city and duration
3. System validates availability in real-time
4. Price calculated (base + add-ons + platform commission)
5. Razorpay payment gateway integration
6. On successful payment:
   - Booking confirmed instantly
   - Artisan notified via SMS
   - Contact details revealed to customer
   - Confirmation email sent to both parties

### Booking Management
- Customer booking history page
- Booking status tracking (Confirmed → Completed)
- Cancellation with refund rules
- Post-event review submission

---

## Phase 4: Artisan Dashboard (Mobile-First)

### Onboarding Flow (Simple, 3 Steps)
1. **Phone Verification**: Enter phone → OTP → Verified
2. **Basic Info**: Name, State (dropdown), Art Form (from admin list)
3. **Submit for Review**: Pending admin approval

### Dashboard Features (Icon-Heavy, Minimal Text)
- **Profile Setup**
  - Personal/Group name
  - Bio and experience
  - Price setting
  - Photo upload (simple camera/gallery picker)
  - Video upload
  
- **Availability Calendar**
  - Simple tap to block/unblock dates
  - Visual month view
  - Batch date selection

- **My Bookings**
  - Upcoming bookings list
  - Customer details (post-booking)
  - Status updates

- **Earnings**
  - Total earnings summary
  - Payment history
  - Commission breakdown

### Design Considerations
- Large tap targets
- Icon-first navigation
- Minimal form fields
- Progress indicators
- Offline-friendly where possible

---

## Phase 5: Admin Dashboard

### Artisan Management
- Pending approval queue
- Approve/Reject with reason
- Edit artisan profiles
- Enable/Disable listings
- View artisan performance metrics

### Content Management
- Manage states (add/edit images)
- Manage art forms (link to states)
- Featured artists selection

### Platform Settings
- Commission percentage (global and per-category)
- Pricing rules
- Cancellation policies

### Bookings & Transactions
- All bookings overview with filters
- Transaction history
- Revenue dashboard
- Dispute handling interface
- Refund processing

### Analytics
- Popular states and art forms
- Booking trends
- Artist performance
- Revenue metrics

---

## Phase 6: Payments & Notifications

### Razorpay Integration
- Custom integration for Indian payments (UPI, cards, wallets)
- Commission split (platform vs artisan)
- Refund handling
- Transaction records

### Notifications (via Supabase Edge Functions)
- SMS notifications to artisans (Twilio)
- Email confirmations to customers
- Booking reminders
- Payment receipts

---

## Technical Architecture

### Frontend
- React with TypeScript
- Tailwind CSS with warm Indian color palette
- Mobile-first responsive design
- Recharts for admin analytics

### Backend (Supabase)
- PostgreSQL database
- Row Level Security for data protection
- Edge Functions for:
  - Razorpay payment processing
  - OTP verification via Twilio
  - SMS/Email notifications
  - Commission calculations
- Supabase Storage for media

### Security
- Role-based access control
- Contact details hidden via RLS until booking
- Secure payment handling
- Phone number verification

---

## Design System

### Color Palette
- **Primary**: Saffron/Orange (#FF9933)
- **Secondary**: Maroon (#800000)
- **Accent**: Gold (#FFD700)
- **Neutral**: Warm cream and browns
- **Text**: Dark brown/black

### Typography
- Clean, readable fonts
- Larger text for low-tech users
- Icon + text labels

### Cultural Elements
- Subtle mandala patterns
- Traditional border designs
- Folk art inspired illustrations
- Warm, inviting photography style

---

## MVP Scope Summary

| Feature | Included |
|---------|----------|
| State-based discovery | ✅ |
| Art form listings | ✅ |
| Artist profiles | ✅ |
| Auto-booking with Razorpay | ✅ |
| Artisan phone OTP login | ✅ |
| Artisan dashboard (mobile-first) | ✅ |
| Admin approval workflow | ✅ |
| Admin dashboard | ✅ |
| Photo/Video uploads | ✅ |
| SMS notifications | ✅ |
| Interactive India map | ❌ (Phase 2) |
| Multi-language | ❌ (Phase 2) |

---

## Prerequisites Before Building

1. **Connect External Supabase** - You'll need to connect your Supabase project
2. **Razorpay Account** - API keys for payment integration
3. **Twilio Account** - For SMS OTP and notifications
4. **Domain Decision** - For production authentication redirects

