import { useReveal } from "../../hooks/useReveal.js";

export default function Reveal({ as: Element = "div", className = "", children, delay = 0 }) {
  const [ref, visible] = useReveal();

  return (
    <Element
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </Element>
  );
}
