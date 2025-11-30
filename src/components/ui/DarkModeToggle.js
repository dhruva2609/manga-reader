import React, { useEffect, useState } from "react";
import "./DarkModeToggle.css";

const setDark = () => {
  localStorage.setItem("theme", "dark");
  document.documentElement.setAttribute("data-theme", "dark");
};

const setLight = () => {
  localStorage.setItem("theme", "light");
  document.documentElement.setAttribute("data-theme", "light");
};

const getDefaultDark = () => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return storedTheme === "dark" || (storedTheme === null && prefersDark);
};

const SunIcon = ({ active }) => (
  <svg
    className={`toggle-svg ${active ? "active" : ""}`}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <g>
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </g>
  </svg>
);

const MoonIcon = ({ active }) => (
  <svg
    className={`toggle-svg ${active ? "active" : ""}`}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 1 0 21 12.79z" />
  </svg>
);

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(getDefaultDark());

  useEffect(() => {
    isDark ? setDark() : setLight();
  }, [isDark]);

  const handleChange = (e) => setIsDark(e.target.checked);

  return (
    <div className="toggle-theme-wrapper" title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <SunIcon active={!isDark} />
      <label className="toggle-theme" htmlFor="darkmode-checkbox">
        <input
          type="checkbox"
          id="darkmode-checkbox"
          onChange={handleChange}
          checked={isDark}
          aria-label="Toggle dark mode"
        />
        <div className="slider"></div>
      </label>
      <MoonIcon active={isDark} />
    </div>
  );
};

export default DarkModeToggle;
