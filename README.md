# 🛒 Inventory & Order Management System (IOMS) - Frontend

An enterprise-grade, high-performance, full-stack eCommerce and inventory management web application built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed with complete role-based dashboards for **Admin**, **Manager**, and **Customer**, featuring seamless **Google OAuth 2.0**, **bKash Sandbox Payment Gateway**, and **100% mobile-responsive** user interfaces.

---

## 🌐 Live URLs & Repositories

* 🚀 **Live Frontend:** [https://inventory-order-management-system-f-xi.vercel.app](https://inventory-order-management-system-f-xi.vercel.app)
* 📡 **Live Backend API:** [https://inventory-order-management-system-b-zeta.vercel.app](https://inventory-order-management-system-b-zeta.vercel.app)
* 📦 **Frontend Repository:** [GitHub Repository](https://github.com/Rupokhossain/inventory-order-management-system-frontend)
* ⚙️ **Backend Repository:** [GitHub Repository](https://github.com/Rupokhossain/Inventory-Order-Management-System-IOMS--Backend)

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Admin** | `rh.siam999@gmail.com` | `*******` | Full system governance, User Roles/Status, Analytics, Inventory, Reports |
| **Manager** | `manager@ioms.com` | `*******` | Product CRUD, Stock adjustments, Order fulfillment & status updates |
| **Customer** | `siam121483@gmail.com` | `*******` | Product browsing, Cart, Checkout, bKash Payment, Order tracking |

*(Note: You can also use one-click **Google Sign-In** on the login or register page to explore as a Customer).*

---

## ✨ Key Features

### 🌟 1. Public & Customer Experience
* **Hero & Discovery:** Interactive banner carousel, category showcase, featured items, and modern sticky navigation bar.
* **Smart Catalog:** Real-time search, multi-category filtering, price sorting (low-to-high, high-to-low), and paginated product feeds.
* **Product Details:** High-resolution product image gallery, stock availability badges, dynamic quantity counters, and instant add-to-cart.
* **Shopping Cart & Checkout:** Persistent cart state, item removal, quantity adjustment, subtotal calculations, and streamlined checkout with delivery details.
* **bKash Payment Gateway:** Integrated bKash Sandbox payment initiation and tokenized callback handling for instant order confirmation.
* **Customer Dashboard (`/dashboard`):**
  * Order history with responsive status filter tabs (All, Pending, Confirmed, Processing, Shipped, Delivered, Cancelled).
  * Order cancellation with automatic inventory stock replenishment.
  * Payment ledger tracking transaction IDs and statuses.
  * Profile management with Cloudinary photo uploads and password security.

### 🔐 2. Authentication & Security
* **JWT & Cookie-Based Security:** Secure authentication token persistence with automatic session handling.
* **Google Identity Services (GIS):** Seamless Google OAuth 2.0 Sign-In and Sign-Up.
* **Email Verification:** OTP-based verification workflow for verified email registrations.
* **Forgot & Reset Password:** Secure OTP-based credential recovery.
* **Role-Based Routing (RBAC):** Middleware-protected route barriers preventing unauthorized role escalation.

### 👔 3. Manager Operations Portal (`/manager`)
* **Product Management:** Complete CRUD interface to create, edit, and delete catalog products with direct Cloudinary media uploads.
* **Stock & Inventory Control:** Fast stock count adjustments to prevent stockouts.
* **Order Dispatch & Fulfillment:** Dedicated order management queue to transition orders across fulfillment stages.
* **Customer Inquiries:** Inquiry review and response interface.

### 👑 4. Admin Governance Hub (`/admin`)
* **User Management:** Full user registry with instant role reassignment (`ADMIN`, `MANAGER`, `CUSTOMER`) and account status toggling (`ACTIVE`, `BLOCKED`).
* **Inventory Master View:** Centralized visibility over system-wide inventory levels.
* **Order Central:** Holistic cross-system order audit with comprehensive filtering.
* **Business Reports & Analytics:** Governance metrics, sales breakdowns, and exportable financial summaries.

### 📱 5. Modern UI/UX & Responsive Engineering
* **100% Mobile-First Architecture:** Responsive 3-column mobile filter grids, collapsible dispatch cards, and sticky app bars ensure frictionless usability on all screen sizes.
* **Zero Layout Shifts:** Fast static generation combined with Turbopack for lightning-fast page transitions.
* **Dark / Light Theme Consistency:** Accessible contrast compliant with modern web standards.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **HTTP Client** | [ofetch](https://github.com/unjs/ofetch) |
| **State & Notifications** | React Hooks, Sonner / Toast |
| **Authentication** | Google Identity Services (GIS), JWT |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```text
inventory-order-management-system-frontend/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # /login, /register, /verify-email, /forgot-password
│   │   ├── (dashboard)/    # Role-based dashboards: /admin, /manager, /dashboard
│   │   ├── (public)/       # Landing page, /products, /about, /cart, /checkout
│   │   ├── payment/        # /payment/success, /payment/cancel
│   │   ├── globals.css     # Tailwind CSS styles
│   │   └── layout.tsx      # Root application layout
│   ├── components/         # Modular UI components
│   │   ├── auth/           # GoogleAuthButton, LoginForm, RegisterForm
│   │   ├── common/         # Navbar, Footer, StickyHeader, Modals
│   │   ├── dashboard/      # Sidebar, StatusFilterGrid, MetricCards, OrderTable
│   │   ├── product/        # ProductCard, ProductGrid, FilterSidebar
│   │   └── ui/             # Buttons, Inputs, Dialogs, Badges
│   ├── lib/                # Utilities & API client
│   │   └── api-client.ts   # Sanitized API configuration & interceptors
│   ├── services/           # Service layer API calls
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   └── user.service.ts
│   └── types/              # TypeScript definitions & interfaces
├── .env.local              # Local environment configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript configuration
