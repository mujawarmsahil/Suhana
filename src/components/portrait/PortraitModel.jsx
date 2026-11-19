

import { useEffect, useMemo, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import {
  CanvasTexture,
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Shape,
  SRGBColorSpace,
  TextureLoader,
  TubeGeometry,
  Vector3,
} from "three";
import portraitReference from "../../../images/portrait-suhana.jpg";
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
  const uvs = [];
  const indices = [];

  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows;
    const y = 1 - 2 * v;
    const rowWidth = Math.sqrt(Math.max(0, 1 - y * y));
    for (let column = 0; column <= segments; column += 1) {
      const u = column / segments;
      const x = (2 * u - 1) * rowWidth;
      positions.push(x * width, y * height, depth * Math.sqrt(Math.max(0, 1 - x * x - y * y)));
      uvs.push(u, 1 - v);
      if (row < rows && column < segments) {
        const index = row * (segments + 1) + column;
        indices.push(index, index + segments + 1, index + 1);
        indices.push(index + 1, index + segments + 1, index + segments + 2);
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
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
    </>
  );
}

function PortraitFace() {
  const source = useLoader(TextureLoader, portraitReference);
  const geometry = useMemo(createFaceGeometry, []);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to create the portrait face texture.");
    context.beginPath();
    context.ellipse(256, 256, 256, 256, 0, 0, Math.PI * 2);
    context.clip();
    context.drawImage(source.image, 260, 55, 360, 370, 0, 0, 512, 512);
    const faceTexture = new CanvasTexture(canvas);
    faceTexture.colorSpace = SRGBColorSpace;
    return faceTexture;
  }, [source]);

  useEffect(() => () => {
    geometry.dispose();
    texture.dispose();
  }, [geometry, texture]);

  return (
    <mesh geometry={geometry} position={[0, 2.57, 0.05]}>
      <meshPhysicalMaterial map={texture} roughness={0.78} clearcoat={0.06} clearcoatRoughness={0.8} />
    </mesh>
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
