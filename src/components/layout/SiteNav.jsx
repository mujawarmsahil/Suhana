import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", to: "/#home", id: "home" },
  { label: "About", to: "/#about", id: "about" },
  { label: "Projects", to: "/#projects", id: "projects" },
  { label: "Process", to: "/#process", id: "process" },
  { label: "Exploration", to: "/#exploration", id: "exploration" },
];

export default function SiteNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    if (location.pathname !== "/" || !("IntersectionObserver" in window)) {
      return () => window.removeEventListener("scroll", updateScroll);
    }

    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const isHome = location.pathname === "/";

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-shell">
        <Link className="wordmark" to="/#home" aria-label="Suhana Firoj Attar — home">
          <span className="wordmark-mark" aria-hidden="true">S.</span>
          <span>{`Suhana Firoj Attar`}</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="menu-toggle-lines" aria-hidden="true" />
        </button>
        <nav
          id="primary-navigation"
          className={`primary-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          {links.map(({ label, to, id }) => (
            <Link
              key={id}
              to={to}
              className={isHome && active === id ? "is-active" : ""}
              aria-current={isHome && active === id ? "location" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link className="nav-contact" to="/#contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
