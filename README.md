# 🛒 Inventory & Order Management System (IOMS) - Frontend Documentation

Developer: Siam Ahmed
Live Frontend: https://inventory-order-management-system-f-xi.vercel.app

Live Backend API: https://inventory-order-management-system-b-zeta.vercel.app

Frontend GitHub: https://github.com/Rupokhossain/inventory-order-management-system-frontend

Backend GitHub: https://github.com/Rupokhossain/Inventory-Order-Management-System-IOMS--Backend

1. Executive Summary

The Inventory & Order Management System (IOMS) is an enterprise-grade full-stack eCommerce and inventory governance platform engineered with Next.js 16 (Turbopack, App Router), TypeScript, and Tailwind CSS. It provides a frictionless experience for three distinct actor roles:

Customers: Product catalog exploration, instant search, dynamic cart, secure bKash Sandbox Payment Gateway, and order tracking.
Managers: Complete product catalog management (CRUD), real-time inventory adjustments, and order dispatch lifecycle operations.
Admins: Global governance, user role modification, user status toggling (Active/Blocked), and financial/sales analytics reports.
2. Demo Credentials
Role	Email	Password	Access Scope
Admin	rh.siam999@gmail.com	siam11**##@@!!11A	System oversight, User governance, Reports, Inventory
Manager	rh.siam999@gmail.com (or role switch)	siam11**##@@!!11A	Product catalog CRUD, Stock changes, Order fulfillment
Customer	siam121483@gmail.com	siam11**##@@AA	Catalog browsing, Cart, Checkout, bKash Payment, Orders

(Note: Users can also authenticate instantly via Google OAuth 2.0).

3. Technology Architecture
Tier	Technologies	Highlights
Framework	Next.js 16 (App Router)	Turbopack compilation, React Server & Client Components
Language	TypeScript	Strict type safety, interfaces for products, orders, and users
Styling	Tailwind CSS v4, PostCSS	Mobile-first utility design, responsive grids, zero layout shift
Icons & UI	Lucide React	High-performance, accessible iconography
HTTP Client	ofetch	Configured with automatic baseURL normalization & interceptors
Payment	bKash Sandbox Gateway	Tokenized checkout, grant token generation, and payment callback
Authentication	Google Identity Services (GIS), JWT	Cookie-persisted sessions with role-based routing protection
Hosting	Vercel	Production CDN deployment with continuous integration
4. Key Modules & Functional Workflows
4.1 Public & Shopping Experience
Landing Page & Sticky Navigation: Features dynamic carousels, category badges, high-demand products, and sticky navigation header.
Search & Multi-Facet Filtering: Instant keyword query, category filtering, and bidirectional price sorting (price_asc, price_desc).
Product Detail Pages: Gallery view, live inventory badges, quantity selector, and cart validation.
Cart & Checkout Management: Real-time quantity recalculation, persistent cart, delivery information form, and subtotal breakdown.
4.2 bKash Payment Integration
Order placement transitions order to PENDING.
System requests payment initiation via the tokenized bKash Sandbox gateway.
Customer completes OTP and PIN simulation in the secure bKash popup/redirect.
Payment execution validates transaction, marks payment PAID, updates order to CONFIRMED, and deducts product stock.
4.3 Customer Dashboard (/dashboard)
Responsive 3-column status filter grid (All, Pending, Confirmed, Processing, Shipped, Delivered, Cancelled).
View itemized receipt and tracking milestones.
Customer order cancellation with automatic stock replenishment.
User profile photo update via Cloudinary.
4.4 Manager Operations Portal (/manager)
Product CRUD: Multi-field product creation with Cloudinary image upload, editing, and deletion.
Inventory Control: Fast inventory stock increment/decrement.
Order Fulfillment Pipeline: Transition order states (Pending 
→
→ Confirmed 
→
→ Processing 
→
→ Shipped 
→
→ Delivered).
4.5 Admin Governance Hub (/admin)
User Management: Full user roster with instantaneous role changes (ADMIN, MANAGER, CUSTOMER) and access status (ACTIVE, BLOCKED).
Inventory Oversight: System-wide stock health audit.
Reports & Analytics: Financial breakdown, revenue velocity, and visual metrics.
5. End-to-End User Journey
text
[Customer Browses Catalog] 
       │
       ▼
[Adds Items to Cart & Checkouts] 
       │
       ▼
[Completes bKash Payment (Sandbox)] 
       │
       ▼
[Order CONFIRMED & Stock Auto-Deducted] 
       │
       ▼
[Manager Dispatches Order (Processing -> Shipped)] 
       │
       ▼
[Admin Audits Transactions & User Governance]
6. Project Structure
text
inventory-order-management-system-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/         # /login, /register, /verify-email, /forgot-password
│   │   ├── (dashboard)/    # Role-based dashboards: /admin, /manager, /dashboard
│   │   ├── (public)/       # Landing page, /products, /cart, /checkout
│   │   ├── payment/        # /payment/success, /payment/cancel
│   │   └── layout.tsx      # Root HTML layout with providers
│   ├── components/         # Reusable UI & business components
│   ├── lib/                # api-client.ts (Sanitized API caller)
│   ├── services/           # auth.service, product.service, order.service
│   └── types/              # TypeScript schemas & contracts
├── .env.local              # Local environment configuration
└── package.json            # Node.js project manifest
7. Local Setup & Environment
Environment Configuration (.env.local):
env
NEXT_PUBLIC_API_BASE_URL=https://inventory-order-management-system-b-zeta.vercel.app/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=555138210218-tv2v3d7dbtithgtp48r2mh8s4hak11bo.apps.googleusercontent.com
Run Instructions:
bash
# 1. Install dependencies
npm install
# 2. Run local development server
npm run dev
# 3. Compile production build
npm run build
8. Verification & Test Checklist
 Responsive layout verified across mobile, tablet, and desktop viewports.
 Google OAuth 2.0 login and registration tested.
 Product search, category selection, and price sorting functional.
 bKash Sandbox payment initiation, callback, and execution verified.
 Role-based routing verified (unauthenticated users redirected to /login).
 Production build passes with 0 TypeScript/ESLint errors on Next.js 16.
