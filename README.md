# 🩸 LifeStream | Modern Blood Donation Platform
---

## 🎯 Project Objective & Purpose

**LifeStream** is a responsive, secure MERN-stack web application designed to optimize and bridge the gap between voluntary blood donors, volunteers, and recipients in need of blood. The application automates donor discovery, request fulfillment tracks, real-time matching metrics, and organizational funding.

This project focuses heavily on **Role-Based Access Control (RBAC)**, visually balanced data dashboards, precise geographical tracking based on Bangladesh's geocode administrative tiers, and absolute security for private routing and backend REST API endpoints.

---

## 🚀 Key Features

### 👤 User Authentication & Verification (Public)
- **Multi-Step Registration:** Built-in validation schema capturing structural profiles including blood group selection and dynamic location mappings (District & Upazila).
- **Avatar Integration:** Seamless automated image storage handling via external ImgBB API uploads.
- **Secure Authentication:** Implements credentials login safely mapped with structural application-wide context states. Social Logins are strictly omitted per testing constraints.

### 🔒 Dashboard Workspace (Private & Role-Based Layouts)
All dashboards utilize a structural, fully responsive **Sidebar Layout** dynamically generated according to user hierarchy permissions:

#### 1. Donor Dashboard
- **Welcome Metric View:** Houses an interactive display alongside up to 3 recent user-specific donation requests tracked via tabular states.
- **Request Cycle Management:** Full CRUD operations allowing active donors to create, view, edit, or delete blood requests. Includes full state updates (`pending` ➔ `inprogress` ➔ `done`/`canceled`).
- **Dynamic Access Restrictions:** Implements auto-blocking states where `blocked` accounts are strictly barred from publishing incoming requests.

#### 2. Volunteer Dashboard
- **Overview Stat Cards:** Displays full application counts tracking Total Donors, Funding Pools, and Total Application Requests.
- **Moderation Privileges:** Full access to read all platform blood requests with integrated filter tags, bounded with custom validation restricting actions strictly to **Donation Status Updates Only**.

#### 3. Admin Dashboard
- **Full Control Panel:** Inherits all metrics from Volunteers while unlocking administrative overrides.
- **User Management Matrix:** Features advanced controls to block/unblock accounts and elevate user profiles dynamically using explicit `Volunteer` or `Admin` role privileges.

### 🌐 Public Discovery Systems
- **Conditional Search Engine:** Advanced search engine scanning specific combinations of Blood Groups, Districts, and Upazilas without rendering mock tables on initial view.
- **Pending Feed Requests:** Public landing routes displaying absolute active `pending` requests directly guiding visitors to secure detail modals upon authentication.
- **Stripe Integrated Funding:** Implements production-ready secure payment handling tracking micro-donations via explicit transaction workflows.

---

## 🛠️ Used npm Packages (Dependencies)

### Client Side (`/client`)
- `react` & `react-dom` - Core UI rendering engine.
- `react-router-dom` - Client-side path management and route shield mechanics.
- `@stripe/stripe-js` & `@stripe/react-stripe-js` - Secure payment gateway framework.
- `axios` - Promise-based asynchronous HTTP client for protected API invocation.
- `lucide-react` / `react-icons` - Standard visual branding icon packs.
- `tanstack/react-query` - Asynchronous server cache synchronization.
- `react-hook-form` - Optimized form management state engine.
- `sweetalert2` / `react-hot-toast` - Elegant alert notifications and tracking interactions.
- `recharts` - Statistical charts and quick dashboard data visualization.
- `framer-motion` / `aos` - Fluid entry animations.

### Server Side (`/server`)
- `express` - Minimalist web framework for Node.js routing.
- `mongodb` - Native driver interface engine.
- `jsonwebtoken` (JWT) - Authorization access keys and token token validation layers.
- `dotenv` - Runtime environment variables shielding configuration metadata.
- `cors` - Middlewares regulating cross-origin protocol access mechanisms.

---
