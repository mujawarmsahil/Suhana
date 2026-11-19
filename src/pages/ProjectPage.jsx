import { lazy, Suspense, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import ImageLightbox from "../components/common/ImageLightbox.jsx";
import Reveal from "../components/common/Reveal.jsx";
import SceneErrorBoundary from "../components/scene/SceneErrorBoundary.jsx";
import { restaurantProject as project } from "../data/projects.js";

const RestaurantBlockout = lazy(() => import("../components/scene/RestaurantBlockout.jsx"));

function ProjectImage({ asset, className = "", onOpen }) {
  return (
    <figure className={`project-image ${className}`}>
      <button
        type="button"
        className="image-trigger"
        onClick={() => onOpen(asset)}
        aria-label={`Open image: ${asset.title}`}
      >
        <img src={asset.src} alt={asset.alt} loading="lazy" decoding="async" />
        <span className="image-trigger-label">Enlarge <b aria-hidden="true">↗</b></span>
      </button>
      <figcaption className="image-caption">
        <span>{asset.kind === "drawing" ? "Technical drawing" : asset.kind === "board" ? "Concept study" : "3D visualisation"}</span>
        <span>{asset.title}</span>
      </figcaption>
    </figure>
  );
}

function ChapterHeading({ number, eyebrow, title, children }) {
  return (
    <div className="chapter-heading">
      <p className="eyebrow">{number} — {eyebrow}</p>
      <div>
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}

function ModelPreviewFallback({ planImage, onReturnToPlan }) {
  return (
    <div className="model-preview-fallback">
      <img src={planImage} alt="Measured restaurant presentation plan" />
      <div>
        <p>3D preview unavailable in this browser.</p>
        <button type="button" onClick={onReturnToPlan}>Return to measured plan</button>
      </div>
    </div>
  );
}

function PlanTour({ project, onOpen }) {
  const [activeZoneId, setActiveZoneId] = useState(project.tourZones[0].id);
  const [viewIndex, setViewIndex] = useState(0);
  const [visualization, setVisualization] = useState("plan");
  const activeZone = project.tourZones.find((zone) => zone.id === activeZoneId);
  const activeView = activeZone.views[viewIndex];

  const selectZone = (zoneId) => {
    setActiveZoneId(zoneId);
    setViewIndex(0);
  };
  const changeView = (step) => {
    setViewIndex((current) => (current + step + activeZone.views.length) % activeZone.views.length);
  };

  return (
    <div className="plan-tour">
      <div className="tour-plan-column">
        <div className="plan-tour-mode" role="group" aria-label="Choose a project view">
          <button
            type="button"
            className={visualization === "plan" ? "is-active" : ""}
            aria-pressed={visualization === "plan"}
            onClick={() => setVisualization("plan")}
          >
            Measured plan
          </button>
          <button
            type="button"
            className={visualization === "model" ? "is-active" : ""}
            aria-pressed={visualization === "model"}
            onClick={() => setVisualization("model")}
          >
            3D blockout
          </button>
        </div>
        {visualization === "plan" ? (
          <figure className="plan-tour-map">
            <img
              src={project.plans[0].src}
              alt="Presentation plan showing the restaurant layout"
              loading="lazy"
              decoding="async"
            />
            {project.tourZones.map((zone, index) => (
              <button
                key={zone.id}
                type="button"
                className={`plan-tour-hotspot${activeZoneId === zone.id ? " is-active" : ""}`}
                style={{ left: zone.position.left, top: zone.position.top }}
                onClick={() => selectZone(zone.id)}
                aria-label={`Show ${zone.label} views`}
                aria-pressed={activeZoneId === zone.id}
              >
                <span className="tour-hotspot-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="tour-hotspot-name">{zone.label}</span>
              </button>
            ))}
            <button
              className="plan-tour-open"
              type="button"
              onClick={() => onOpen(project.plans[0])}
            >
              View full plan <span aria-hidden="true">↗</span>
            </button>
          </figure>
        ) : (
          <div className="restaurant-model-panel">
            <SceneErrorBoundary
              fallback={(
                <ModelPreviewFallback
                  planImage={project.plans[0].src}
                  onReturnToPlan={() => setVisualization("plan")}
                />
              )}
            >
              <Suspense fallback={<div className="model-preview-status">Preparing the interactive blockout…</div>}>
                <RestaurantBlockout
                  activeZoneId={activeZoneId}
                  onSelectZone={selectZone}
                  onReturnToPlan={() => setVisualization("plan")}
                  planImage={project.plans[0].src}
                />
              </Suspense>
            </SceneErrorBoundary>
          </div>
        )}
        <div className="plan-tour-map-caption">
          <span>{visualization === "plan" ? "Presentation plan" : "Approximate 3D blockout"}</span>
          <span>{visualization === "plan" ? "Select a marked area to explore" : "Select an area below to link its render"}</span>
        </div>
        <nav className="tour-zone-list" aria-label="Choose an area on the plan">
          {project.tourZones.map((zone, index) => (
            <button
              key={zone.id}
              type="button"
              className={`tour-zone-button${activeZoneId === zone.id ? " is-active" : ""}`}
              onClick={() => selectZone(zone.id)}
              aria-pressed={activeZoneId === zone.id}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>{zone.label}
            </button>
          ))}
        </nav>
        <ProjectImage
          asset={project.plans[1]}
          className="tour-measurement-plan"
          onOpen={onOpen}
        />
      </div>

      <div className="tour-view-column">
        <div className="tour-view-heading" aria-live="polite">
          <div>
            <p className="eyebrow">{activeZone.label}</p>
            <h3>{activeView.title}</h3>
          </div>
          {activeZone.views.length > 1 && (
            <div className="tour-view-controls" aria-label="Browse views">
              <button type="button" onClick={() => changeView(-1)} aria-label="Previous view">←</button>
              <span>{String(viewIndex + 1).padStart(2, "0")} / {String(activeZone.views.length).padStart(2, "0")}</span>
              <button type="button" onClick={() => changeView(1)} aria-label="Next view">→</button>
            </div>
          )}
        </div>
        <ProjectImage
          key={activeView.src}
          asset={activeView}
          className="tour-view-image"
          onOpen={onOpen}
        />
        <p className="tour-view-note">Rendered view from the selected area</p>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const openImage = useCallback((asset) => {
    const index = project.lightboxItems.findIndex((item) => item.src === asset.src);
    if (index >= 0) setLightboxIndex(index);
  }, []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <main className="project-page">
      <section className="project-intro section-pad">
        <Link className="back-link" to="/#projects">← Selected work</Link>
        <div className="project-title-row">
          <div>
            <p className="eyebrow">Signature project <span>·</span> Hospitality</p>
            <h1>{project.title}</h1>
          </div>
          <p className="project-intro-copy">{project.summary}</p>
        </div>
        <div className="project-facts">
          <div><span>Project type</span><strong>{project.category}</strong></div>
          <div><span>Project area</span><strong>{project.area}</strong></div>
          <div><span>Concept</span><strong>{project.conceptName}</strong></div>
        </div>
      </section>

      <section className="case-hero page-edge">
        <ProjectImage asset={project.renders[0]} className="case-hero-image" onOpen={openImage} />
        <div className="case-hero-stamp"><span>01</span><span>Interior visualisation</span></div>
      </section>

      <section className="case-brief section-pad">
        <ChapterHeading number="01" eyebrow="Design intent" title="A royal reference, reinterpreted.">
          {project.conceptDescription}
        </ChapterHeading>
        <div className="brief-details">
          <p>{project.summary}</p>
          <dl>
            <div><dt>Main dining hall</dt><dd>16.30 × 11.40 m</dd></div>
            <div><dt>Software</dt><dd>AutoCAD · SketchUp</dd></div>
          </dl>
        </div>
      </section>

      <section className="case-concept section-pad">
        <ChapterHeading number="02" eyebrow="Concept & inspiration" title={project.conceptName}>
          A visual reference for the project’s material, furniture, lighting, and decorative direction.
        </ChapterHeading>
        <ProjectImage asset={project.concept} className="concept-image" onOpen={openImage} />
      </section>

      <section className="case-materials section-pad">
        <div className="materials-title">
          <p className="eyebrow">03 — Material & colour direction</p>
          <h2>Warm surfaces.<br /><em>Layered detail.</em></h2>
        </div>
        <div className="materials-copy">
          <p>
            The project sheets specify marble-look flooring, sandstone finishes, dark timber,
            brass tones, and velvet upholstery alongside carved panels and jali screens.
          </p>
          <ul className="material-list">
            {project.materials.map((material, index) => (
              <li key={material}><span>0{index + 1}</span>{material}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="case-plans section-pad">
        <ChapterHeading number="04" eyebrow="Space planning" title="Explore the plan." />
        <PlanTour project={project} onOpen={openImage} />
      </section>

      <section className="case-renders section-pad">
        <ChapterHeading number="05" eyebrow="Interior visualisation" title="A sequence of rooms and moments.">
          Eight views show the dining, entrance, reception, and bar areas.
        </ChapterHeading>
        <div className="case-image-grid render-grid">
          {project.renders.map((asset, index) => (
            <ProjectImage
              key={asset.title}
              asset={asset}
              className={`render-position render-position-${index + 1}`}
              onOpen={openImage}
            />
          ))}
        </div>
      </section>

      <section className="case-technical section-pad">
        <ChapterHeading number="06" eyebrow="Technical documentation" title="Details, resolved on the page.">
          Ceiling, flooring, furniture sections, and reception counter drawings remain available at full size.
        </ChapterHeading>
        <div className="technical-subsection">
          <div className="technical-label"><span>A</span><h3>Ceiling & flooring</h3></div>
          <div className="case-image-grid layout-grid">
            {project.layouts.map((asset) => (
              <ProjectImage key={asset.title} asset={asset} className="span-twelve" onOpen={openImage} />
            ))}
          </div>
        </div>
        <div className="technical-subsection">
          <div className="technical-label"><span>B</span><h3>Furniture sections & detail</h3></div>
          <div className="case-image-grid furniture-grid">
            {project.furnitureDrawings.map((asset, index) => (
              <ProjectImage
                key={asset.title}
                asset={asset}
                className={index === 2 ? "span-twelve" : "span-six"}
                onOpen={openImage}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="case-summary section-pad">
        <Reveal>
          <p className="eyebrow">07 — Scope of work</p>
          <h2>From plan<br />to <em>visualisation.</em></h2>
        </Reveal>
        <ul className="scope-list">
          {project.scope.map((item, index) => (
            <li key={item}><span>0{index + 1}</span>{item}</li>
          ))}
        </ul>
        <Link className="text-link" to="/#projects">Back to selected work <span aria-hidden="true">↗</span></Link>
      </section>

      <ImageLightbox
        items={project.lightboxItems}
        index={lightboxIndex}
        onClose={closeLightbox}
        onChange={setLightboxIndex}
      />
    </main>
  );
}
