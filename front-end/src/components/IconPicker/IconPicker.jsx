import React, { useState, useEffect } from 'react';
import './IconPicker.css';

// --- Dynamically import all icons from the assets folder ---
// This is a powerful Vite/Webpack feature. It creates an object where keys are file paths.
const iconModules = import.meta.glob('/src/assets/icons/*.png', { eager: true });

// We process the object to get a cleaner array of { name, path }
const icons = Object.entries(iconModules).map(([path, module]) => {
  const fileName = path.split('/').pop(); // e.g., "bear.png"
  const iconName = fileName.replace('.png', ''); // e.g., "bear"
  return {
    name: iconName,
    path: module.default, // The actual URL of the icon
  };
});


function IconPicker({ onIconSelect, currentIcon }) {
  return (
    <div className="icon-picker-container">
      <p><strong>Choose your avatar:</strong></p>
      <div className="icon-grid">
        {icons.map((icon) => (
          <button
            key={icon.name}
            className={`icon-option ${currentIcon === icon.name ? 'selected' : ''}`}
            onClick={() => onIconSelect(icon.name)}
            aria-label={`Select ${icon.name} icon`}
          >
            <img src={icon.path} alt={`${icon.name} icon`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default IconPicker;
