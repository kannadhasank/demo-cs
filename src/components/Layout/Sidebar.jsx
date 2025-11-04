import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toggleMenu } from '@store/slices/sidebarSlice';
import './Sidebar.css';

const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isOpen, expandedMenus } = useSelector((state) => state.sidebar);

  const handleMenuToggle = (menuId) => {
    dispatch(toggleMenu(menuId));
  };

  const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);

  const menuItems = [
    {
      id: 'dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
        </svg>
      ),
      label: t('navigation.dashboard'),
      path: '/dashboard',
    },
    {
      id: 'projects',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
          <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2" />
          <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" />
        </svg>
      ),
      label: t('navigation.projects'),
      path: '/projects',
    },
    {
      id: 'dataModule',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
          <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
          <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
        </svg>
      ),
      label: t('navigation.dataModule'),
      hasSubmenu: true,
      submenu: [
        { label: t('navigation.manageModules'), path: '/data-module/manage' },
        { label: t('navigation.dataValidate'), path: '/data-module/validate' },
        { label: t('navigation.search'), path: '/data-module/search' },
        { label: t('navigation.publishing'), path: '/data-module/publishing' },
        { label: t('navigation.import'), path: '/data-module/import' },
        { label: t('navigation.export'), path: '/data-module/export' },
      ],
    },
    {
      id: 'entities',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" />
          <circle cx="9" cy="7" r="4" strokeWidth="2" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
        </svg>
      ),
      label: t('navigation.entities'),
      path: '/entities',
    },
    {
      id: 'commonInfo',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeWidth="2" />
          <polyline points="13 2 13 9 20 9" strokeWidth="2" />
        </svg>
      ),
      label: t('navigation.commonInformationRepository'),
      path: '/common-info',
    },
    {
      id: 'users',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
          <circle cx="12" cy="7" r="4" strokeWidth="2" />
        </svg>
      ),
      label: t('navigation.usersManagement'),
      path: '/users',
    },
    {
      id: 'settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
          <path
            d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"
            strokeWidth="2"
          />
        </svg>
      ),
      label: t('navigation.settings'),
      path: '/settings',
    },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-wrapper">
            {item.hasSubmenu ? (
              <>
                <button
                  className={`menu-item menu-item-expandable ${
                    isMenuExpanded(item.id) ? 'expanded' : ''
                  }`}
                  onClick={() => handleMenuToggle(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="expand-icon"
                  >
                    <polyline points="9 18 15 12 9 6" strokeWidth="2" />
                  </svg>
                </button>
                {isMenuExpanded(item.id) && (
                  <div className="submenu">
                    {item.submenu.map((subitem, index) => (
                      <NavLink
                        key={index}
                        to={subitem.path}
                        className={({ isActive }) =>
                          `submenu-item ${isActive ? 'active' : ''}`
                        }
                      >
                        {subitem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
