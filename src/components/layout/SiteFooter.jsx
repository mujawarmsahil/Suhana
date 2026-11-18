import { Link } from "react-router-dom";
import { profile } from "../../data/profile.js";

const footerLinks = [
  ["About", "/#about"],
  ["Projects", "/#projects"],
  ["Process", "/#process"],
  ["Contact", "/#contact"],
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="eyebrow">Interior design portfolio</p>
          <p className="footer-note">Spaces imagined, drawn, and brought into view.</p>
        </div>
        <Link className="back-top" to="/#home">
          Back to top <span aria-hidden="true">↑</span>
        </Link>
      </div>
      <div className="footer-bottom">
        <span>{profile.name} · Interior Design Student</span>
        <nav aria-label="Footer navigation">
          {footerLinks.map(([label, to]) => (
            <Link to={to} key={label}>{label}</Link>
          ))}
        </nav>
        <span>© {new Date().getFullYear()} {profile.name}</span>
      </div>
    </footer>
  );
}
