# ComponentPulse E-Commerce Platform - Complete Redevelopment Specification

## Project Overview

**Project Name:** ComponentPulse  
**Type:** E-Commerce Web Application for Electronics, Energy & Solar Products  
**Target Market:** Uganda & East Africa  
**Currency:** UGX (Ugandan Shilling)

---

## Confirmed Requirements

| Requirement | Decision |
|-------------|----------|
| **Delivery Zones** | Dynamic zones managed by Super Admin |
| **Payment Methods** | Mobile Money (MTN, Airtel) + Card Payments (Visa/Mastercard) |
| **Admin Roles** | 3 levels: Super Admin, Admin, Staff |
| **SMS Notifications** | Later integration (Africa's Talking) |
| **Product Variants** | Yes - color, size, capacity, etc. |
| **Returns/Refunds** | Full returns management system |
| **Existing Data** | Starting fresh |
| **Branding** | Client will provide |
| **Pickup Option** | Yes - pickup from set locations OR delivery |
| **Stock Alerts** | Per-product low stock notifications + auto out-of-stock |

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | Next.js (React) | 14.x (App Router) |
| **UI Library** | MUI (Material-UI) | v7.x |
| **Backend/Database** | Firebase | Latest |
| **Authentication** | Firebase Auth | - |
| **Database** | Cloud Firestore | - |
| **File Storage** | Firebase Storage | - |
| **Backend Functions** | Firebase Cloud Functions | - |
| **Payment Gateway** | Flutterwave | v4 |
| **Hosting** | Firebase Hosting / Vercel | - |
| **State Management** | React Context + Zustand | - |
| **Form Handling** | React Hook Form + Zod | - |
| **SMS (Future)** | Africa's Talking | - |

---

## Product Categories

The platform will support multiple product categories including:

| Category | Examples |
|----------|----------|
| **Electronics** | Arduino, Raspberry Pi, ESP32, STM32, sensors, microcontrollers |
| **Energy** | Batteries, inverters, power supplies, UPS systems |
| **Solar** | Solar panels, charge controllers, solar kits, solar lights |
| **Components** | Resistors, capacitors, LEDs, wires, connectors |
| **Tools** | Soldering equipment, multimeters, oscilloscopes |
| **Kits** | Starter kits, learning kits, project kits |
| **Accessories** | Cases, cables, adapters, peripherals |

---

## Core Features

### 1. Authentication & User Management

> **📄 See [USER_MANAGEMENT.md](./USER_MANAGEMENT.md) for complete user/role/permissions documentation**

#### 1.1 Customer Authentication
- [ ] Email/Password registration & login
- [ ] Google OAuth sign-in (Firebase Auth)
- [ ] Phone number authentication (OTP)
- [ ] Password reset via email
- [ ] Email verification
- [ ] Session management with Firebase tokens
- [ ] Remember me functionality

#### 1.2 User Profile
- [ ] Profile picture upload (Firebase Storage)
- [ ] Edit personal information (name, email, phone)
- [ ] Manage delivery addresses (multiple addresses)
- [ ] View order history
- [ ] Wishlist management
- [ ] Account deletion

#### 1.3 Admin Authentication
- [ ] Separate admin login portal (`/admin`)
- [ ] Role-based access control:
  - **Super Admin** - Full system access + user management
  - **Admin** - Product, order, customer management
  - **Staff** - Limited view + basic order processing
- [ ] Admin activity logging
- [ ] Session timeout for security

---

### 2. Product Management

#### 2.1 Product Catalog
- [ ] Product listing with pagination
- [ ] Grid/List view toggle
- [ ] Product categories & subcategories
- [ ] Product search (by name, description, SKU)
- [ ] Advanced filtering:
  - By category
  - By price range
  - By availability (in stock / out of stock)
  - By brand
  - By rating
- [ ] Sorting options:
  - Featured
  - Price (low to high / high to low)
  - Newest
  - Best selling
  - Rating

#### 2.2 Product Details
- [ ] Product images gallery (multiple images)
- [ ] Product name, description, specifications
- [ ] Price display with compare-at-price (discounts)
- [ ] Stock quantity indicator
- [ ] Category breadcrumb
- [ ] Add to cart with quantity selector
- [ ] Add to wishlist
- [ ] Share product (social/copy link)
- [ ] Related products
- [ ] Product reviews & ratings

#### 2.3 Product Variants System
Products can have multiple variants (e.g., different colors, sizes, capacities):

- [ ] Variant types: Color, Size, Capacity, Wattage, Voltage, etc.
- [ ] Each variant has its own:
  - SKU
  - Price (can differ from base price)
  - Stock quantity
  - Images
- [ ] Variant selection on product detail page
- [ ] Stock tracking per variant
- [ ] Low stock alerts per variant

#### 2.4 Product Data Structure (Firestore)
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications: string[];
  features: string[];
  basePrice: number;
  compareAtPrice?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: string;
  images: string[]; // Firebase Storage URLs
  mainImage: string;
  sku: string;
  
  // Variants
  hasVariants: boolean;
  variantTypes?: string[]; // e.g., ['color', 'capacity']
  variants?: ProductVariant[];
  
  // Stock (for products without variants)
  stockQuantity: number;
  lowStockThreshold: number; // Alert when stock falls below this
  isInStock: boolean;
  
  isFeatured: boolean;
  isOnSale: boolean;
  isActive: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProductVariant {
  id: string;
  sku: string;
  name: string; // e.g., "Red - 64GB"
  attributes: {
    [key: string]: string; // e.g., { color: "Red", capacity: "64GB" }
  };
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isInStock: boolean;
  images?: string[];
}
```

#### 2.4 Categories
- [ ] Category listing page
- [ ] Category with image and description
- [ ] Subcategories support
- [ ] Products per category count

---

### 3. Shopping Cart

#### 3.1 Cart Features
- [ ] Add/remove items
- [ ] Update quantity
- [ ] Persist cart in localStorage (guest) + Firestore (logged in)
- [ ] Sync cart on login
- [ ] Cart item count badge in header
- [ ] Mini cart dropdown
- [ ] Full cart page
- [ ] Clear cart option
- [ ] Save for later (move to wishlist)

#### 3.2 Cart Summary
- [ ] Subtotal calculation
- [ ] Shipping cost preview
- [ ] Discount/coupon code application
- [ ] Total calculation
- [ ] Free shipping threshold indicator

#### 3.3 Cart Data Structure
```typescript
interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface Cart {
  userId?: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 4. Checkout & Orders

#### 4.1 Checkout Process
- [ ] Guest checkout option
- [ ] Login/register during checkout
- [ ] Delivery address selection/entry
- [ ] Delivery location selection (Region → District → Area)
- [ ] Delivery cost calculation based on location
- [ ] Order summary review
- [ ] Coupon/discount code application
- [ ] Payment method selection

#### 4.2 Delivery & Pickup System

**Delivery Options:**
- [ ] Zone-based delivery pricing (Super Admin controlled)
- [ ] Free delivery threshold (configurable, e.g., orders above UGX 500,000)
- [ ] Express delivery option (additional cost)
- [ ] Standard delivery

**Pickup Options:**
- [ ] Pickup from set locations (no delivery cost)
- [ ] Multiple pickup locations managed by Super Admin
- [ ] Pickup location details (address, hours, contact)
- [ ] Pickup notification when order is ready

**Delivery Zones Data Structure (Super Admin Managed):**
```typescript
interface DeliveryZone {
  id: string;
  name: string; // e.g., "Kampala Central"
  region: string;
  district: string;
  areas: string[];
  standardCost: number;
  expressCost: number;
  estimatedDays: {
    standard: string; // e.g., "2-3 days"
    express: string;  // e.g., "Same day"
  };
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface PickupLocation {
  id: string;
  name: string; // e.g., "ComponentPulse Main Store"
  address: string;
  district: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  contactPhone: string;
  operatingHours: {
    weekdays: string; // e.g., "8AM - 6PM"
    saturday: string;
    sunday: string;
  };
  isActive: boolean;
  createdAt: Timestamp;
}
```

**Default Delivery Zones (Editable by Super Admin):**
| Zone | Region | Standard Cost | Express Cost | Est. Days |
|------|--------|---------------|--------------|-----------|
| Kampala Central | Central | UGX 5,000 | UGX 15,000 | 1-2 days |
| Kampala Suburbs | Central | UGX 8,000 | UGX 20,000 | 2-3 days |
| Wakiso | Central | UGX 10,000 | UGX 25,000 | 2-3 days |
| Entebbe | Central | UGX 12,000 | UGX 30,000 | 2-3 days |
| Mukono | Central | UGX 12,000 | UGX 30,000 | 2-3 days |
| Jinja | Eastern | UGX 20,000 | UGX 40,000 | 3-5 days |
| Mbale | Eastern | UGX 25,000 | UGX 50,000 | 4-6 days |
| Mbarara | Western | UGX 25,000 | UGX 50,000 | 4-6 days |
| Gulu | Northern | UGX 30,000 | UGX 60,000 | 5-7 days |
| Other Upcountry | Various | UGX 35,000 | N/A | 5-10 days |

#### 4.3 Payment Integration (Flutterwave v4)
- [ ] Mobile Money (MTN, Airtel)
- [ ] Card payments (Visa, Mastercard)
- [ ] Payment verification webhook
- [ ] Payment status handling (pending, success, failed)
- [ ] Retry payment for failed transactions
- [ ] Payment receipts

#### 4.4 Order Creation
- [ ] Generate unique order number
- [ ] Order confirmation email/SMS
- [ ] Order confirmation page
- [ ] Order receipt download (PDF)

#### 4.5 Order Data Structure
```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  deliveryAddress: {
    region: string;
    district: string;
    area: string;
    streetAddress: string;
    landmark?: string;
  };
  deliveryMethod: 'standard' | 'express' | 'pickup';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  statusHistory: StatusUpdate[];
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface StatusUpdate {
  status: string;
  timestamp: Timestamp;
  updatedBy: string;
  note?: string;
}
```

---

### 5. Order Tracking

#### 5.1 Customer Order Tracking
- [ ] Order history page (my orders)
- [ ] Order details view
- [ ] Real-time order status updates
- [ ] Status timeline visualization
- [ ] Track order by order number (for guests)
- [ ] Estimated delivery date
- [ ] Delivery person contact (when out for delivery)
- [ ] Order cancellation request

#### 5.2 Order Status Flow
```
pending → confirmed → processing → shipped → out_for_delivery → delivered
                ↓                                                    ↓
            cancelled                                          return_requested
                                                                     ↓
                                                              return_approved → returned → refunded
```

---

### 6. Returns & Refunds Management

#### 6.1 Customer Return Flow
- [ ] Request return from order history (within return window)
- [ ] Select items to return
- [ ] Provide reason for return
- [ ] Upload photos (for damaged items)
- [ ] Track return status
- [ ] View refund status

#### 6.2 Return Reasons
- Defective/damaged product
- Wrong item received
- Item not as described
- Changed mind (within policy)
- Missing parts/accessories

#### 6.3 Admin Return Management
- [ ] View return requests
- [ ] Approve/reject returns
- [ ] Add notes to return
- [ ] Initiate refund
- [ ] Track returned items
- [ ] Generate return reports

#### 6.4 Return Data Structure
```typescript
interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  items: ReturnItem[];
  reason: string;
  reasonCategory: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'missing_parts' | 'other';
  description: string;
  images?: string[]; // Firebase Storage URLs
  status: 'pending' | 'approved' | 'rejected' | 'item_received' | 'refunded';
  statusHistory: StatusUpdate[];
  refundAmount?: number;
  refundMethod?: string;
  refundReference?: string;
  adminNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  processedBy?: string;
  processedAt?: Timestamp;
}

interface ReturnItem {
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  reason: string;
}
```

#### 6.5 Return Policy Settings (Super Admin)
- [ ] Return window (e.g., 30 days)
- [ ] Restocking fee percentage
- [ ] Non-returnable categories
- [ ] Refund methods available

---

### 7. Admin Dashboard

#### 7.1 Dashboard Overview
- [ ] Sales summary (today, week, month, year)
- [ ] Revenue charts
- [ ] Order statistics
- [ ] Low stock alerts
- [ ] Recent orders
- [ ] New customers
- [ ] Top selling products

#### 7.2 Product Management (Admin)
- [ ] Add new product
- [ ] Edit product details
- [ ] Upload/manage product images
- [ ] Set stock quantity
- [ ] Mark as featured/on sale
- [ ] Bulk import products (CSV)
- [ ] Bulk actions (delete, update status)
- [ ] Product archive/restore

#### 7.3 Category Management
- [ ] Add/edit/delete categories
- [ ] Category hierarchy (subcategories)
- [ ] Category images
- [ ] Reorder categories

#### 7.4 Order Management (Admin)
- [ ] View all orders with filters
- [ ] Filter by status, date, payment status
- [ ] Update order status
- [ ] Add status notes
- [ ] View order details
- [ ] Print order/packing slip
- [ ] Bulk status updates
- [ ] Order search by order number, customer

#### 7.5 User Management (Admin)
- [ ] View all customers
- [ ] Customer details & order history
- [ ] Search customers
- [ ] Disable/enable accounts
- [ ] Admin user management (add/remove admins)
- [ ] Role assignment

#### 7.6 Delivery Management (Admin)
- [ ] Manage delivery zones
- [ ] Set zone pricing
- [ ] View pending deliveries
- [ ] Assign delivery to staff
- [ ] Track delivery status
- [ ] Delivery reports

#### 7.7 Deals & Promotions (Admin)
- [ ] Create daily deals
- [ ] Bundle management
- [ ] Package deals
- [ ] Discount codes/coupons
- [ ] Set discount percentages
- [ ] Schedule deals (start/end dates)

#### 7.8 Reports & Analytics
- [ ] Sales reports
- [ ] Product performance
- [ ] Customer insights
- [ ] Delivery performance
- [ ] Export reports (CSV, PDF)

---

### 8. Additional Features

#### 8.1 Deals Section
- [ ] Daily deals page
- [ ] Bundle deals
- [ ] Package deals
- [ ] Countdown timers for limited deals
- [ ] Deal detail pages

#### 8.2 Static Pages
- [ ] About Us
- [ ] Contact/Support
- [ ] FAQ
- [ ] Terms & Conditions
- [ ] Privacy Policy
- [ ] Training/Courses (coming soon)

#### 8.3 Communication
- [ ] WhatsApp chat integration
- [ ] Contact form
- [ ] Newsletter signup
- [ ] Email notifications:
  - Order confirmation
  - Order status updates
  - Shipping notification
  - Delivery confirmation
  - Payment receipt

#### 8.4 SEO & Performance
- [ ] SEO meta tags
- [ ] Open Graph tags
- [ ] Sitemap generation
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Server-side rendering (SSR)

---

## Database Schema (Firestore Collections)

```
/users/{userId}
  - profile data
  - addresses (subcollection)

/products/{productId}
  - product data
  - reviews (subcollection)

/categories/{categoryId}
  - category data

/orders/{orderId}
  - order data
  - items (embedded)
  - statusHistory (embedded)

/carts/{cartId}
  - cart data (for logged-in users)

/deals/{dealId}
  - dailyDeals (subcollection)
  - bundles (subcollection)
  - packages (subcollection)

/deliveryZones/{zoneId}
  - zone pricing data

/coupons/{couponId}
  - coupon/discount codes

/admins/{adminId}
  - admin users with roles

/settings/config
  - app configuration
  - business info
  - delivery settings
```

---

## Page Structure

### Public Pages (Customer)
```
/                           → Homepage
/products                   → All products
/products/[slug]            → Product detail
/categories                 → All categories
/categories/[slug]          → Category products
/deals                      → All deals
/deals/daily/[slug]         → Daily deal detail
/deals/bundles/[slug]       → Bundle detail
/deals/packages/[slug]      → Package detail
/cart                       → Shopping cart
/checkout                   → Checkout flow
/order-confirmation/[id]    → Order confirmation
/track-order                → Track order (guest)
/about                      → About us
/support                    → Support/Contact
/training                   → Training programs

/account                    → Account dashboard
/account/orders             → Order history
/account/orders/[id]        → Order details
/account/addresses          → Manage addresses
/account/wishlist           → Wishlist
/account/profile            → Edit profile

/login                      → Login page
/register                   → Registration
/forgot-password            → Password reset
```

### Admin Pages
```
/admin                      → Admin login
/admin/dashboard            → Dashboard overview
/admin/products             → Product list
/admin/products/new         → Add product
/admin/products/[id]        → Edit product
/admin/categories           → Category management
/admin/orders               → Order list
/admin/orders/[id]          → Order details
/admin/customers            → Customer list
/admin/customers/[id]       → Customer details
/admin/delivery             → Delivery zones
/admin/deals                → Deals management
/admin/coupons              → Coupon management
/admin/reports              → Reports
/admin/settings             → App settings
/admin/users                → Admin user management
```

---

## Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (Next.js 14 + MUI v7)
- [ ] Firebase configuration
- [ ] Theme and layout setup
- [ ] Authentication system
- [ ] Basic routing structure

### Phase 2: Product & Catalog (Week 2-3)
- [ ] Product listing page
- [ ] Product detail page
- [ ] Category system
- [ ] Search & filtering
- [ ] Product data seeding

### Phase 3: Cart & Checkout (Week 3-4)
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] Delivery zones setup
- [ ] Flutterwave integration
- [ ] Order creation

### Phase 4: User Features (Week 4-5)
- [ ] User dashboard
- [ ] Order history & tracking
- [ ] Address management
- [ ] Wishlist
- [ ] Profile management

### Phase 5: Admin Dashboard (Week 5-7)
- [ ] Admin authentication
- [ ] Dashboard overview
- [ ] Product management
- [ ] Order management
- [ ] Customer management
- [ ] Delivery management
- [ ] Reports

### Phase 6: Deals & Extras (Week 7-8)
- [ ] Deals system
- [ ] Coupon system
- [ ] Email notifications
- [ ] Static pages
- [ ] WhatsApp integration

### Phase 7: Testing & Launch (Week 8-9)
- [ ] Testing all flows
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Production deployment

---

## Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Flutterwave
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_ENCRYPTION_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=ComponentPulse

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+256790270840
```

---

## What We're Keeping from Previous Version

### Good Patterns to Retain
1. **Component Structure** - Modular component organization
2. **Cart Logic** - useReducer pattern for cart state
3. **localStorage Persistence** - Cart persistence for guests
4. **Theme Toggle** - Dark/light mode support
5. **WhatsApp Integration** - Customer communication
6. **Newsletter Signup** - Marketing capture
7. **Breadcrumb Navigation** - UX pattern
8. **Product Card Design** - Grid/list view toggle
9. **Deals Structure** - Daily deals, bundles, packages concept
10. **Support Page Structure** - FAQs, resources, contact options

### What's Changing
1. **Backend** - Django → Firebase
2. **UI Library** - shadcn/ui → MUI v7
3. **Payment** - Basic → Flutterwave v4 integration
4. **Admin** - None → Full admin dashboard
5. **Order Management** - Basic → Complete tracking system
6. **Delivery** - Fixed → Zone-based dynamic pricing

---

## Notes & Considerations

1. **Mobile Money Focus** - Primary payment method for Uganda
2. **Offline Support** - Consider PWA for areas with poor connectivity
3. **SMS Notifications** - Many users prefer SMS over email
4. **Currency** - All prices in UGX (no multi-currency needed initially)
5. **Language** - English only (can add Luganda later)
6. **Performance** - Optimize for slower connections common in Uganda

---

## Related Documentation

| Document | Description |
|----------|-------------|
| [USER_MANAGEMENT.md](./USER_MANAGEMENT.md) | User roles, permissions, Firebase setup |
| PROJECT_SPECIFICATION.md | This document - full system specification |

---

## Next Steps

1. **Setup Phase**
   - [ ] Create new Next.js 14 project with MUI v7
   - [ ] Configure Firebase project
   - [ ] Set up authentication
   - [ ] Create base layout and theme

2. **Development Phase**
   - [ ] Follow development phases outlined above
   - [ ] Regular testing and feedback cycles

3. **Branding**
   - [ ] Client to provide: Logo, brand colors, fonts
   - [ ] Apply branding to theme configuration

---

*Document Version: 2.0*  
*Created: January 2026*  
*Last Updated: January 2026*  
*Status: Requirements Confirmed*
