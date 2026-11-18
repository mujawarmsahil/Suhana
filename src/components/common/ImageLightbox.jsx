import { useEffect, useRef, useState } from "react";

export default function ImageLightbox({ items, index, onClose, onChange }) {
  const closeButton = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const item = index === null ? null : items[index];

  useEffect(() => {
    if (!item) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % items.length);
      if (event.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [item, index, items.length, onClose, onChange]);

  useEffect(() => setZoomed(false), [index]);

  if (!item) return null;

  const previous = () => onChange((index - 1 + items.length) % items.length);
  const next = () => onChange((index + 1) % items.length);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, image ${index + 1} of ${items.length}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightbox-top">
        <span>{item.title}</span>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close image viewer">
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className={`lightbox-stage${zoomed ? " is-zoomed" : ""}${item.kind === "drawing" ? " is-drawing" : ""}`}>
        <button
          type="button"
          className="lightbox-image"
          onClick={() => setZoomed((value) => !value)}
          aria-label={zoomed ? "Fit image to screen" : "Zoom image"}
        >
          <img src={item.src} alt={item.alt} />
        </button>
      </div>
      <div className="lightbox-controls">
        <button type="button" onClick={previous} aria-label="Previous image">← Previous</button>
        <span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <button type="button" onClick={next} aria-label="Next image">Next →</button>
      </div>
    </div>
  );
}
