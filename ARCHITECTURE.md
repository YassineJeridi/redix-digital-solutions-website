# Redix Digital Solutions — Architecture Guide

> Written for day-one onboarding. Read this before touching any code.

---

## 1 · Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| **Frontend** | React 18 + Vite 5 | SPA, CSS Modules, no SSR |
| **Backend** | Express 4 (ESM) | REST API on port 5000 |
| **Database** | MongoDB / Mongoose 7 | 14 document models |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | Two-tier stealth access system |
| **Styling** | CSS Modules + CSS custom properties | Dark/light theme via `data-theme` attribute |
| **i18n** | i18next (EN · FR · AR) | RTL support for Arabic |
| **Charts** | Recharts | Dashboard metrics |
| **Animations** | Framer Motion + AOS | Sidebar, page transitions, scroll effects |
| **Drag & Drop** | @dnd-kit | Kanban board |
| **Notifications** | Nodemailer + Telegram bot | Backend push notifications |
| **Reports** | PDFKit + json2csv | Exportable PDF & CSV from dashboard |
| **Scheduled Jobs** | node-cron | Daily midnight backup |

---

## 2 · Folder Structure

```
redix-digital-solutions-website/
├── ARCHITECTURE.md          ← you are here
│
├── backend/                 ← Express REST API
│   ├── server.js            ← entry point, route mounting, cron job
│   ├── config/
│   │   └── db.js            ← MongoDB connection (connectDB)
│   ├── middleware/
│   │   ├── auth.js          ← JWT verification middleware
│   │   └── errorHandler.js  ← centralised Express error handler
│   ├── models/              ← Mongoose schemas (14 models)
│   ├── controllers/         ← request handlers (16 controllers)
│   ├── routes/              ← Express Router definitions (16 files)
│   ├── scripts/             ← DB seed & maintenance utilities
│   │   ├── SeedAll.js       ← orchestrator — runs every individual seed
│   │   ├── Seed*.js         ← per-model seed scripts
│   │   ├── FixUsers.js      ← one-off user repair
│   │   ├── ResetPasswords.js
│   │   └── TestLogin.js     ← manual auth sanity check
│   └── utils/
│       ├── auditLogger.js   ← writes to AuditLog model
│       └── notificationService.js ← email + Telegram push
│
├── frontend/                ← React SPA (Vite)
│   ├── index.html           ← Vite HTML entry
│   ├── vite.config.js       ← dev server :3000, proxy /api → :5000
│   ├── public/              ← static assets (images, videos, icons)
│   └── src/
│       ├── main.jsx         ← ReactDOM entry, global CSS imports
│       ├── App.jsx          ← router + provider hierarchy
│       ├── App.css          ← global reset, typography, body styles
│       │
│       ├── styles/
│       │   └── theme.css    ← CSS design tokens (--bg, --text, --accent, etc.)
│       │
│       ├── context/
│       │   └── ThemeContext.jsx  ← dark/light toggle, persists to localStorage
│       │
│       ├── hooks/
│       │   └── useScrollLock.js ← body scroll lock (used by 12+ modals)
│       │
│       ├── shared/
│       │   ├── ProtectedAdminRoute.jsx ← auth guard for /dashboard/*
│       │   ├── StealthRoute.jsx        ← portal-access guard for /admin/login
│       │   └── configService.js        ← master access key config
│       │
│       └── modules/
│           ├── admin/       ← authenticated dashboard (see §3)
│           └── public/      ← public-facing website  (see §4)
```

---

## 3 · Admin Module (`modules/admin/`)

The admin dashboard lives behind two auth gates (see §7). All routes are prefixed `/dashboard`.

```
admin/
├── context/
│   ├── AuthContext.jsx      ← user state, login/logout, JWT persistence
│   └── AppContext.jsx       ← dashboard data, fetches stats on mount
│
├── services/                ← Axios API layer (one file per domain)
│   ├── api.js               ← shared Axios instance (baseURL, interceptors)
│   ├── AuthServices.js
│   ├── ClientsServices.js
│   ├── ProjectsServices.js
│   ├── ServicesServices.js  ← hits /api/services (alias for /api/projects)
│   ├── ExpensesServices.js
│   ├── DashboardServices.js
│   ├── ChargesServices.js
│   ├── MarketingServices.js
│   ├── FinancialServices.js
│   ├── ReportsServices.js
│   ├── SettingsServices.js
│   ├── TasksServices.js
│   ├── ToolsServices.js
│   ├── AuditServices.js
│   ├── BackupServices.js
│   └── NotificationServices.js
│
├── pages/                   ← route-level components (each with .module.css)
│   ├── Dashboard.jsx        ← overview cards, charts, recent activity
│   ├── Clients.jsx          ← CRUD client management
│   ├── Services.jsx         ← projects/services management
│   ├── KanbanBoard.jsx      ← drag-and-drop task board
│   ├── Tools.jsx            ← tool/subscription tracker
│   ├── Expenses.jsx         ← expense tracking
│   ├── TeamMembers.jsx      ← team roster
│   ├── Reports.jsx          ← PDF/CSV export
│   ├── Investing.jsx        ← financial analytics
│   ├── Marketing.jsx        ← marketing project tracker
│   ├── Settings.jsx         ← app settings
│   ├── Profile.jsx          ← user profile
│   ├── ActivityLog.jsx      ← audit trail viewer
│   ├── Backup.jsx           ← manual backup + restore
│   └── Login.jsx            ← stealth login form
│
└── components/              ← reusable UI pieces (each with .module.css)
    ├── Layout/              ← Layout, Navbar, Sidebar
    ├── Dashboard/           ← MetricCard, FinancialCard, RevenueChart, etc.
    ├── Clients/             ← ClientCard, ClientForm, ClientsList
    ├── Projects/            ← ProjectForm, ProjectsList, DeleteConfirmModal
    ├── Services/            ← ServiceForm, ServicesList, DeleteConfirmModal
    ├── Charges/             ← ChargeForm, ChargesManagement
    ├── Marketing/           ← MarketingProjectForm, MarketingProjectsList
    ├── Settings/            ← TeamMemberForm, TeamMembersList
    ├── Tasks/               ← KanbanColumn, TaskCard, TaskModal
    └── Tools/               ← ToolForm, ToolsList
```

