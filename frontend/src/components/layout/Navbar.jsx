import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Plus, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../features/auth/AuthContext";

const Navbar = ({ onSearch, onCreateNote }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const debounceRef = useRef(null);
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(val), 250);
  }, [onSearch]);

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    searchRef.current?.focus();
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto max-w-7xl px-5 h-14 flex items-center gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <rect width="24" height="24" rx="5" fill="#5c5fef" />
            <path d="M7 7h4l3 5-3 5H7l3-5-3-5z" fill="#fff" fillOpacity="0.9" />
            <path d="M13 7h4v2h-4V7zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z" fill="#fff" fillOpacity="0.6" />
          </svg>
          <span className="font-semibold text-text text-base hidden sm:block tracking-tight">
            Inkwell
          </span>
        </div>

        {/* Search */}
        <div className={`
          flex-1 max-w-lg mx-auto flex items-center gap-2.5
          bg-hover border rounded-lg h-9 px-3
          transition-all duration-150
          ${isFocused ? "border-accent shadow-ring-accent bg-surface" : "border-transparent"}
        `}>
          <Search size={14} className={`shrink-0 transition-colors ${isFocused ? "text-accent" : "text-text-tertiary"}`} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search notes"
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-disabled outline-none"
          />
          {query && (
            <button onClick={clearSearch} className="text-text-tertiary hover:text-text shrink-0" aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* New Note */}
          <button
            onClick={onCreateNote}
            className="btn-primary h-9 text-sm gap-1.5 hidden sm:inline-flex"
            aria-label="Create new note"
          >
            <Plus size={15} strokeWidth={2} />
            <span className="hidden sm:inline">New</span>
            <kbd className="hidden lg:inline-flex items-center h-4.5 px-1.5 rounded text-2xs font-medium bg-accent-hover/30 text-white/70 ml-0.5">
              ⌘K
            </kbd>
          </button>

          {/* Mobile new note */}
          <button
            onClick={onCreateNote}
            className="sm:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
            aria-label="Create new note"
          >
            <Plus size={18} strokeWidth={2} />
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-lg bg-accent-light text-accent-hover text-xs font-semibold flex items-center justify-center hover:bg-accent-subtle transition-colors"
              aria-label="User menu"
            >
              {getInitials(user?.fullName)}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-surface border border-border rounded-xl shadow-dropdown py-1.5 animate-fade-in-scale origin-top-right">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-text text-sm font-medium truncate">{user?.fullName}</p>
                  <p className="text-text-tertiary text-xs truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => { logout(); toast.success("Signed out"); navigate("/login"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-text-secondary hover:bg-danger-light hover:text-danger transition-colors text-left"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
