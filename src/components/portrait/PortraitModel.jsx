

import { useMemo, useRef } from "react";
import { CatmullRomCurve3, ExtrudeGeometry, Shape, TubeGeometry, Vector3 } from "three";
import PortraitControls from "./PortraitControls.jsx";

function createBustGeometry() {
  const shape = new Shape();
  shape.moveTo(-1.35, 0);
  shape.bezierCurveTo(-1.34, 0.37, -1.13, 0.66, -0.78, 0.79);
  shape.bezierCurveTo(-0.55, 0.9, -0.4, 0.96, -0.24, 0.9);
  shape.lineTo(0, 0.64);
  shape.lineTo(0.24, 0.9);
  shape.bezierCurveTo(0.4, 0.96, 0.55, 0.9, 0.78, 0.79);
  shape.bezierCurveTo(1.13, 0.66, 1.34, 0.37, 1.35, 0);
  shape.closePath();

  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.72,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: 0.12,
    bevelThickness: 0.12,
  });
  geometry.translate(0, 0, -0.36);
  return geometry;
}

function createTube(points, radius, segments = 48) {
  const curve = new CatmullRomCurve3(points.map((point) => new Vector3(...point)));
  return new TubeGeometry(curve, segments, radius, 8, false);
}

function PortraitStrand({ points, color = "#302a27" }) {
  const geometry = useMemo(() => createTube(points, 0.027), [points]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.48} />
    </mesh>
  );
}

function GlassesFrame({ x }) {
  const frameGeometry = useMemo(() => {
    const width = 0.37;
    const height = 0.25;
    const radius = 0.06;
    const points = [
      [-width / 2 + radius, height / 2, 0],
      [width / 2 - radius, height / 2, 0],
      [width / 2, height / 2 - radius, 0],
      [width / 2, -height / 2 + radius, 0],
      [width / 2 - radius, -height / 2, 0],
      [-width / 2 + radius, -height / 2, 0],
      [-width / 2, -height / 2 + radius, 0],
      [-width / 2, height / 2 - radius, 0],
    ];
    const curve = new CatmullRomCurve3(
      points.map(([px, py, pz]) => new Vector3(px, py, pz)),
      true,
      "centripetal",
      0.25,
    );
    return new TubeGeometry(curve, 56, 0.014, 8, true);
  }, []);

  return (
    <mesh geometry={frameGeometry} position={[x, 2.73, 0.708]}>
      <meshStandardMaterial color="#77745e" metalness={0.54} roughness={0.34} />
    </mesh>
  );
}

function SweaterStripe({ y }) {
  const geometry = useMemo(
    () => createTube([
      [-1.14, y - 0.025, 0.43],
      [-0.62, y + 0.015, 0.49],
      [0, y + 0.035, 0.51],
      [0.62, y + 0.015, 0.49],
      [1.14, y - 0.025, 0.43],
    ], 0.022, 36),
    [y],
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#e7e0d2" roughness={0.78} />
    </mesh>
  );
}

function PortraitHair() {
  return (
    <>
      <mesh position={[0, 2.48, -0.36]} scale={[0.84, 1.1, 0.58]}>
        <sphereGeometry args={[1, 40, 32]} />
        <meshStandardMaterial color="#171513" roughness={0.38} />
      </mesh>
      <mesh position={[0, 2.55, -0.17]} scale={[0.83, 1.04, 0.65]}>
        <sphereGeometry args={[1, 48, 36, 0, Math.PI * 2, 0, 0.95]} />
        <meshStandardMaterial color="#211c19" roughness={0.42} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.72, 1.92, -0.08]}
          rotation={[0, 0, side * -0.08]}
          scale={[0.72, 1.02, 0.72]}
        >
          <capsuleGeometry args={[0.19, 1.38, 6, 14]} />
          <meshStandardMaterial color="#171513" roughness={0.42} />
        </mesh>
      ))}
      <PortraitStrand points={[[-0.48, 3.2, 0.3], [-0.65, 2.82, 0.51], [-0.73, 2.28, 0.52], [-0.63, 1.28, 0.29]]} />
      <PortraitStrand points={[[0.48, 3.2, 0.3], [0.65, 2.82, 0.51], [0.73, 2.28, 0.52], [0.63, 1.28, 0.29]]} />
      <PortraitStrand points={[[-0.03, 3.5, 0.23], [-0.08, 3.34, 0.48], [-0.23, 3.16, 0.59], [-0.46, 3.08, 0.54]]} color="#332d29" />
      <PortraitStrand points={[[0.03, 3.5, 0.23], [0.14, 3.34, 0.48], [0.31, 3.17, 0.59], [0.5, 3.1, 0.52]]} color="#332d29" />
    </>
  );
}

