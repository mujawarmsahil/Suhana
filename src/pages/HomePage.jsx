import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { designAreas, profile, verifiedSoftware } from "../data/profile.js";
import { processStages, restaurantProject } from "../data/projects.js";
import ImageLightbox from "../components/common/ImageLightbox.jsx";
import Reveal from "../components/common/Reveal.jsx";
import SceneErrorBoundary from "../components/scene/SceneErrorBoundary.jsx";
import PortraitFallback from "../components/portrait/PortraitFallback.jsx";

const InteractivePortrait = lazy(() => import("../components/portrait/InteractivePortrait.jsx"));

function Hero() {
  const stage = useRef(null);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [sceneRequested, setSceneRequested] = useState(false);
  const [canUse3D, setCanUse3D] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    setCanUse3D(true);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!canUse3D || !stage.current) return undefined;
    if (!("IntersectionObserver" in window)) {
      setSceneRequested(true);
      setSceneVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSceneVisible(entry.isIntersecting);
        if (entry.isIntersecting) setSceneRequested(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [canUse3D]);

  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow hero-kicker">Interior design student <span>·</span> Diploma</p>
        <h1>{profile.name.split(" ")[0]}<br /><em>{profile.name.split(" ").slice(1).join(" ")}</em></h1>
        <p className="hero-summary">
          {profile.introduction}
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#projects">Explore projects <span aria-hidden="true">↘</span></a>
          <a className="text-link" href="#about">About me <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <div className="hero-art">
        <div className="scene-meta">
          <span>Portrait study</span>
          <span>3D / 01</span>
        </div>
        <div className="scene-window" ref={stage} aria-label="Interactive stylized 3D portrait">
          {canUse3D && sceneRequested ? (
            <SceneErrorBoundary fallback={<PortraitFallback />}>
              <Suspense fallback={<PortraitFallback />}>
                <InteractivePortrait active={sceneVisible} reducedMotion={reducedMotion} />
              </Suspense>
            </SceneErrorBoundary>
          ) : (
            <PortraitFallback />
          )}
          <div className="scene-note">
            <span className="scene-dot" aria-hidden="true" />
            Portrait reference on a curved, interactive 3D surface
          </div>
        </div>
        <div className="hero-art-caption"><span>A portrait in sculptural form</span><span>Move or touch to explore</span></div>
      </div>
      <a className="scroll-cue" href="#about"><span />Scroll to discover</a>
      <span className="hero-index" aria-hidden="true">SFA — ID / 01</span>
    </section>
  );
}

function About() {
  return (
    <section className="about-section section-pad" id="about">
      <Reveal className="about-heading">
        <p className="eyebrow">01 — About the designer</p>
        <h2>Making room<br />for <em>feeling.</em></h2>
      </Reveal>
      <Reveal className="about-copy" delay={100}>
        <p className="about-lead">{profile.introduction}</p>
        <p className="body-copy">
          The work shown here moves between measured plans, material direction, technical
          drawings, and rendered interior views.
        </p>
        <dl className="profile-facts">
          <div><dt>Education</dt><dd>{profile.education}</dd></div>
          <div><dt>Institute</dt><dd>{profile.institution}</dd></div>
        </dl>
      </Reveal>
      <div className="about-rule" aria-hidden="true"><span>Space</span><span>Material</span><span>Light</span></div>
    </section>
  );
}

function FeaturedProject() {
  const project = restaurantProject;

  return (
    <section className="projects-section section-pad" id="projects">
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">02 — Selected work</p>
          <h2>One space.<br /><em>Many layers.</em></h2>
        </Reveal>
        <Reveal as="p" className="section-aside" delay={100}>
          A thematic restaurant explored through its plan, materials, technical drawings, and
          rendered views.
        </Reveal>
      </div>

      <Reveal className="feature-project">
        <Link className="feature-image" to={project.slug} aria-label={`View ${project.title} case study`}>
          <img
            src={project.heroRender}
            alt="Restaurant dining hall with a central fountain"
            loading="lazy"
            decoding="async"
          />
          <span className="feature-image-index">01 — Hospitality</span>
          <span className="feature-image-cta">Enter the project <b aria-hidden="true">↗</b></span>
        </Link>
        <div className="feature-meta">
          <div>
            <p className="eyebrow">Signature project</p>
            <h3>{project.title}</h3>
          </div>
          <dl>
            <div><dt>Type</dt><dd>{project.category}</dd></div>
            <div><dt>Area</dt><dd>{project.area}</dd></div>
          </dl>
          <Link className="text-link" to={project.slug}>View case study <span aria-hidden="true">↗</span></Link>
        </div>
      </Reveal>
      <Reveal className="feature-foot" delay={120}>
        <span>Concept · The Mughal Era</span>
        <span>Plans · Visualisation · Working drawings</span>
      </Reveal>
    </section>
  );
}

