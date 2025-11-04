# CSDB Management Application

A modern, full-featured React application for managing Commercial and Government Entity (CAGE) data with JWT authentication, state management, theming, and internationalization.

## Features

✅ **React 18** with Vite for fast development  
✅ **JWT Authentication** with protected routes  
✅ **Redux Toolkit** for state management  
✅ **React Router v6** for routing  
✅ **Dark/Light Theme** with CSS variables  
✅ **Internationalization (i18n)** - English, Spanish, French  
✅ **Responsive Design** with mobile support  
✅ **Storybook** for component development  
✅ **Common Library** with reusable components  
✅ **Mock API** with JSON data (ready for backend integration)  
✅ **Functional Components** with React Hooks  

## Project Structure

```
csdb-management-app/
├── .storybook/              # Storybook configuration
├── public/                  # Static assets
├── src/
│   ├── common/             # Reusable component library
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── Button.stories.jsx
│   │   ├── Input/
│   │   │   ├── Input.jsx
│   │   │   ├── Input.css
│   │   │   └── Input.stories.jsx
│   │   └── index.js
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   ├── Layout.jsx
│   │   │   └── Layout.css
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   └── CAGEManagement/
│   │       ├── CAGEManagement.jsx
│   │       └── CAGEManagement.css
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── themeSlice.js
│   │   │   ├── sidebarSlice.js
│   │   │   └── cageSlice.js
│   │   └── index.js
│   ├── services/
│   │   ├── authService.js
│   │   └── cageService.js
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en/translation.json
│   │   │   ├── es/translation.json
│   │   │   └── fr/translation.json
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd csdb-management-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run storybook    # Start Storybook
npm run build-storybook  # Build Storybook
```

## Login Credentials (Mock)

For development, use any email and password combination:
- **Email:** any@email.com
- **Password:** any password (min 6 characters)

## Features Overview

### 1. Authentication

- JWT-based authentication
- Protected routes
- Automatic token validation
- Login/Logout functionality
- Mock authentication service (ready for API integration)

### 2. State Management

Redux Toolkit slices:
- **authSlice:** User authentication state
- **themeSlice:** Theme management (light/dark)
- **sidebarSlice:** Sidebar state and menu expansion
- **cageSlice:** CAGE data management

### 3. Theming

- Light and Dark themes
- CSS variables for easy customization
- Theme toggle in header
- Persistent theme preference

CSS Variables (customize in `src/index.css`):
```css
:root {
  --primary-color: #2196f3;
  --bg-primary: #ffffff;
  --text-primary: #1d1d1f;
  /* ... more variables */
}

[data-theme='dark'] {
  --bg-primary: #1e1e2e;
  --text-primary: #e0e0e6;
  /* ... dark theme overrides */
}
```

### 4. Internationalization

Supported languages:
- English (en)
- Spanish (es)
- French (fr)

Add translations in `src/i18n/locales/{lang}/translation.json`

Usage in components:
```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('navigation.dashboard')}</h1>;
};
```

### 5. Common Component Library

Reusable components with Storybook documentation:

**Button Component:**
```jsx
import { Button } from '@common';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click Me
</Button>
```

**Input Component:**
```jsx
import { Input } from '@common';

<Input
  label="Email"
  name="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
/>
```

View all components in Storybook:
```bash
npm run storybook
```

### 6. Routing Structure

```
/                     → Redirect to /dashboard
/login                → Login page
/dashboard            → Dashboard
/entities             → CAGE Management
/projects             → Projects (placeholder)
/data-module/         → Data Module pages
  ├── manage          → Manage Modules
  ├── validate        → Data Validate
  ├── search          → Search
  ├── publishing      → Publishing
  ├── import          → Import
  └── export          → Export
/common-info          → Common Information Repository
/users                → Users Management
/settings             → Settings
```

## API Integration

### Current State (Mock Data)

All services use mock JSON data for development. Mock data is defined in:
- `src/services/authService.js`
- `src/services/cageService.js`

### Integrating Real API

1. **Update service files** to make actual API calls:

```javascript
// Before (Mock)
const getCages = async (params) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CAGES), 500);
  });
};

// After (Real API)
const getCages = async (params) => {
  const response = await axios.get('/api/cages', { params });
  return response.data;
};
```

2. **Configure API base URL** in an environment file:

```javascript
// .env
VITE_API_BASE_URL=https://api.example.com

// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## Customization

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Layout/Sidebar.jsx`
4. Add translations in i18n files

### Adding Common Components

1. Create component in `src/common/ComponentName/`
2. Export in `src/common/index.js`
3. Create Storybook story (*.stories.jsx)
4. Document props with PropTypes

### Customizing Theme

Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #your-color;
  --bg-primary: #your-background;
  /* ... */
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting with React Router
- Lazy loading for routes
- Redux Toolkit for efficient state updates
- CSS variables for theme switching (no JS required)
- Vite for fast builds

## Development Tips

1. **Hot Module Replacement (HMR)** is enabled by default
2. Use Redux DevTools for debugging state
3. Check Storybook for component documentation
4. Follow the existing folder structure for consistency
5. Use functional components with hooks
6. Add translations for all user-facing text

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Environment Variables

Create `.env.production`:
```
VITE_API_BASE_URL=https://production-api.example.com
```

## Troubleshooting

**Issue:** Theme doesn't persist after refresh  
**Solution:** Check browser localStorage is enabled

**Issue:** Translations not loading  
**Solution:** Ensure i18n is initialized before App component

**Issue:** Components not found  
**Solution:** Check path aliases in vite.config.js

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Add Storybook stories for new components
4. Update translations for new text
5. Test in both light and dark themes

## License

Copyright © 2025 by CSDB. All rights reserved.

## Support

For questions or issues, please contact the development team.
