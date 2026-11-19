

import { useMemo, useRef } from "react";
import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Shape,
  TubeGeometry,
  Vector3,
  Float32BufferAttribute,
} from "three";
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

function createFaceGeometry() {
  const segments = 64;
  const rows = 64;
  const width = 0.73;
  const height = 0.84;
  const depth = 0.65;
  const positions = [];
  const indices = [];

  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    const y = 1 - 2 * v;
    const jawTaper = 1 - 0.14 * Math.max(0, -y);
    const rowWidth = Math.sqrt(Math.max(0, 1 - y * y)) * jawTaper;
    for (let column = 0; column <= segments; column += 1) {
      const u = column / segments;
      const x = (2 * u - 1) * rowWidth;
      positions.push(x * width, y * height, depth * Math.sqrt(Math.max(0, 1 - x * x - y * y)));
      if (row < rows && column < segments) {
        const index = row * (segments + 1) + column;
        indices.push(index, index + segments + 1, index + 1);
        indices.push(index + 1, index + segments + 1, index + segments + 2);
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function faceSurfaceZ(x, y) {
  const width = 0.73;
  const height = 0.84;
  const depth = 0.65;
  const vertical = (y - 2.57) / height;
  const jawTaper = 1 - 0.14 * Math.max(0, -vertical);
  const horizontal = x / (width * jawTaper);
  return 0.05 + depth * Math.sqrt(Math.max(0, 1 - horizontal * horizontal - vertical * vertical));
}

function PortraitCurve({ points, color, radius }) {
  const geometry = useMemo(() => createTube(points, radius, 32), [points, radius]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.64} />
    </mesh>
  );
}

function GlassesFrame({ centerX }) {
  const geometry = useMemo(() => {
    const width = 0.43;
    const height = 0.24;
    const radius = 0.065;
    const outline = [
      [-width / 2 + radius, height / 2],
      [width / 2 - radius, height / 2],
      [width / 2, height / 2 - radius],
      [width / 2, -height / 2 + radius],
      [width / 2 - radius, -height / 2],
      [-width / 2 + radius, -height / 2],
      [-width / 2, -height / 2 + radius],
      [-width / 2, height / 2 - radius],
    ].map(([x, y]) => {
      const px = centerX + x;
      const py = 2.74 + y;
      return new Vector3(px, py, faceSurfaceZ(px, py) + 0.025);
    });
    const curve = new CatmullRomCurve3(outline, true, "centripetal", 0.25);
    return new TubeGeometry(curve, 64, 0.011, 8, true);
  }, [centerX]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#b4a69e" metalness={0.18} roughness={0.32} />
    </mesh>
  );
}

function PortraitEye({ side }) {
  const x = side * 0.23;
  const y = 2.73;
  const z = faceSurfaceZ(x, y);
  const upperLid = [
    [x - 0.1, y + 0.005, faceSurfaceZ(x - 0.1, y + 0.005) + 0.025],
    [x, y + 0.05, faceSurfaceZ(x, y + 0.05) + 0.025],
    [x + 0.1, y + 0.005, faceSurfaceZ(x + 0.1, y + 0.005) + 0.025],
  ];
  const eyebrow = [
    [x - 0.12, y + 0.15, faceSurfaceZ(x - 0.12, y + 0.15) + 0.025],
    [x, y + 0.19, faceSurfaceZ(x, y + 0.19) + 0.025],
    [x + 0.12, y + 0.15, faceSurfaceZ(x + 0.12, y + 0.15) + 0.025],
  ];

  return (
    <group>
      <mesh position={[x, y, z + 0.02]} scale={[0.085, 0.039, 0.026]}>
        <sphereGeometry args={[1, 28, 20]} />
        <meshStandardMaterial color="#e8ddd0" roughness={0.5} />
      </mesh>
      <mesh position={[x + side * 0.004, y, z + 0.048]} scale={[0.027, 0.03, 0.014]}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial color="#694b3b" roughness={0.45} />
      </mesh>
      <mesh position={[x + side * 0.004, y, z + 0.06]} scale={[0.012, 0.019, 0.008]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color="#211d1a" roughness={0.38} />
      </mesh>
      <mesh position={[x - 0.007, y + 0.012, z + 0.067]} scale={[0.006, 0.006, 0.004]}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshBasicMaterial color="#fff8eb" />
      </mesh>
      <PortraitCurve points={upperLid} color="#68493d" radius={0.009} />
      <PortraitCurve points={eyebrow} color="#382b25" radius={0.018} />
    </group>
  );
}

function SweaterStripe({ y }) {
  const geometry = useMemo(
    () => createTube([
      [-1.14, y - 0.025, 0.43],
      [-0.62, y + 0.035, 0.49],
      [0, y + 0.055, 0.51],
      [0.62, y + 0.025, 0.49],
      [1.14, y - 0.055, 0.43],
    ], 0.016, 36),
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
      <mesh position={[0, 2.63, -0.04]} scale={[0.79, 0.94, 0.72]}>
        <sphereGeometry args={[1, 48, 36, 0, Math.PI * 2, 0, 1.28]} />
        <meshStandardMaterial color="#211c19" roughness={0.42} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (side === 1 ? 0.72 : 0.68), 1.5, -0.12]}
          rotation={[0, 0, side * -0.08]}
          scale={[0.72, 1, 0.68]}
        >
          <capsuleGeometry args={[0.14, 2, 6, 14]} />
          <meshStandardMaterial color="#171513" roughness={0.42} />
        </mesh>
      ))}
      <PortraitCurve
        points={[[0, 3.56, 0.1], [-0.03, 3.38, 0.42], [-0.17, 3.18, 0.58], [-0.39, 3.08, 0.54]]}
        color="#302a27"
        radius={0.017}
      />
      <PortraitCurve
        points={[[0, 3.56, 0.1], [0.03, 3.38, 0.42], [0.17, 3.18, 0.58], [0.39, 3.08, 0.54]]}
        color="#302a27"
        radius={0.017}
      />
    </>
  );
}

