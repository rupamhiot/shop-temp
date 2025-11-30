# Ecommerce Platform Design Guidelines

## Design Approach

**Reference-Based Hybrid Approach:**
- **Buyer Interface:** Draw inspiration from Shopify, Etsy, and Airbnb for product discovery and browsing
- **Seller Dashboard:** Take cues from Linear and Notion for clean, functional workspace design
- **Landing Page:** Blend Airbnb's visual storytelling with Shopify's conversion-focused layouts

## Typography System

**Font Families:**
- Primary: Inter (headings, UI elements, buttons)
- Secondary: System font stack (body text, descriptions)

**Scale:**
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Product Titles: text-xl, font-medium
- Body Text: text-base, font-normal
- Dashboard Labels: text-sm, font-medium
- Metadata/Captions: text-xs to text-sm, text-gray-600

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Section padding: py-16 to py-24 (desktop), py-8 to py-12 (mobile)
- Card padding: p-6
- Grid gaps: gap-6 to gap-8
- Dashboard spacing: p-8 for main content areas

**Container Strategy:**
- Landing page sections: max-w-7xl mx-auto
- Product grids: max-w-7xl with full-width background
- Dashboard content: max-w-6xl
- Product detail pages: max-w-4xl for content, full-width for images

## Landing Page Structure

**Hero Section (80vh):**
- Full-width hero image showcasing featured products or lifestyle photography
- Centered overlay with blurred background for headline and CTA
- Headline communicating dual value proposition (buyers & sellers)
- Two primary CTAs: "Start Selling" and "Shop Now" with backdrop-blur-md

**Featured Products Section:**
- 4-column grid (lg:grid-cols-4, md:grid-cols-2, grid-cols-1)
- High-quality product images with subtle hover scale (hover:scale-105)
- Product cards with image, title, price, and seller name

**Category Showcase:**
- 3-column grid highlighting main product categories
- Large category images with text overlays
- Each card links to filtered product catalog

**Seller Benefits Section:**
- 2-column layout alternating image and content
- Statistics/metrics showcasing platform success (3-column stats grid)
- "Become a Seller" CTA

**How It Works:**
- 3-step process for both buyers and sellers
- Icon + title + description format
- Centered layout with max-w-5xl

**Social Proof:**
- Rotating testimonials from sellers and buyers
- 2-column grid with avatar, quote, name, and role

**Footer:**
- 4-column grid (categories, company, support, legal)
- Newsletter signup with input and button
- Social media icons and trust badges

## Buyer Interface

**Navigation:**
- Sticky header with search bar, category dropdown, cart icon
- Mobile: Hamburger menu with drawer
- Search bar spans 50% of header width on desktop

**Product Catalog:**
- Infinite scrolling grid: lg:grid-cols-4, md:grid-cols-3, sm:grid-cols-2
- Sidebar filters (categories, price range, ratings) - fixed on desktop, drawer on mobile
- Product cards: Image (aspect-ratio-square), title, price, rating stars, seller badge
- Loading skeleton screens for infinite scroll

**Product Detail Page:**
- 2-column layout: Image gallery (60%) + Product info (40%)
- Image gallery with thumbnails below main image
- Sticky "Add to Cart" section when scrolling
- Tabs for Description, Seller Info, Reviews
- Related products carousel at bottom

**Shopping Cart:**
- Slide-in drawer from right side
- Item cards with thumbnail, title, quantity controls, price
- Sticky footer with subtotal and checkout button
- Empty state with continue shopping CTA

## Seller Dashboard

**Sidebar Navigation (240px fixed):**
- Logo at top
- Navigation items: Dashboard, Products, Orders, Analytics, Settings
- Each with icon from Heroicons
- Active state: background with rounded corners

**Dashboard Overview:**
- Stats cards in 4-column grid showing: Total Sales, Active Listings, Orders, Revenue
- Recent orders table with sortable columns
- Quick actions: "Add Product", "View All Orders"

**Product Management:**
- Data table with: Image thumbnail, Title, Price, Stock, Status, Actions
- Bulk actions toolbar when items selected
- Filter/search bar above table
- Pagination controls

**Add/Edit Product Form:**
- Single column form with clear section breaks
- Image upload with drag-and-drop zone (multiple images)
- Form fields: Title, Description (textarea), Price, Category (dropdown), Stock, Tags
- WYSIWYG editor for description
- Image previews with reorder capability
- Save and Publish buttons at top-right

## Component Library

**Buttons:**
- Primary: Solid background, rounded-lg, px-6 py-3
- Secondary: Border with transparent background
- Icon buttons: Square with centered icon, hover:bg-gray-100

**Cards:**
- Product cards: Border, rounded-lg, overflow-hidden, shadow-sm, hover:shadow-md
- Dashboard cards: Border, rounded-xl, p-6
- Testimonial cards: Border, rounded-xl, p-8, relative for quote marks

**Forms:**
- Input fields: border-gray-300, rounded-lg, px-4 py-2, focus:ring-2
- Dropdowns: Consistent with inputs
- Labels: text-sm font-medium, mb-2
- Error states: border-red-500 with text-red-600 helper text

**Navigation:**
- Tabs: Border-bottom with active indicator
- Breadcrumbs: text-sm with chevron separators
- Pagination: Numbers with prev/next, active state highlighted

**Data Display:**
- Tables: Striped rows, hover:bg-gray-50, sticky header
- Badges: Rounded-full, px-3 py-1, text-xs for status indicators
- Rating stars: Gold for filled, gray for empty

## Images

**Required Images:**
1. **Hero Image:** Lifestyle shot of products in use or curated product collection, full-width, high-quality
2. **Category Images:** 3 hero-style category images showcasing product types
3. **Featured Products:** 8 high-quality product photos with white/neutral backgrounds
4. **Seller Benefits:** 2 images showing seller success/workspace
5. **Product Detail:** Multiple angle shots, lifestyle context photos
6. **Testimonial Avatars:** Circular headshots for social proof

All images should be optimized, use aspect-ratio classes, and have proper alt text. Product images should be consistent in style and background treatment.

## Accessibility

- All interactive elements keyboard navigable
- Form inputs with associated labels and aria-labels
- Focus states visible with ring-2
- Sufficient color contrast (WCAG AA minimum)
- Skip to main content link
- Screen reader announcements for cart updates and infinite scroll loading