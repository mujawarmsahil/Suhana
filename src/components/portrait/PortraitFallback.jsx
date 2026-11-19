import portraitReference from "../../../images/portrait-suhana.jpg";

export default function PortraitFallback() {
  return (
    <svg
      className="portrait-fallback"
      viewBox="0 0 760 590"
      role="img"
      aria-label="Portrait photograph displayed in an arched frame"
    >
      <rect width="760" height="590" fill="#d9d4ca" />
      <path d="M170 500V220C170 115 270 62 380 62s210 53 210 158v280" fill="none" stroke="#77745e" strokeWidth="5" />
      <path d="M194 500V229C194 138 280 88 380 88s186 50 186 141v271" fill="none" stroke="#b69c76" strokeWidth="2" />
      <rect x="256" y="72" width="248" height="372" fill="#f3efe7" />
      <image href={portraitReference} x="260" y="76" width="240" height="364" preserveAspectRatio="xMidYMid slice" />
      <path d="M170 590h420" stroke="#776f59" strokeWidth="5" />
    </svg>
  );
}
