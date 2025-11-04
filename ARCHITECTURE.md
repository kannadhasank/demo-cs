# Component Architecture

## Application Structure

```
App (Router)
│
├── Public Routes
│   └── Login Page
│       ├── Hero Section (Left)
│       └── Login Form (Right)
│           ├── Logo
│           ├── Input (Email)
│           ├── Input (Password)
│           └── Button (Submit)
│
└── Protected Routes
    └── Layout
        ├── Header
        │   ├── Menu Toggle Button
        │   ├── Logo
        │   ├── Language Selector
        │   ├── Theme Toggle Button
        │   ├── Notification Icon
        │   ├── Help Icon
        │   ├── Settings Icon
        │   └── User Menu Dropdown
        │       └── Logout Button
        │
        ├── Sidebar
        │   ├── Dashboard Link
        │   ├── Projects Link
        │   ├── Data Module (Expandable)
        │   │   ├── Manage Modules
        │   │   ├── Data Validate
        │   │   ├── Search
        │   │   ├── Publishing
        │   │   ├── Import
        │   │   └── Export
        │   ├── Entities Link
        │   ├── Common Info Repository Link
        │   ├── Users Management Link
        │   └── Settings Link
        │
        ├── Main Content (Outlet)
        │   │
        │   ├── Dashboard Page
        │   │   ├── Page Header
        │   │   ├── Stats Grid
        │   │   │   ├── Stat Card (Projects)
        │   │   │   ├── Stat Card (Modules)
        │   │   │   ├── Stat Card (Users)
        │   │   │   └── Stat Card (Publications)
        │   │   └── Dashboard Grid
        │   │       ├── Recent Projects Card
        │   │       │   └── Project List
        │   │       └── Recent Activity Card
        │   │           └── Activity List
        │   │
        │   └── CAGE Management Page
        │       ├── Page Header
        │       ├── Controls Bar
        │       │   ├── Search Box
        │       │   └── Action Buttons
        │       │       ├── Filter Button
        │       │       ├── Add Button
        │       │       ├── Upload Button
        │       │       ├── Download Button
        │       │       └── Menu Button
        │       ├── Data Table
        │       │   ├── Table Header
        │       │   │   ├── Checkbox (Select All)
        │       │   │   └── Column Headers
        │       │   └── Table Body
        │       │       └── Table Rows
        │       │           ├── Checkbox
        │       │           ├── Data Cells
        │       │           └── Actions Menu
        │       └── Pagination
        │           ├── Per Page Selector
        │           ├── Page Info
        │           └── Navigation Buttons
        │
        └── Footer
            └── Copyright Text
```

## State Management Architecture

```
Redux Store
│
├── authSlice
│   ├── State: user, token, isAuthenticated, isLoading, isError, message
│   └── Actions: login, logout, register, setCredentials, clearCredentials
│
├── themeSlice
│   ├── State: theme (light/dark)
│   └── Actions: toggleTheme, setTheme
│
├── sidebarSlice
│   ├── State: isOpen, expandedMenus
│   └── Actions: toggleSidebar, setSidebarOpen, toggleMenu, setExpandedMenus
│
└── cageSlice
    ├── State: cages, currentCage, isLoading, pagination
    └── Actions: getCages, getCage, createCage, updateCage, deleteCage
```

## Service Layer Architecture

```
Services
│
├── authService
│   ├── login(userData)
│   ├── register(userData)
│   ├── logout()
│   ├── getCurrentUser()
│   └── verifyToken(token)
│
└── cageService
    ├── getCages(params)
    ├── getCage(id)
    ├── createCage(data)
    ├── updateCage(id, data)
    └── deleteCage(id)
```

## Common Component Library

```
Common Components
│
├── Button
│   ├── Props: children, variant, size, disabled, fullWidth, onClick, type
│   ├── Variants: primary, secondary, success, danger, warning, outline
│   └── Sizes: small, medium, large
│
└── Input
    ├── Props: label, type, name, value, onChange, placeholder, error, disabled, required
    └── Types: text, email, password, number, tel, url
```

## Routing Architecture

