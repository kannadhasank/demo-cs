import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const { isOpen } = useSelector((state) => state.sidebar);

  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className={`content-wrapper ${!isOpen ? 'content-expanded' : ''}`}>
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