### Data flow

```
User action → Page component → Service function (Axios)
                                    ↓
                              Express route → Controller → Mongoose model → MongoDB
                                    ↓
                              JSON response ← Controller
                                    ↓
                              Page updates state / re-renders
```

---

## 4 · Public Module (`modules/public/`)

The marketing website visible to everyone. All routes render inside `PublicLayout`.

```
public/
├── PublicLayout.jsx         ← <Outlet /> wrapper with Navbar, Footer, animations
├── i18n.js                  ← i18next initialisation (language detector, RTL)
│
├── locales/                 ← translation JSON (en, fr, ar)
├── data/                    ← static data arrays (clients, testimonials, etc.)
├── hooks/                   ← useParallax, useResponsive, usePerformanceOptimization
├── services/                ← apiService, emailService, telegramService
├── utils/                   ← animations, constants, helpers
│
├── styles/
│   ├── global.css           ← public-only global styles
│   ├── variables.css        ← public-only CSS variables
│   ├── landing.css          ← homepage-specific styles
│   ├── light-mode.css       ← public light-mode overrides
│   ├── public-app.css       ← public app shell styles
│   └── animations.css       ← keyframe animations
│
├── pages/
│   ├── Home.jsx             ← landing page
│   ├── Furniture.jsx        ← portfolio: furniture photography
│   ├── Travel.jsx           ← portfolio: travel content
│   ├── Fashion.jsx          ← portfolio: fashion content
│   ├── Chef.jsx             ← portfolio: chef/restaurant content
│   └── NotFound.jsx         ← 404 page (contains hidden stealth trigger)
│
└── components/              ← 20+ component directories
    ├── Navbar/              ├── Footer/
    ├── Banner/              ├── Services/
    ├── BookCall/            ├── BookingModal/
    ├── ChatPopup/           ├── SupportWidget/
    ├── DevProject/          ├── EventHighlights/
    ├── Testimonials/        ├── TrustedBy/
    ├── VideoShowcase/       ├── WhyChooseUs/
    ├── Portfolio/           ├── AnimatedBackground/
    ├── GlobalBackground/    ├── LoadingScreen/
    ├── LoadingSpinner/      └── UI/ (Button, Card, Modal)
```

---

## 5 · Backend API

### Route Map

All routes are mounted under `/api`. Most require JWT auth (via `middleware/auth.js`).

| Endpoint | Controller | Auth | Purpose |
|----------|-----------|------|---------|
| `/api/auth` | authController | No* | Register, login, profile |
| `/api/clients` | clientController | Yes | Client CRUD |
| `/api/projects` | projectsController | Yes | Project CRUD |
| `/api/services` | projectsController | Yes | Alias → same as projects |
| `/api/tools` | toolsController | Yes | Tool/subscription CRUD |
| `/api/settings` | settingsController | Yes | App settings, team members |
| `/api/dashboard` | dashboardController | Yes | Aggregated stats |
| `/api/expenses` | expensesController | Yes | Expense CRUD |
| `/api/reports` | reportsController | Yes | PDF/CSV generation |
| `/api/notifications` | notificationController | Yes | Read/dismiss notifications |
| `/api/audit` | auditController | Yes | Activity log queries |
| `/api/financial` | financialController | Yes | Financial metrics |
| `/api/marketing` | marketingController | Yes | Marketing project CRUD |
| `/api/charges` | chargesController | Yes | Charge/invoice CRUD |
| `/api/tasks` | taskController | Yes | Kanban tasks + board lists |
| `/api/backup` | backupController | Yes | Manual backup/restore |
| `/api/config` | configController | No | Global config (access-key validation) |

### Mongoose Models (14)

`AuditLog` · `BoardList` · `Charge` · `Client` · `Expense` · `FinancialMetrics` · `GlobalConfig` · `MarketingProject` · `Notification` · `Project` · `Task` · `TeamMember` · `Tool` · `User`

---

