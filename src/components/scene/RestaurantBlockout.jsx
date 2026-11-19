import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useEffect, useMemo, useState } from "react";

const zoneColors = {
  dining: "#7a8061",
  bar: "#a3634b",
  reception: "#b18b5c",
  entrance: "#8a927c",
};

const inspectableObjects = [
  { id: "fountain", label: "Central fountain", zoneId: "dining" },
  { id: "jali-main", label: "Main jali divider", zoneId: "dining" },
  { id: "jali-side", label: "Side jali divider", zoneId: "dining" },
  { id: "bar-counter", label: "Bar counter", zoneId: "bar" },
  { id: "reception-counter", label: "Reception counter", zoneId: "reception" },
  { id: "timber-column", label: "Timber column", zoneId: "dining" },
  ...Array.from({ length: 4 }, (_, index) => ({
    id: `arch-${index + 1}`,
    label: `Arched window ${index + 1}`,
    zoneId: "dining",
  })),
  ...Array.from({ length: 8 }, (_, index) => ({
    id: `dining-table-${index + 1}`,
    label: `Dining table ${index + 1}`,
    zoneId: "dining",
  })),
];

function Block({ position, size, color, roughness = 0.82, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

function SelectableObject({
  id,
  label,
  zoneId,
  position,
  rotation,
  activeObjectId,
  onSelectObject,
  ringRadius = 0.9,
  ringY = 0.055,
  children,
}) {
  const { gl } = useThree();
  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => {
        gl.domElement.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        gl.domElement.style.cursor = "";
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelectObject(id, label, zoneId);
      }}
    >
      {children}
      {activeObjectId === id && (
        <mesh position={[0, ringY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ringRadius - 0.06, ringRadius, 40]} />
          <meshBasicMaterial color="#a3634b" transparent opacity={0.9} depthTest={false} />
        </mesh>
      )}
    </group>
  );
}

function ZoneFloor({ id, position, size, activeZoneId, onSelectZone }) {
  const active = id === activeZoneId;
  return (
    <mesh
      position={[position[0], 0.035, position[1]]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelectZone(id);
      }}
    >
      <planeGeometry args={size} />
      <meshBasicMaterial
        color={zoneColors[id]}
        transparent
        opacity={active ? 0.48 : 0.015}
        depthWrite={false}
      />
    </mesh>
  );
}

function DiningTable({ id, index, position, activeObjectId, onSelectObject }) {
  return (
    <SelectableObject
      id={id}
      label={`Dining table ${index + 1}`}
      zoneId="dining"
      position={position}
      activeObjectId={activeObjectId}
      onSelectObject={onSelectObject}
      ringRadius={0.85}
    >
      <Block position={[0, 0.72, 0]} size={[1.15, 0.12, 0.82]} color="#e3d6c1" roughness={0.35} />
      {[-0.47, 0.47].flatMap((x) =>
        [-0.31, 0.31].map((z) => (
          <Block
            key={`${x}-${z}`}
            position={[x, 0.36, z]}
            size={[0.07, 0.66, 0.07]}
            color="#73543a"
            roughness={0.52}
          />
        )),
      )}
      {[
        [0, 0, -0.72],
        [0, 0, 0.72],
      ].map(([x, y, z]) => (
        <group key={z} position={[x, y, z]}>
          <Block position={[0, 0.48, 0]} size={[0.58, 0.1, 0.5]} color="#c8b99f" />
          <Block position={[0, 0.82, z < 0 ? -0.21 : 0.21]} size={[0.58, 0.64, 0.09]} color="#a8997f" />
          <Block position={[-0.23, 0.23, 0]} size={[0.06, 0.46, 0.06]} color="#73543a" />
          <Block position={[0.23, 0.23, 0]} size={[0.06, 0.46, 0.06]} color="#73543a" />
        </group>
      ))}
    </SelectableObject>
  );
}

function JaliScreen({ id, label, position, length, rotation = 0, activeObjectId, onSelectObject }) {
  const slatCount = Math.floor(length / 0.3);
  return (
    <SelectableObject
      id={id}
      label={label}
      zoneId="dining"
      position={position}
      rotation={[0, rotation, 0]}
      activeObjectId={activeObjectId}
      onSelectObject={onSelectObject}
      ringRadius={length / 2 + 0.2}
    >
      {Array.from({ length: slatCount + 1 }, (_, index) => {
        const x = -length / 2 + (length / slatCount) * index;
        return (
          <Block
            key={`vertical-${index}`}
            position={[x, 0.78, 0]}
            size={[0.075, 1.55, 0.075]}
            color="#755235"
            roughness={0.55}
          />
        );
      })}
      {[0.25, 0.72, 1.18].map((y) => (
        <Block
          key={y}
          position={[0, y, 0]}
          size={[length, 0.075, 0.09]}
          color="#a17c51"
          roughness={0.5}
        />
      ))}
    </SelectableObject>
  );
}

