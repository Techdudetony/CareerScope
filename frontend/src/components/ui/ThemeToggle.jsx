import { Moon, Monitor, Sun } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import './ThemeToggle.css';

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = ICONS[theme] ?? Monitor;

  function cycleTheme() {
    const currentIndex = OPTIONS.findIndex((option) => option.value === theme);

    const nextIndex = (currentIndex + 1) % OPTIONS.length;
    setTheme(OPTIONS[nextIndex].value);
  }

  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle theme-toggle--desktop">
        <Icon size={18} aria-hidden="true" className="theme-toggle__icon" />

        <label htmlFor="theme-preference" className="sr-only">
          Appearance preference
        </label>

        <select
          id="theme-preference"
          className="theme-toggle__select"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className="theme-toggle-mobile"
        onClick={cycleTheme}
        aria-label={`Appearance: ${theme}. Change theme`}
        title={`Appearance: ${theme}. Change theme`}
      >
        <Icon size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
