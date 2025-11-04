import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">
          Copyright © {currentYear} by CSDB. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