function Fountain({ activeObjectId, onSelectObject }) {
  return (
    <SelectableObject
      id="fountain"
      label="Central fountain"
      zoneId="dining"
      position={[-1.2, 0, -0.2]}
      activeObjectId={activeObjectId}
      onSelectObject={onSelectObject}
      ringRadius={1.05}
    >
      <mesh position={[0, 0.19, 0]} castShadow>
        <cylinderGeometry args={[0.84, 0.95, 0.38, 32]} />
        <meshStandardMaterial color="#b4a58c" roughness={0.32} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.035, 32]} />
        <meshStandardMaterial color="#718483" roughness={0.2} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.43, 0.52, 0.2, 28]} />
        <meshStandardMaterial color="#c2b49b" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.025, 28]} />
        <meshStandardMaterial color="#788a85" roughness={0.2} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.24, 0.25, 20]} />
        <meshStandardMaterial color="#b8a27f" roughness={0.42} metalness={0.18} />
      </mesh>
    </SelectableObject>
  );
}

function Bar({ activeObjectId, onSelectObject }) {
  return (
    <SelectableObject
      id="bar-counter"
      label="Bar counter"
      zoneId="bar"
      position={[-3.4, 0, -3.65]}
      activeObjectId={activeObjectId}
      onSelectObject={onSelectObject}
      ringRadius={2.25}
    >
      <Block position={[0, 0.58, 0]} size={[4.2, 0.96, 0.64]} color="#68472f" />
      <Block position={[0, 1.1, 0.02]} size={[4.35, 0.13, 0.78]} color="#d5c7b1" roughness={0.35} />
      <Block position={[0, 1.35, -0.28]} size={[3.65, 0.48, 0.12]} color="#292725" />
      {[-1.25, -0.42, 0.42, 1.25].map((x) => (
        <group key={x} position={[x, 0, 0.84]}>
          <mesh position={[0, 0.66, 0]} castShadow>
            <cylinderGeometry args={[0.23, 0.23, 0.1, 16]} />
            <meshStandardMaterial color="#6e3728" roughness={0.48} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.055, 0.07, 0.62, 10]} />
            <meshStandardMaterial color="#8f7048" metalness={0.42} roughness={0.42} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.19, 0.19, 0.045, 16]} />
            <meshStandardMaterial color="#8f7048" metalness={0.42} roughness={0.42} />
          </mesh>
        </group>
      ))}
    </SelectableObject>
  );
}

function Reception({ activeObjectId, onSelectObject }) {
  return (
    <SelectableObject
      id="reception-counter"
      label="Reception counter"
      zoneId="reception"
      position={[-4.8, 0, 2.55]}
      activeObjectId={activeObjectId}
      onSelectObject={onSelectObject}
      ringRadius={1.6}
    >
      <Block position={[0, 0.54, 0]} size={[2.75, 1.05, 0.9]} color="#735037" />
      <Block position={[0, 1.1, 0]} size={[2.9, 0.14, 1]} color="#d8cbb8" roughness={0.34} />
      <Block position={[0, 0.08, 0.47]} size={[2.72, 0.12, 0.045]} color="#b98e54" roughness={0.42} />
    </SelectableObject>
  );
}

