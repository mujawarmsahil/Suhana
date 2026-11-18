import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import SiteNav from "./components/layout/SiteNav.jsx";
import SiteFooter from "./components/layout/SiteFooter.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

function RouteScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === "/" && hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

function NotFound() {
  return (
    <main className="not-found page-pad">
      <p className="eyebrow">Page not found</p>
      <h1>Let’s find our way back.</h1>
      <Link className="text-link" to="/">
        Return to the portfolio <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <>
      <RouteScroll />
      <SiteNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/mughal-inspired-restaurant" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SiteFooter />
    </>
  );
}
