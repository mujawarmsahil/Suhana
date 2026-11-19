import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function PortraitLighting({ hovered }) {
  const accent = useRef(null);
  const { invalidate } = useThree();

  useEffect(() => {
    invalidate();
  }, [hovered, invalidate]);

  useFrame((_, delta) => {
    if (!accent.current) return;
    const target = hovered ? 1.05 : 0.42;
    accent.current.intensity += (target - accent.current.intensity) * (1 - Math.exp(-delta * 2.5));
    if (Math.abs(target - accent.current.intensity) > 0.01) invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.85} color="#f4e8d5" />
      <hemisphereLight args={["#fff6e8", "#756754", 0.7]} />
      <directionalLight
        castShadow
        position={[-3.5, 6, 5]}
        intensity={2.2}
        color="#fff0d9"
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <directionalLight position={[3.8, 3.6, -2.2]} intensity={1.1} color="#aeb6a1" />
      <pointLight ref={accent} position={[1.8, 2.7, 2.2]} intensity={0.42} color="#cdb58e" distance={7} />
    </>
  );
}