function ArchWindow({ id, index, position, activeObjectId, onSelectObject }) {
  return (
    <SelectableObject
      id={id}
      label={`Arched window ${index + 1}`}
      zoneId="dining"
      position={position}
      activeObjectId={activeObjectId}
      onSelectObject={onSelectObject}
      ringRadius={0.8}
      ringY={-0.35}
    >
      <Block position={[0, 0.82, 0]} size={[1.05, 1.64, 0.08]} color="#7b6550" />
      <Block position={[0, 0.73, 0.055]} size={[0.8, 1.42, 0.03]} color="#768378" roughness={0.28} />
      <Block position={[0, 0.68, 0.08]} size={[0.045, 1.25, 0.025]} color="#d3c4aa" />
      <Block position={[0, 0.42, 0.08]} size={[0.72, 0.04, 0.025]} color="#d3c4aa" />
      <mesh position={[0, 1.51, 0]}>
        <torusGeometry args={[0.42, 0.055, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#7b6550" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0.04]}>
        <torusGeometry args={[0.34, 0.025, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#d3c4aa" roughness={0.45} />
      </mesh>
    </SelectableObject>
  );
}

function RestaurantLayout({ activeZoneId, onSelectZone, activeObjectId, onSelectObject }) {
  const tables = [
    [-4.5, 0, -1.55],
    [-2.7, 0, -1.55],
    [0.2, 0, -1.55],
    [1.95, 0, -1.55],
    [-4.5, 0, 1.45],
    [-2.7, 0, 1.45],
    [0.2, 0, 1.45],
    [1.95, 0, 1.45],
  ];

  return (
    <>
      <color attach="background" args={["#ded9cf"]} />
      <ambientLight intensity={1.35} />
      <hemisphereLight args={["#fff6e8", "#85755f", 1.2]} />
      <directionalLight position={[-5, 12, 7]} intensity={2.2} color="#fff1d7" />

      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[15, 0.24, 10.6]} />
        <meshStandardMaterial color="#d6ccba" roughness={0.52} />
      </mesh>

      <ZoneFloor id="dining" position={[-1.2, -0.2]} size={[7.6, 5.7]} activeZoneId={activeZoneId} onSelectZone={onSelectZone} />
      <ZoneFloor id="bar" position={[-3.4, -3.65]} size={[4.9, 1.45]} activeZoneId={activeZoneId} onSelectZone={onSelectZone} />
      <ZoneFloor id="reception" position={[-4.8, 2.55]} size={[3.7, 2.15]} activeZoneId={activeZoneId} onSelectZone={onSelectZone} />
      <ZoneFloor id="entrance" position={[-0.4, 4.65]} size={[4.3, 1.15]} activeZoneId={activeZoneId} onSelectZone={onSelectZone} />

      <Block position={[0, 0.75, -5.25]} size={[15, 1.5, 0.18]} color="#d7ccba" />
      <Block position={[-7.42, 0.75, 0]} size={[0.18, 1.5, 10.5]} color="#d7ccba" />
      <Block position={[7.42, 0.75, 0]} size={[0.18, 1.5, 10.5]} color="#d7ccba" />
      <Block position={[-6.2, 0.75, 5.18]} size={[2.5, 1.5, 0.18]} color="#d7ccba" />
      <Block position={[5.75, 0.75, 5.18]} size={[3.35, 1.5, 0.18]} color="#d7ccba" />

      {[-6.2, 5.9].map((x) => (
        <Block key={x} position={[x, 1.45, -5.1]} size={[0.32, 2.85, 0.32]} color="#79583b" roughness={0.62} />
      ))}
      {[-4.8, -2.35, 0.1, 2.55].map((x, index) => (
        <ArchWindow
          key={x}
          id={`arch-${index + 1}`}
          index={index}
          position={[x, 0.4, -5.13]}
          activeObjectId={activeObjectId}
          onSelectObject={onSelectObject}
        />
      ))}

      <Block position={[2.35, 0.58, -0.15]} size={[0.18, 1.16, 5.4]} color="#a18562" />
      <Block position={[4.8, 0.58, -3.55]} size={[4.95, 1.16, 0.15]} color="#a18562" />
      <Block position={[4.8, 0.58, -2.5]} size={[0.15, 1.16, 2.1]} color="#a18562" />
      <Block position={[4.8, 0.58, 0.6]} size={[0.15, 1.16, 5.2]} color="#a18562" />
      <Block position={[4.05, 0.58, 2.8]} size={[1.55, 1.16, 0.15]} color="#a18562" />
      <Block position={[6.65, 0.58, 2.8]} size={[1.55, 1.16, 0.15]} color="#a18562" />

      <JaliScreen
        id="jali-main"
        label="Main jali divider"
        position={[-0.1, 0, -0.75]}
        length={4.5}
        activeObjectId={activeObjectId}
        onSelectObject={onSelectObject}
      />
      <JaliScreen
        id="jali-side"
        label="Side jali divider"
        position={[2.2, 0, 0.75]}
        length={3.1}
        rotation={Math.PI / 2}
        activeObjectId={activeObjectId}
        onSelectObject={onSelectObject}
      />
      {tables.map((position, index) => (
        <DiningTable
          key={position.join(",")}
          id={`dining-table-${index + 1}`}
          index={index}
          position={position}
          activeObjectId={activeObjectId}
          onSelectObject={onSelectObject}
        />
      ))}
      <Fountain activeObjectId={activeObjectId} onSelectObject={onSelectObject} />
      <Bar activeObjectId={activeObjectId} onSelectObject={onSelectObject} />
      <Reception activeObjectId={activeObjectId} onSelectObject={onSelectObject} />

      <SelectableObject
        id="timber-column"
        label="Timber column"
        zoneId="dining"
        position={[-0.15, 0, -5.1]}
        activeObjectId={activeObjectId}
        onSelectObject={onSelectObject}
        ringRadius={0.42}
      >
        <Block position={[0, 1.45, 0]} size={[0.32, 2.85, 0.32]} color="#79583b" roughness={0.62} />
      </SelectableObject>

      <Block position={[4.8, 0.44, 0]} size={[3.2, 0.85, 0.36]} color="#786148" />
      <Block position={[4.8, 0.91, 0]} size={[3.25, 0.1, 0.44]} color="#c8b798" roughness={0.42} />
      {[-5.2, 7.1].map((x) => (
        <Block key={x} position={[x, 1.1, -3.8]} size={[0.28, 2.2, 0.28]} color="#76543a" />
      ))}
      <Block position={[-0.4, 0.035, 5.85]} size={[4.2, 0.07, 1.15]} color="#bfb3a0" />
      <Block position={[-0.4, 0.08, 6.35]} size={[4.2, 0.08, 0.2]} color="#a8977f" />
    </>
  );
}

function CameraControls() {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);

  useEffect(() => {
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 9;
    controls.maxDistance = 20;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = Math.PI / 2.02;
    controls.target.set(0, 0.25, 0);
    controls.update();
    return () => controls.dispose();
  }, [controls]);

  useFrame(() => controls.update());
  return null;
}

function ModelFallback({ planImage, onReturnToPlan }) {
  return (
    <div className="model-preview-fallback">
      <img src={planImage} alt="Presentation plan for the restaurant" />
      <div>
        <p>3D preview is unavailable in this browser.</p>
        <button type="button" onClick={onReturnToPlan}>Return to measured plan</button>
      </div>
    </div>
  );
}

export default function RestaurantBlockout({ activeZoneId, onSelectZone, onReturnToPlan, planImage }) {
  const [cameraView, setCameraView] = useState("axonometric");
  const [activeObjectId, setActiveObjectId] = useState(null);
  const topDown = cameraView === "plan";
  const cameraPosition = topDown ? [0, 19, 0.01] : [11, 12, 13];
  const activeObject = inspectableObjects.find((object) => object.id === activeObjectId);
  const selectObject = (id, label, zoneId) => {
    setActiveObjectId(id);
    onSelectZone(zoneId);
  };

  return (
    <div className="restaurant-blockout">
      <Canvas
        key={cameraView}
        camera={{ position: cameraPosition, fov: topDown ? 34 : 38 }}
        dpr={[1, 1.4]}
        gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
        fallback={<ModelFallback planImage={planImage} onReturnToPlan={onReturnToPlan} />}
        onCreated={({ gl }) => {
          gl.domElement.setAttribute(
            "aria-label",
            "Approximate interactive 3D blockout of the restaurant, based on the presentation plan",
          );
        }}
      >
        <CameraControls />
        <RestaurantLayout
          activeZoneId={activeZoneId}
          activeObjectId={activeObjectId}
          onSelectZone={onSelectZone}
          onSelectObject={selectObject}
        />
      </Canvas>
      <div className="blockout-object-status" aria-live="polite">
        {activeObject ? `${activeObject.label} selected` : "Select or click a model object to highlight it"}
      </div>
      <details className="blockout-object-picker">
        <summary>Inspect model objects</summary>
        <div>
          {inspectableObjects.map((object) => (
            <button
              key={object.id}
              type="button"
              aria-pressed={activeObjectId === object.id}
              onClick={() => selectObject(object.id, object.label, object.zoneId)}
            >
              {object.label}
            </button>
          ))}
        </div>
      </details>
      <div className="blockout-tools">
        <div className="blockout-view-switch" role="group" aria-label="Choose model view">
          <button
            type="button"
            className={!topDown ? "is-active" : ""}
            aria-pressed={!topDown}
            onClick={() => setCameraView("axonometric")}
          >
            Axonometric
          </button>
          <button
            type="button"
            className={topDown ? "is-active" : ""}
            aria-pressed={topDown}
            onClick={() => setCameraView("plan")}
          >
            Top view
          </button>
        </div>
        <span>Drag to orbit · scroll to zoom</span>
      </div>
    </div>
  );
}
