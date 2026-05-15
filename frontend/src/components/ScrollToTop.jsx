import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls window to top every time the route changes
// Prevents being halfway down the page when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // Renders nothing — pure behavior component
};

export default ScrollToTop;