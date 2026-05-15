import { useState, useRef, useEffect } from "react";
import { BookOpen, Search, Plus, LogOut, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onSearch, onCreateNote }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search — fires as user types
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val); // lift state up to Dashboard
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* ── BRAND ─────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
            <BookOpen size={15} className="text-accent" />
          </div>
          <span className="font-display font-semibold text-ink text-lg hidden sm:block">
            Inkwell
          </span>
        </div>

        {/* ── SEARCH BAR ────────────────────────────────── */}
        <div
          className={`
            flex-1 max-w-xl mx-auto relative flex items-center
            bg-bg-surface border rounded-xl px-3.5 gap-2.5
            transition-all duration-200
            min-w-0
            ${isSearchFocused
              ? "border-accent/60 ring-1 ring-accent/20 shadow-accent-glow"
              : "border-border"
            }
          `}
        >
          <Search
            size={14}
            className={`flex-shrink-0 transition-colors duration-200 ${
              isSearchFocused ? "text-accent" : "text-ink-faint"
            }`}
          />
          <input
            type="text"
            placeholder="Search your notes..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="
              flex-1 bg-transparent py-2.5 text-sm text-ink
              placeholder:text-ink-faint font-sans
              focus:outline-none
            "
          />
          {/* Clear button — only shows when there's a query */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-ink-faint hover:text-ink transition-colors flex-shrink-0"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* ── RIGHT ACTIONS ──────────────────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Create Note Button */}
          <button
            onClick={onCreateNote}
            className="
              flex items-center gap-2 bg-accent text-bg-base
              font-semibold text-sm px-4 py-2 rounded-xl
              hover:bg-accent-hover active:scale-[0.97]
              transition-all duration-200 shadow-accent-glow
          group
            "
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden sm:block">New Note</span>
        {/* Keyboard shortcut hint — visible on desktop */}
        <span className="
          hidden lg:block text-bg-base/60 text-xs font-mono
          border border-bg-base/20 rounded px-1 py-0.5
          group-hover:border-bg-base/30 transition-colors
        ">
          ⌘K
        </span>
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="
                w-9 h-9 rounded-xl bg-bg-surface border border-border
                flex items-center justify-center
                hover:border-accent/40 transition-all duration-200
                font-mono text-xs font-medium text-accent
              "
            >
              {getInitials(user?.fullName)}
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="
                absolute right-0 top-full mt-2 w-56
                bg-bg-surface border border-border rounded-2xl
                shadow-modal py-2 animate-fade-in-scale
              ">
                {/* User info */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-ink text-sm font-medium font-sans truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-ink-muted text-xs font-mono truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="pt-1">
                  <button
                    onClick={handleLogout}
                    className="
                      w-full flex items-center gap-3 px-4 py-2.5
                      text-danger hover:bg-danger/8
                      text-sm font-sans transition-colors duration-150
                      text-left
                    "
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
    </nav>
  );
};

export default Navbar;