function Process() {
  return (
    <section className="process-section section-pad" id="process">
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">03 — Design process</p>
          <h2>From first idea<br />to <em>final view.</em></h2>
        </Reveal>
        <Reveal as="p" className="section-aside" delay={100}>
          The project scope moves from concept and space planning through to technical
          documentation and 3D visualisation.
        </Reveal>
      </div>
      <div className="process-line">
        {processStages.map((stage, index) => (
          <Reveal as="article" className="process-step" delay={index * 65} key={stage.number}>
            <div className="process-image">
              <img src={stage.image.src} alt={stage.image.alt} loading="lazy" decoding="async" />
              <span>{stage.number}</span>
            </div>
            <h3>{stage.title}</h3>
            <p>{stage.detail}</p>
          </Reveal>
        ))}
      </div>
      <Link className="text-link process-link" to={restaurantProject.slug}>
        See the complete project record <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}

function Exploration() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const items = [restaurantProject.concept, ...restaurantProject.renders];

  return (
    <section className="exploration-section section-pad" id="exploration">
      <Reveal className="exploration-intro">
        <p className="eyebrow">04 — Creative exploration</p>
        <h2>Notes on<br /><em>atmosphere.</em></h2>
        <p className="body-copy">
          The concept board gathers the project’s references for materials, furniture, lighting,
          and decorative detail.
        </p>
        <div className="material-notes" aria-label="Materials named in the project">
          {restaurantProject.materials.map((material) => <span key={material}>{material}</span>)}
        </div>
      </Reveal>
      <Reveal className="exploration-board" delay={100}>
        <button
          type="button"
          className="image-trigger board-trigger"
          onClick={() => setLightboxIndex(0)}
          aria-label="Enlarge The Mughal Era concept board"
        >
          <img src={restaurantProject.concept.src} alt={restaurantProject.concept.alt} loading="lazy" />
          <span className="image-trigger-label">Open concept board <b aria-hidden="true">↗</b></span>
        </button>
        <p className="image-caption"><span>Concept study</span><span>The Mughal Era</span></p>
      </Reveal>
      <ImageLightbox
        items={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </section>
  );
}

function Skills() {
  return (
    <section className="skills-section section-pad">
      <Reveal className="section-heading skills-heading">
        <div>
          <p className="eyebrow">05 — Skills & tools</p>
          <h2>Thinking in<br /><em>space.</em></h2>
        </div>
        <Reveal as="p" className="section-aside" delay={100}>
          Tools and design areas represented in the project work.
        </Reveal>
      </Reveal>
      <div className="skills-columns">
        <Reveal className="skill-column">
          <p className="eyebrow">Design areas</p>
          <ul>{designAreas.map((area) => <li key={area}>{area}</li>)}</ul>
        </Reveal>
        <Reveal className="skill-column" delay={100}>
          <p className="eyebrow">Software</p>
          <ul>{verifiedSoftware.map((software) => <li key={software}>{software}</li>)}</ul>
        </Reveal>
        <p className="skill-note">No proficiency ratings shown; the work speaks through its drawings and views.</p>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get("subject")).trim();
    const body = [
      `From: ${String(data.get("name")).trim()}`,
      `Reply email: ${String(data.get("email")).trim()}`,
      "",
      String(data.get("message")).trim(),
    ].join("\n");

    if (!profile.contactEmail) {
      setStatus("The form is valid, but no contact email is configured. No message was sent.");
      return;
    }

    window.location.href = `mailto:${profile.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Your email app should open with this message. It has not been sent by this website.");
  }

  return (
    <section className="contact-section section-pad" id="contact">
      <div className="contact-heading">
        <Reveal>
          <p className="eyebrow">06 — Contact</p>
          <h2>Let’s make<br /><em>something</em><br />thoughtful.</h2>
        </Reveal>
        <p className="contact-note">
          For feedback or a conversation about the work, leave a note below.
        </p>
      </div>
      <Reveal className="contact-form-wrap" delay={100}>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>Your name</span>
            <input autoComplete="name" name="name" required />
          </label>
          <label>
            <span>Your email</span>
            <input autoComplete="email" name="email" type="email" required />
          </label>
          <label className="form-wide">
            <span>Subject</span>
            <input name="subject" required />
          </label>
          <label className="form-wide">
            <span>Message</span>
            <textarea name="message" rows="4" required />
          </label>
          <div className="form-submit form-wide">
            <button className="button button-light" type="submit">Prepare message <span aria-hidden="true">↗</span></button>
            <p className="form-status" role="status" aria-live="polite">{status}</p>
          </div>
        </form>
        {!profile.contactEmail && (
          <p className="integration-note">
            The contact email has not been provided. Configure <code>contactEmail</code> in
            <code> src/data/profile.js</code> to enable the email fallback.
          </p>
        )}
      </Reveal>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <FeaturedProject />
      <Process />
      <Exploration />
      <Skills />
      <Contact />
    </main>
  );
}
