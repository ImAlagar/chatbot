import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { auth } from '../firebase';

const ProfileSection = ({ theme, toggleTheme, collapsed }) => {
  const user = auth.currentUser;
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // 👇 OUTSIDE CLICK CLOSE
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`relative border-t p-3 ${
        theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
      }`}
    >
      {/* MAIN ROW */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => collapsed && setOpen(prev => !prev)}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}
            `}
          >
            <User size={16} />
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-medium">
                {user?.displayName ||
                  user?.email?.split('@')[0] ||
                  'User'}
              </p>
              <p className="text-xs opacity-75 truncate max-w-[120px]">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          )}
        </div>

        {/* 🌗 Theme toggle ONLY in expanded mode */}
        {!collapsed && (
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors
              ${
                theme === 'dark'
                  ? 'hover:bg-slate-800 text-yellow-400'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </div>

      {/* 🔥 DROPDOWN (COLLAPSED MODE) */}
      {collapsed && open && (
        <div
          className={`absolute bottom-full left-2 mb-2 w-56 rounded-xl shadow-xl p-3 z-[9999]
            ${theme === 'dark'
              ? 'bg-slate-900 border border-slate-700'
              : 'bg-white border border-gray-200'}
          `}
        >
          <p className="text-sm font-medium mb-1">
            {user?.displayName ||
              user?.email?.split('@')[0] ||
              'User'}
          </p>
          <p className="text-xs opacity-75 mb-3 truncate">
            {user?.email || 'user@example.com'}
          </p>

          {/* 🌗 THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`w-full mb-2 flex items-center justify-center gap-2 py-2 rounded-lg
              ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button
            onClick={() => auth.signOut()}
            className={`w-full text-sm py-2 rounded-lg
              ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* NORMAL SIGNOUT (EXPANDED MODE) */}
      {!collapsed && (
        <button
          onClick={() => auth.signOut()}
          className={`mt-3 w-full text-sm py-2 rounded-lg
            ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default ProfileSection;
