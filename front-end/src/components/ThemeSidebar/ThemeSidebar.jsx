import React, { useEffect } from 'react';
import { FaTimes, FaUserEdit } from 'react-icons/fa';
import './ThemeSidebar.css';
import { useNavigate } from 'react-router-dom';

const themes = {
  blue: {
    '--primary-colour': 'var(--pastel-blue-400)',
    '--primary-colour-dark': 'var(--pastel-blue-700)',
    '--primary-colour-light': 'var(--pastel-blue-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-blue-300), var(--pastel-green-400))',
    '--primary-colour-50': 'var(--pastel-blue-50)',
    '--primary-colour-100': 'var(--pastel-blue-100)',
    '--primary-colour-200': 'var(--pastel-blue-200)',
    '--primary-colour-300': 'var(--pastel-blue-300)',
    '--primary-colour-400': 'var(--pastel-blue-400)',
    '--primary-colour-500': 'var(--pastel-blue-500)',
    '--primary-colour-600': 'var(--pastel-blue-600)',
    '--primary-colour-700': 'var(--pastel-blue-700)',
    '--primary-colour-800': 'var(--pastel-blue-800)',
    '--primary-colour-900': 'var(--pastel-blue-900)',
    '--primary-colour-950': 'var(--pastel-blue-950)',
  },
  teal: {
    '--primary-colour': 'var(--color-jet-stream-400)',
    '--primary-colour-dark': 'var(--color-jet-stream-700)',
    '--primary-colour-light': 'var(--color-jet-stream-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--color-jet-stream-300), var(--pastel-green-400))',
    '--primary-colour-50': 'var(--color-jet-stream-50)',
    '--primary-colour-100': 'var(--color-jet-stream-100)',
    '--primary-colour-200': 'var(--color-jet-stream-200)',
    '--primary-colour-300': 'var(--color-jet-stream-300)',
    '--primary-colour-400': 'var(--color-jet-stream-400)',
    '--primary-colour-500': 'var(--color-jet-stream-500)',
    '--primary-colour-600': 'var(--color-jet-stream-600)',
    '--primary-colour-700': 'var(--color-jet-stream-700)',
    '--primary-colour-800': 'var(--color-jet-stream-800)',
    '--primary-colour-900': 'var(--color-jet-stream-900)',
    '--primary-colour-950': 'var(--color-jet-stream-950)',
  },
  green: {
    '--primary-colour': 'var(--pastel-green-400)',
    '--primary-colour-dark': 'var(--pastel-green-700)',
    '--primary-colour-light': 'var(--pastel-green-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-green-300), var(--color-jet-stream-400))',
    '--primary-colour-50': 'var(--pastel-green-50)',
    '--primary-colour-100': 'var(--pastel-green-100)',
    '--primary-colour-200': 'var(--pastel-green-200)',
    '--primary-colour-300': 'var(--pastel-green-300)',
    '--primary-colour-400': 'var(--pastel-green-400)',
    '--primary-colour-500': 'var(--pastel-green-500)',
    '--primary-colour-600': 'var(--pastel-green-600)',
    '--primary-colour-700': 'var(--pastel-green-700)',
    '--primary-colour-800': 'var(--pastel-green-800)',
    '--primary-colour-900': 'var(--pastel-green-900)',
    '--primary-colour-950': 'var(--pastel-green-950)',
  },
  // neutrals (grays / backgrounds)
  neutral: {
    '--primary-colour': 'var(--whitesmoke-400)',
    '--primary-colour-dark': 'var(--whitesmoke-700)',
    '--primary-colour-light': 'var(--whitesmoke-100)',
    '--primary-gradient': 'linear-gradient(135deg, var(--whitesmoke-200), var(--whitesmoke-500))',
    '--primary-colour-50': 'var(--whitesmoke-50)',
    '--primary-colour-100': 'var(--whitesmoke-100)',
    '--primary-colour-200': 'var(--whitesmoke-200)',
    '--primary-colour-300': 'var(--whitesmoke-300)',
    '--primary-colour-400': 'var(--whitesmoke-400)',
    '--primary-colour-500': 'var(--whitesmoke-500)',
    '--primary-colour-600': 'var(--whitesmoke-600)',
    '--primary-colour-700': 'var(--whitesmoke-700)',
    '--primary-colour-800': 'var(--whitesmoke-800)',
    '--primary-colour-900': 'var(--whitesmoke-900)',
    '--primary-colour-950': 'var(--whitesmoke-950)',
  },
  purple: {
    '--primary-colour': 'var(--pastel-purple-400)',
    '--primary-colour-dark': 'var(--pastel-purple-700)',
    '--primary-colour-light': 'var(--pastel-purple-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-purple-300), var(--pastel-blue-400))',
    '--primary-colour-50': 'var(--pastel-purple-50)',
    '--primary-colour-100': 'var(--pastel-purple-100)',
    '--primary-colour-200': 'var(--pastel-purple-200)',
    '--primary-colour-300': 'var(--pastel-purple-300)',
    '--primary-colour-400': 'var(--pastel-purple-400)',
    '--primary-colour-500': 'var(--pastel-purple-500)',
    '--primary-colour-600': 'var(--pastel-purple-600)',
    '--primary-colour-700': 'var(--pastel-purple-700)',
    '--primary-colour-800': 'var(--pastel-purple-800)',
    '--primary-colour-900': 'var(--pastel-purple-900)',
    '--primary-colour-950': 'var(--pastel-purple-950)',
  },
  pink: {
    '--primary-colour': 'var(--pastel-pink-400)',
    '--primary-colour-dark': 'var(--pastel-pink-700)',
    '--primary-colour-light': 'var(--pastel-pink-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-pink-300), var(--pastel-purple-400))',
    '--primary-colour-50': 'var(--pastel-pink-50)',
    '--primary-colour-100': 'var(--pastel-pink-100)',
    '--primary-colour-200': 'var(--pastel-pink-200)',
    '--primary-colour-300': 'var(--pastel-pink-300)',
    '--primary-colour-400': 'var(--pastel-pink-400)',
    '--primary-colour-500': 'var(--pastel-pink-500)',
    '--primary-colour-600': 'var(--pastel-pink-600)',
    '--primary-colour-700': 'var(--pastel-pink-700)',
    '--primary-colour-800': 'var(--pastel-pink-800)',
    '--primary-colour-900': 'var(--pastel-pink-900)',
    '--primary-colour-950': 'var(--pastel-pink-950)',
  },
  
  red: {
    '--primary-colour': 'var(--pastel-red-400)',
    '--primary-colour-dark': 'var(--pastel-red-700)',
    '--primary-colour-light': 'var(--pastel-red-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--pastel-red-300), var(--pastel-pink-400))',
    '--primary-colour-50': 'var(--pastel-red-50)',
    '--primary-colour-100': 'var(--pastel-red-100)',
    '--primary-colour-200': 'var(--pastel-red-200)',
    '--primary-colour-300': 'var(--pastel-red-300)',
    '--primary-colour-400': 'var(--pastel-red-400)',
    '--primary-colour-500': 'var(--pastel-red-500)',
    '--primary-colour-600': 'var(--pastel-red-600)',
    '--primary-colour-700': 'var(--pastel-red-700)',
    '--primary-colour-800': 'var(--pastel-red-800)',
    '--primary-colour-900': 'var(--pastel-red-900)',
    '--primary-colour-950': 'var(--pastel-red-950)',
  },
  brown: {
    '--primary-colour': 'var(--color-almond-400)',
    '--primary-colour-dark': 'var(--color-almond-700)',
    '--primary-colour-light': 'var(--color-almond-200)',
    '--primary-gradient': 'linear-gradient(135deg, var(--color-almond-300), var(--pastel-red-400))',
    '--primary-colour-50': 'var(--color-almond-50)',
    '--primary-colour-100': 'var(--color-almond-100)',
    '--primary-colour-200': 'var(--color-almond-200)',
    '--primary-colour-300': 'var(--color-almond-300)',
    '--primary-colour-400': 'var(--color-almond-400)',
    '--primary-colour-500': 'var(--color-almond-500)',
    '--primary-colour-600': 'var(--color-almond-600)',
    '--primary-colour-700': 'var(--color-almond-700)',
    '--primary-colour-800': 'var(--color-almond-800)',
    '--primary-colour-900': 'var(--color-almond-900)',
    '--primary-colour-950': 'var(--color-almond-950)',
  },
};


function ThemeSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;
    Object.keys(theme).forEach((key) => {
      root.style.setProperty(key, theme[key]);
    });
    localStorage.setItem('selectedTheme', themeName);
  };

  const handleEditDetailsClick = () => {
    navigate('/details'); // Navigate to the details page
    onClose(); // Close the sidebar after clicking
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      
      <div className={`theme-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Settings</h3>
          <button onClick={onClose} className="close-btn"><FaTimes /></button>
        </div>
        <div className="sidebar-content">

          <button onClick={handleEditDetailsClick} className="sidebar-action-button">
            <FaUserEdit />
            <span>Edit My Details</span>
          </button>
          
          <hr className="sidebar-divider" />
          
          <p>Choose your favourite colour</p>
          <div className="theme-options">
            {Object.keys(themes).map((themeName) => (
              <button
                key={themeName}
                className={`theme-swatch ${themeName}`}
                onClick={() => applyTheme(themeName)}
                aria-label={`Apply ${themeName} theme`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ThemeSidebar;
