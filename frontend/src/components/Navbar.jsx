import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">🎯</div>
          ResumeAI
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''} id="nav-home">
              Home
            </Link>
          </li>
          <li>
            <Link to="/builder" className={isActive('/builder') ? 'active' : ''} id="nav-builder">
              Builder
            </Link>
          </li>
        </ul>

        <Link to="/builder" className="btn btn-primary btn-sm" id="nav-cta">
          🚀 Build Resume
        </Link>
      </div>
    </nav>
  );
}
