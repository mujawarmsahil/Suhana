import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import PortraitLighting from "./PortraitLighting.jsx";
import PortraitModel from "./PortraitModel.jsx";

function PortraitCamera() {
  const { camera, invalidate } = useThree();

  useEffect(() => {
    camera.lookAt(0, 2.05, 0);
    invalidate();
  }, [camera, invalidate]);

  return null;
}

export default function PortraitScene({ reducedMotion, hovered }) {
  return (
    <>
      <color attach="background" args={["#d9d4ca"]} />
      <PortraitCamera />
      <PortraitLighting hovered={hovered} />
      <mesh position={[0, -0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#d9d4ca" roughness={0.94} />
      </mesh>
      <PortraitModel reducedMotion={reducedMotion} hovered={hovered} />
    </>
  );
}
