import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import PortraitFallback from "./PortraitFallback.jsx";
import PortraitScene from "./PortraitScene.jsx";

export default function InteractivePortrait({ active, reducedMotion }) {
  const [hovered, setHovered] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(null);
  const mobile = window.matchMedia("(max-width: 760px)").matches;

  useEffect(() => {
    let context = null;
    try {
      context = document.createElement("canvas").getContext("webgl2");
    } catch {
      context = null;
    }
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    setWebglAvailable(Boolean(context));
  }, []);

  if (!webglAvailable) return <PortraitFallback />;

  return (
    <div
      className="portrait-canvas"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerCancel={() => setHovered(false)}
      aria-label="Interactive 3D portrait modeled from the supplied photo reference"
    >
      <Canvas
        camera={{ position: [0.18, 2.35, 7.4], fov: 36 }}
        dpr={mobile ? [1, 1.1] : [1, 1.35]}
        frameloop={!active ? "never" : reducedMotion ? "demand" : "always"}
        shadows={!mobile}
        gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
        fallback={<PortraitFallback />}
        onCreated={({ gl }) => {
          gl.domElement.setAttribute(
            "aria-label",
            "Interactive 3D portrait modeled from the supplied photo reference",
          );
        }}
      >
        <PortraitScene reducedMotion={reducedMotion} hovered={hovered} />
      </Canvas>
    </div>
  );
}
