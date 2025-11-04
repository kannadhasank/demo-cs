# CSDB Management - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to: `http://localhost:3000`

## 📋 Default Login

**For Development (Mock Authentication):**
- Email: `any@email.com` (or any email)
- Password: `password123` (or any password with 6+ characters)

## 🎨 Key Features to Explore

### Theme Switching
- Click the sun/moon icon in the header to toggle between light and dark themes
- Theme preference is saved automatically

### Language Selection
- Use the language dropdown in the header
- Switch between English, Spanish, and French

### Navigation
- **Dashboard:** Overview with stats and recent activity
- **Entities:** CAGE Management with data table
- **Data Module:** Access various data operations (expand submenu)
- **Settings:** Application configuration

## 📖 Storybook (Component Library)

View all reusable components:
```bash
npm run storybook
```
Opens at: `http://localhost:6006`

## 🔧 Project Structure

```
src/
├── common/          # Reusable components (Button, Input, etc.)
├── components/      # App-specific components (Header, Sidebar, Footer)
├── pages/           # Page components (Login, Dashboard, etc.)
├── store/           # Redux state management
├── services/        # API services with mock data
└── i18n/            # Internationalization files
```

## 🎯 Next Steps

1. **Explore the Code:**
   - Check `src/pages/` for page examples
   - Review `src/common/` for reusable components
   - Look at `src/store/slices/` for state management

2. **Customize:**
   - Edit `src/index.css` to change colors (CSS variables)
   - Update `src/i18n/locales/` for translations
   - Modify `src/services/` to integrate real APIs

3. **Add New Features:**
   - Create new pages in `src/pages/`
   - Add routes in `src/App.jsx`
   - Create reusable components in `src/common/`

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run storybook` | Start Storybook |
| `npm run lint` | Run ESLint |

## 📚 Documentation

- Full documentation: See `README.md`
- Component docs: Run Storybook
- API integration guide: See README.md → "API Integration" section

## 🐛 Common Issues

**Issue: Port 3000 already in use**
```bash
# Change port in vite.config.js or:
npm run dev -- --port 3001
```

**Issue: Dependencies not installed**
```bash
# Clear cache and reinstall:
rm -rf node_modules package-lock.json
npm install
```

**Issue: Theme not changing**
- Check browser console for errors
- Clear localStorage and refresh

## 💡 Tips

- Use Redux DevTools browser extension for state debugging
- Check browser console for any errors
- All data is currently mocked - replace services for production
- Components use functional components with React Hooks
- CSS uses CSS variables for easy theming

## 📞 Need Help?

- Read the full `README.md` for detailed documentation
- Check the code comments for inline documentation
- Review Storybook for component API documentation

## 🎉 You're Ready!

The application is fully functional with:
✅ Authentication flow  
✅ Protected routes  
✅ Theme switching  
✅ Multiple languages  
✅ State management  
✅ Reusable components  
✅ Mock API data  

Happy coding! 🚀