function PortraitFace() {
  return (
    <group>
      <mesh position={[0, 2.57, 0.05]} scale={[0.69, 0.95, 0.65]}>
        <sphereGeometry args={[1, 48, 40]} />
        <meshPhysicalMaterial color="#aa7762" roughness={0.72} clearcoat={0.08} clearcoatRoughness={0.7} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.7, 2.55, 0.08]} scale={[0.14, 0.2, 0.12]}>
            <sphereGeometry args={[1, 24, 20]} />
            <meshStandardMaterial color="#b47b60" roughness={0.76} />
          </mesh>
          <mesh position={[side * 0.23, 2.73, 0.61]} scale={[0.102, 0.05, 0.038]}>
            <sphereGeometry args={[1, 28, 20]} />
            <meshStandardMaterial color="#efe4d5" roughness={0.44} />
          </mesh>
          <mesh position={[side * 0.23, 2.73, 0.65]} scale={[0.033, 0.036, 0.02]}>
            <sphereGeometry args={[1, 20, 16]} />
            <meshStandardMaterial color="#574437" roughness={0.4} />
          </mesh>
          <mesh position={[side * 0.23, 2.73, 0.669]} scale={[0.016, 0.024, 0.012]}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshStandardMaterial color="#211d1a" roughness={0.32} />
          </mesh>
          <mesh position={[side * 0.23, 2.86, 0.59]} rotation={[0, 0, Math.PI / 2 + side * -0.08]}>
            <capsuleGeometry args={[0.014, 0.17, 4, 10]} />
            <meshStandardMaterial color="#49352d" roughness={0.68} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.5, 0.65]} scale={[0.085, 0.19, 0.12]}>
        <sphereGeometry args={[1, 24, 20]} />
        <meshStandardMaterial color="#aa7762" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.4, 0.75]} scale={[0.1, 0.065, 0.085]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#aa7762" roughness={0.68} />
      </mesh>
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 2.37, 0.826]} scale={[0.018, 0.01, 0.009]}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#805742" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 2.21, 0.633]} scale={[0.15, 0.035, 0.03]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#8f584e" roughness={0.56} />
      </mesh>
      <mesh position={[0, 2.175, 0.638]} scale={[0.11, 0.02, 0.023]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#b9816a" roughness={0.55} />
      </mesh>
      <GlassesFrame x={-0.23} />
      <GlassesFrame x={0.23} />
      <mesh position={[0, 2.73, 0.708]}>
        <boxGeometry args={[0.1, 0.021, 0.022]} />
        <meshStandardMaterial color="#77745e" metalness={0.54} roughness={0.34} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.425, 2.72, 0.48]} rotation={[0, side * 0.32, side * 0.06]}>
          <boxGeometry args={[0.28, 0.02, 0.02]} />
          <meshStandardMaterial color="#77745e" metalness={0.54} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function PortraitBust({ reducedMotion, hovered }) {
  const bodyRef = useRef(null);
  const headRef = useRef(null);
  const geometry = useMemo(createBustGeometry, []);

  return (
    <group ref={bodyRef}>
      <mesh geometry={geometry} position={[0, 0.16, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#24231f" roughness={0.88} />
      </mesh>
      {[0.27, 0.47, 0.67].map((y) => <SweaterStripe key={y} y={y} />)}
      <mesh position={[0, 1.35, 0.02]} castShadow>
        <cylinderGeometry args={[0.23, 0.29, 1.1, 32]} />
        <meshPhysicalMaterial color="#b98166" roughness={0.72} clearcoat={0.08} />
      </mesh>
      <group ref={headRef} position={[0, 2.2, 0]}>
        <group position={[0, -2.2, 0]}>
          <PortraitHair />
          <PortraitFace />
        </group>
      </group>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <cylinderGeometry args={[1.18, 1.25, 0.2, 64]} />
        <meshStandardMaterial color="#b6a58b" roughness={0.38} metalness={0.14} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[1.13, 1.18, 0.035, 64]} />
        <meshStandardMaterial color="#6e7458" roughness={0.4} metalness={0.18} />
      </mesh>
      <PortraitControls
        bodyRef={bodyRef}
        headRef={headRef}
        reducedMotion={reducedMotion}
        hovered={hovered}
      />
    </group>
  );
}

export default function PortraitModel({ reducedMotion, hovered }) {
  const outerArch = useMemo(
    () => createTube([[-1.62, 0.2, -0.82], [-1.62, 3.25, -0.82], [-1.34, 3.86, -0.82], [0, 4.12, -0.82], [1.34, 3.86, -0.82], [1.62, 3.25, -0.82], [1.62, 0.2, -0.82]], 0.035, 80),
    [],
  );
  const innerArch = useMemo(
    () => createTube([[-1.43, 0.2, -0.8], [-1.43, 3.16, -0.8], [-1.16, 3.67, -0.8], [0, 3.9, -0.8], [1.16, 3.67, -0.8], [1.43, 3.16, -0.8], [1.43, 0.2, -0.8]], 0.012, 80),
    [],
  );

  return (
    <>
      <mesh position={[0, 0, -1.3]} geometry={outerArch}>
        <meshStandardMaterial color="#776f59" roughness={0.52} />
      </mesh>
      <mesh position={[0, 0, -1.28]} geometry={innerArch}>
        <meshStandardMaterial color="#b69c76" roughness={0.42} metalness={0.2} />
      </mesh>
      <PortraitBust reducedMotion={reducedMotion} hovered={hovered} />
    </>
  );
}