```
Routes
│
├── / (root)
│   └── Redirect to /dashboard
│
├── /login
│   └── Login Page (public)
│
└── Protected Routes (requires authentication)
    ├── /dashboard
    │   └── Dashboard Page
    │
    ├── /entities
    │   └── CAGE Management Page
    │
    ├── /projects
    │   └── Projects Page (placeholder)
    │
    ├── /data-module
    │   ├── /manage → Manage Modules (placeholder)
    │   ├── /validate → Data Validate (placeholder)
    │   ├── /search → Search (placeholder)
    │   ├── /publishing → Publishing (placeholder)
    │   ├── /import → Import (placeholder)
    │   └── /export → Export (placeholder)
    │
    ├── /common-info
    │   └── Common Info Repository (placeholder)
    │
    ├── /users
    │   └── Users Management (placeholder)
    │
    └── /settings
        └── Settings (placeholder)
```

## Data Flow

```
User Action
    ↓
Component Handler
    ↓
Redux Action Dispatch
    ↓
Redux Thunk (if async)
    ↓
Service Layer (API call)
    ↓
Mock Data / Real API
    ↓
Response Processing
    ↓
Redux Store Update
    ↓
Component Re-render
    ↓
UI Update
```

## Theme System Flow

```
User Clicks Theme Toggle
    ↓
dispatch(toggleTheme())
    ↓
themeSlice updates state
    ↓
localStorage.setItem('theme', newTheme)
    ↓
document.documentElement.setAttribute('data-theme', newTheme)
    ↓
CSS Variables Change
    ↓
All Components Re-style
```

## Authentication Flow

```
User Enters Credentials
    ↓
Form Validation
    ↓
dispatch(login(credentials))
    ↓
authService.login()
    ↓
Mock Authentication / API Call
    ↓
Receive Token & User Data
    ↓
localStorage.setItem('token', token)
    ↓
Redux Store Updated
    ↓
Navigate to Dashboard
    ↓
Protected Routes Accessible
```

## Internationalization Flow

```
User Selects Language
    ↓
i18n.changeLanguage(lang)
    ↓
localStorage.setItem('i18nextLng', lang)
    ↓
Load Translation File
    ↓
Re-render All Components
    ↓
Updated Text Display
```

## Component Reusability

### Common Components (Highly Reusable)
- Button - Used in: Login, Dashboard, CAGE Management, Header
- Input - Used in: Login, Forms, Search

### Layout Components (Shared)
- Header - Used in: All protected pages
- Sidebar - Used in: All protected pages
- Footer - Used in: All protected pages
- Layout - Wrapper for all protected pages

### Page Components (Specific)
- Login - Standalone public page
- Dashboard - Protected page
- CAGE Management - Protected page

## File Naming Conventions

```
Components:
- PascalCase for component files: Button.jsx, Header.jsx
- PascalCase for CSS files: Button.css, Header.css
- PascalCase for story files: Button.stories.jsx

Services:
- camelCase with Service suffix: authService.js, cageService.js

Slices:
- camelCase with Slice suffix: authSlice.js, themeSlice.js

Pages:
- PascalCase: Login.jsx, Dashboard.jsx

Utilities:
- camelCase: api.js, helpers.js
```

## Styling Strategy

```
Global Styles (index.css)
├── CSS Variables (theme colors, spacing, etc.)
├── Reset & Base Styles
├── Utility Classes
└── Scrollbar Styles

Component Styles (Component.css)
├── Component-specific styles
├── Use CSS variables for colors
├── Responsive media queries
└── Theme-aware (no hardcoded colors)
```

## Best Practices Applied

1. **Component Composition**
   - Small, focused components
   - Props for customization
   - Reusable across application

2. **State Management**
   - Redux for global state
   - Local state for component-specific data
   - Async actions with Redux Thunk

3. **Styling**
   - CSS variables for theming
   - Component-scoped CSS files
   - Consistent naming conventions

4. **Code Organization**
   - Feature-based folder structure
   - Clear separation of concerns
   - Modular and maintainable

5. **Type Safety**
   - PropTypes for all components
   - Type validation
   - Better developer experience

This architecture provides:
- ✅ Scalability
- ✅ Maintainability
- ✅ Reusability
- ✅ Clear data flow
- ✅ Easy testing
- ✅ Good developer experience