## 6 · Theme System

Two themes: **dark** (default) and **light**.

| File | Role |
|------|------|
| `styles/theme.css` | Defines all CSS custom properties under `[data-theme="dark"]` and `[data-theme="light"]` |
| `context/ThemeContext.jsx` | Toggles `data-theme` on `<html>`, persists to `localStorage('redix-theme')`, defaults to system preference |

### Usage in components

```css
/* Component.module.css */
.card {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
```

```jsx
// Any component
import { useTheme } from '../../../context/ThemeContext';
const { isDark, toggleTheme } = useTheme();
```

**Key tokens:** `--bg`, `--bg-secondary`, `--bg-tertiary`, `--text-primary`, `--text-secondary`, `--border`, `--accent`, `--accent-hover`, `--success`, `--danger`, `--warning`, `--info`

---

## 7 · Authentication & Stealth Access

The admin dashboard is completely hidden from casual visitors. There is no visible login link anywhere on the public site.

### Two-Tier Gate

```
                        ┌─────────────────────┐
  User visits /xyz      │                     │
  (any unknown route)   │    NotFound.jsx      │
  ────────────────────► │    (404 page)        │
                        │                     │
                        │  Hidden input field  │
                        │  accepts ACCESS KEY  │
                        └────────┬────────────┘
                                 │ correct key
                                 ▼
                        ┌─────────────────────┐
                        │  sessionStorage:     │
                        │  canAccessPortal=true│
                        │  portalAccessToken   │
                        │  (short-lived JWT)   │
                        └────────┬────────────┘
                                 │
                                 ▼
                        ┌─────────────────────┐
                        │  StealthRoute.jsx    │
                        │  validates portal JWT│
                        └────────┬────────────┘
                                 │ valid
                                 ▼
                        ┌─────────────────────┐
                        │  Login.jsx           │
                        │  username + password │
                        └────────┬────────────┘
                                 │ authenticated
                                 ▼
                        ┌─────────────────────┐
                        │ ProtectedAdminRoute  │
                        │ checks both:         │
                        │  1. portal access    │
                        │  2. auth token       │
                        └────────┬────────────┘
                                 │ both valid
                                 ▼
                        ┌─────────────────────┐
                        │   /dashboard/*       │
                        │   Admin Dashboard    │
                        └─────────────────────┘
```

---

## 8 · Conventions

### File Naming

| What | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `ClientCard.jsx` |
| CSS Modules | PascalCase matching component | `ClientCard.module.css` |
| Services | PascalCase domain + "Services" | `ClientsServices.js` |
| Backend controllers | camelCase + "Controller" | `clientController.js` |
| Backend routes | lowercase plural | `clients.js` |
| Mongoose models | PascalCase singular | `Client.js` |
| Seed scripts | "Seed" + PascalCase | `SeedClient.js` |

### Import Patterns

```jsx
// Admin components import services from their own module:
import { getClients } from '../../services/ClientsServices';

// Both modules import shared utilities from src/:
import { useTheme } from '../../../context/ThemeContext';
import useScrollLock from '../../../hooks/useScrollLock';
```

### State Management

- **No Redux.** All state is React Context:
  - `ThemeContext` — global (shared between modules)
  - `AuthContext` — admin-only (user session)
  - `AppContext` — admin-only (dashboard data)
- Local state with `useState` / `useReducer` in page components.

### CSS Architecture

- **CSS Modules** for component-scoped styles (`.module.css`)
- **CSS custom properties** from `theme.css` for all colors — never hardcode hex/rgba
- **No inline `style={{}}` color values** — use `var(--token)` instead
- Global styles only in `App.css` and `modules/public/styles/`

---

## 9 · Development

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Copy `backend/.env.example` → `backend/.env` and fill in values

### Start

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev          # nodemon on port 5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev          # Vite on port 3000, proxies /api → 5000
```

### Seed Database

```bash
cd backend
node scripts/SeedAll.js    # runs all seed scripts in dependency order
```

### Build for Production

```bash
cd frontend
npm run build        # outputs to frontend/dist/
```

---

## 10 · Key Design Decisions

1. **Module separation** — `modules/admin/` and `modules/public/` are completely independent. They share only `ThemeContext`, `useScrollLock`, and route guards from `src/shared/`.

2. **Stealth auth** — The admin panel has no visible entry point. Access requires knowing a secret key entered on the 404 page. This is a deliberate security-by-obscurity layer on top of standard JWT auth.

3. **Services = Projects alias** — The `/api/services` endpoint is an alias for `/api/projects`. The frontend has both `ProjectsServices.js` and `ServicesServices.js` but they hit the same controller. This dates from a rename of "Projects" to "Services" in the UI.

4. **CSS Modules over CSS-in-JS** — Chosen for zero runtime cost, good IDE support, and natural dark/light theming via CSS custom properties.

5. **No global state library** — The app is small enough that React Context handles all shared state. Each context has a focused responsibility.

6. **Daily automatic backups** — A `node-cron` job at midnight calls `performBackup()`, creating a JSON dump of all collections. Manual backup/restore is also available from the dashboard.
