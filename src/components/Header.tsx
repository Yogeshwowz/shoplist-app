import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface HeaderProps {
  onHamburgerClick?: () => void;
  showHamburger?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHamburgerClick, showHamburger }) => {
  const location = useLocation();
  return (
    <header className="bg-blue-900 text-white py-4 px-6 flex items-center justify-between shadow sticky top-0 z-50" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="flex items-center space-x-3">
        {showHamburger && (
          <button
            className="mr-3 bg-blue-900 text-white rounded p-2 shadow-md md:hidden"
            style={{ fontSize: 24, fontWeight: 'bold', display: 'inline-block' }}
            onClick={onHamburgerClick}
            aria-label="Open categories menu"
          >
            ☰
          </button>
        )}
        <span className="text-2xl font-bold tracking-wide">Customer Single Page Application</span>
      </div>
      <nav className="flex space-x-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-white px-4 py-2 rounded-lg font-semibold transition ${isActive ? 'bg-blue-700 shadow' : 'hover:bg-blue-800'}`
          }
          end
        >
          Welcome
        </NavLink>
        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `text-white px-4 py-2 rounded-lg font-semibold transition ${isActive ? 'bg-blue-700 shadow' : 'hover:bg-blue-800'}`
          }
        >
          Order Summary
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
