import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout } from '@store/slices/authSlice';
import { toggleTheme } from '@store/slices/themeSlice';
import { toggleSidebar } from '@store/slices/sidebarSlice';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={handleSidebarToggle}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="logo-text">{t('app.title')}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="language-selector">
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <button className="icon-button" onClick={handleThemeToggle} title={t('theme.toggle')}>
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="5" strokeWidth="2" />
              <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
              <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" />
              <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" />
              <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" />
            </svg>
          )}
        </button>

        <button className="icon-button" title="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <button className="icon-button" title="Help">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <button className="icon-button" title="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path
              d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"
              strokeWidth="2"
            />
          </svg>
        </button>

        <div className="user-menu">
          <button className="user-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
              <circle cx="12" cy="7" r="4" strokeWidth="2" />
            </svg>
            <span className="user-name">{user?.name}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="dropdown-icon"
            >
              <polyline points="6 9 12 15 18 9" strokeWidth="2" />
            </svg>
          </button>
          <div className="user-dropdown">
            <button className="dropdown-item" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <polyline points="16 17 21 12 16 7" strokeWidth="2" strokeLinecap="round" />
                <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
