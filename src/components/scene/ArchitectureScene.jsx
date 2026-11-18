import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Path, Shape, Vector3 } from "three";

function archShape(width, height) {
  const shape = new Shape();
  const half = width / 2;
  const spring = height * 0.62;
  shape.moveTo(-half, -height / 2);
  shape.lineTo(-half, spring - height / 2);
  shape.quadraticCurveTo(-half, height / 2, 0, height / 2);
  shape.quadraticCurveTo(half, height / 2, half, spring - height / 2);
  shape.lineTo(half, -height / 2);
  shape.closePath();
  return shape;
}

function ArchOpening({ position }) {
  const frame = useMemo(() => {
    const shape = archShape(1.48, 2.65);
    const hole = new Path();
    const inset = 0.09;
    const inner = archShape(1.48 - inset * 2, 2.65 - inset * 2);
    hole.curves = inner.curves;
    hole.currentPoint.copy(inner.currentPoint);
    shape.holes.push(hole);
    return shape;
  }, []);
  const glass = useMemo(() => archShape(1.25, 2.42), []);

  return (
    <group position={position}>
      <mesh position={[0, 0, 0.012]}>
        <shapeGeometry args={[glass]} />
        <meshStandardMaterial color="#727d71" roughness={0.45} />
      </mesh>
      <mesh>
        <shapeGeometry args={[frame]} />
        <meshStandardMaterial color="#b49e7c" roughness={0.72} side={2} />
      </mesh>
      <mesh position={[0, -0.15, 0.03]}>
        <boxGeometry args={[0.035, 2.16, 0.025]} />
        <meshStandardMaterial color="#e5ddce" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.54, 0.03]}>
        <boxGeometry args={[1.18, 0.035, 0.025]} />
        <meshStandardMaterial color="#e5ddce" roughness={0.6} />
      </mesh>
    </group>
  );
}

function RoomScene() {
  const { camera, mouse } = useThree();
  const focus = useMemo(() => new Vector3(0, 1.15, 0), []);

  useFrame((_, delta) => {
    const ease = 1 - Math.exp(-delta * 1.7);
    camera.position.x += (6.6 + mouse.x * 0.22 - camera.position.x) * ease;
    camera.position.y += (4.4 + mouse.y * 0.12 - camera.position.y) * ease;
    camera.lookAt(focus);
  });

  return (
    <>
      <color attach="background" args={["#d9d4ca"]} />
      <ambientLight intensity={1.45} />
      <directionalLight position={[-3, 7, 4]} intensity={3.1} color="#fff4df" />
      <directionalLight position={[4, 3, -1]} intensity={0.6} color="#b7c1ad" />

      <mesh receiveShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[7.4, 0.16, 7.8]} />
        <meshStandardMaterial color="#c3b9a8" roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.12, -3.82]}>
        <boxGeometry args={[7.4, 4.25, 0.16]} />
        <meshStandardMaterial color="#ede7dc" roughness={0.94} />
      </mesh>
      <mesh position={[-3.62, 2.12, 0]}>
        <boxGeometry args={[0.16, 4.25, 7.8]} />
        <meshStandardMaterial color="#ded8cd" roughness={0.92} />
      </mesh>

      {[-2.15, -0.55, 1.05].map((x) => (
        <ArchOpening key={x} position={[x, 2.05, -3.72]} />
      ))}

      <mesh receiveShadow position={[0, 0.035, 1.25]}>
        <boxGeometry args={[4.5, 0.025, 3.2]} />
        <meshStandardMaterial color="#8f8a73" roughness={1} />
      </mesh>

      <group position={[-0.45, 0, 0.42]}>
        <mesh castShadow position={[0, 0.43, -0.52]}>
          <boxGeometry args={[2.8, 0.28, 0.72]} />
          <meshStandardMaterial color="#6e6a58" roughness={0.86} />
        </mesh>
        <mesh castShadow position={[0, 0.88, -0.83]}>
          <boxGeometry args={[2.8, 0.72, 0.16]} />
          <meshStandardMaterial color="#817d69" roughness={0.9} />
        </mesh>
        {[-0.9, 0, 0.9].map((x) => (
          <mesh key={x} castShadow position={[x, 0.62, -0.06]}>
            <boxGeometry args={[0.75, 0.18, 0.62]} />
            <meshStandardMaterial color="#aaa38d" roughness={0.95} />
          </mesh>
        ))}
      </group>

      <group position={[0.52, 0, 1.58]}>
        <mesh castShadow position={[0, 0.72, 0]}>
          <boxGeometry args={[1.48, 0.13, 0.82]} />
          <meshStandardMaterial color="#8c7358" roughness={0.46} />
        </mesh>
        {[[-0.58, -0.3], [0.58, -0.3], [-0.58, 0.3], [0.58, 0.3]].map(([x, z]) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, 0.35, z]}>
            <boxGeometry args={[0.055, 0.68, 0.055]} />
            <meshStandardMaterial color="#564b3e" roughness={0.52} />
          </mesh>
        ))}
      </group>

      <group position={[2.55, 0, -0.15]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.9, 10]} />
          <meshStandardMaterial color="#9b8261" roughness={0.82} />
        </mesh>
        <mesh castShadow position={[0, 1.25, 0]}>
          <sphereGeometry args={[0.58, 9, 7]} />
          <meshStandardMaterial color="#78806a" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[-0.32, 1.6, -0.05]}>
          <sphereGeometry args={[0.38, 8, 6]} />
          <meshStandardMaterial color="#858b72" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0.32, 1.74, 0.04]}>
          <sphereGeometry args={[0.36, 8, 6]} />
          <meshStandardMaterial color="#69765f" roughness={0.9} />
        </mesh>
      </group>
    </>
  );
}

export default function ArchitectureScene() {
  return (
    <Canvas
      camera={{ position: [6.6, 4.4, 7.5], fov: 34 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute("aria-label", "Interactive conceptual interior study");
      }}
    >
      <RoomScene />
    </Canvas>
  );
}