function PortraitFace() {
  const geometry = useMemo(createFaceGeometry, []);
  return (
    <group>
      <mesh geometry={geometry} position={[0, 2.57, 0.05]}>
        <meshPhysicalMaterial color="#b77e68" roughness={0.76} clearcoat={0.06} clearcoatRoughness={0.8} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.7, 2.54, faceSurfaceZ(side * 0.7, 2.54) - 0.015]}
            scale={[0.12, 0.18, 0.085]}
          >
            <sphereGeometry args={[1, 24, 20]} />
            <meshStandardMaterial color="#b77e68" roughness={0.76} />
          </mesh>
          <PortraitEye side={side} />
          <GlassesFrame centerX={side * 0.23} />
        </group>
      ))}
      <mesh position={[0, 2.74, faceSurfaceZ(0, 2.74) + 0.025]}>
        <boxGeometry args={[0.09, 0.014, 0.014]} />
        <meshStandardMaterial color="#b4a69e" metalness={0.18} roughness={0.32} />
      </mesh>
      <PortraitCurve
        points={[
          [-0.16, 2.74, faceSurfaceZ(-0.16, 2.74) + 0.028],
          [0, 2.72, faceSurfaceZ(0, 2.72) + 0.028],
          [0.16, 2.74, faceSurfaceZ(0.16, 2.74) + 0.028],
        ]}
        color="#b77e68"
        radius={0.022}
      />
      <mesh position={[0, 2.48, faceSurfaceZ(0, 2.48) + 0.04]} scale={[0.052, 0.13, 0.065]}>
        <sphereGeometry args={[1, 28, 24]} />
        <meshStandardMaterial color="#bd8770" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.37, faceSurfaceZ(0, 2.37) + 0.075]} scale={[0.075, 0.052, 0.055]}>
        <sphereGeometry args={[1, 28, 20]} />
        <meshStandardMaterial color="#bd8770" roughness={0.68} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.035, 2.35, faceSurfaceZ(side * 0.035, 2.35) + 0.11]}
          scale={[0.012, 0.007, 0.006]}
        >
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color="#805742" roughness={0.8} />
        </mesh>
      ))}
      <PortraitCurve
        points={[
          [-0.15, 2.19, faceSurfaceZ(-0.15, 2.19) + 0.025],
          [-0.08, 2.16, faceSurfaceZ(-0.08, 2.16) + 0.025],
          [0, 2.155, faceSurfaceZ(0, 2.155) + 0.025],
          [0.08, 2.16, faceSurfaceZ(0.08, 2.16) + 0.025],
          [0.15, 2.19, faceSurfaceZ(0.15, 2.19) + 0.025],
        ]}
        color="#805147"
        radius={0.014}
      />
      <PortraitCurve
        points={[
          [-0.09, 2.125, faceSurfaceZ(-0.09, 2.125) + 0.025],
          [0, 2.11, faceSurfaceZ(0, 2.11) + 0.025],
          [0.09, 2.125, faceSurfaceZ(0.09, 2.125) + 0.025],
        ]}
        color="#c28d78"
        radius={0.009}
      />
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
      {[0.16, 0.31, 0.46, 0.61, 0.76].map((y) => <SweaterStripe key={y} y={y} />)}
      <mesh position={[0, 1.38, 0.02]} castShadow>
        <cylinderGeometry args={[0.23, 0.29, 0.76, 32]} />
        <meshPhysicalMaterial color="#b98166" roughness={0.72} clearcoat={0.08} />
      </mesh>
      <group ref={headRef} position={[0, 2.2, 0]} rotation={[0, -0.08, 0.035]}>
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
