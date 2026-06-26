"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import { GLOBE_HOTSPOTS } from "./hotspots";
import {
  GLOBE_RADIUS,
  HOME_CAMERA_POSITION,
  HOME_TARGET,
  easeInOutCubic,
  hotspotCameraVectors,
  latLngToVector3
} from "./globeMath";
import type { CameraMode, GlobeHotspot } from "./types";

type Props = {
  activeId: string | null;
  focusId: string | null;
  globalViewToken: number;
  resumeAutoRotateToken: number;
  onSelect: (hotspot: GlobeHotspot) => void;
  onHover?: (id: string | null) => void;
  onFocusComplete?: () => void;
  onBackgroundClick?: () => void;
  onCameraModeChange?: (mode: CameraMode) => void;
};

const VISIBLE_MARKER_RADIUS = 0.06;
const HIT_AREA_RADIUS = VISIBLE_MARKER_RADIUS * 5;

function Atmosphere() {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} side={THREE.BackSide} />
    </mesh>
  );
}

function GlobeCore({ onBackgroundClick }: { onBackgroundClick?: () => void }) {
  return (
    <mesh
      onClick={e => {
        e.stopPropagation();
        onBackgroundClick?.();
      }}
    >
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <meshStandardMaterial
        color="#0c4a6e"
        emissive="#082f49"
        emissiveIntensity={0.35}
        metalness={0.4}
        roughness={0.65}
      />
    </mesh>
  );
}

function WireframeShell() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS * 1.002, 32, 32]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.08} />
    </mesh>
  );
}

function NetworkArcs() {
  return (
    <group>
      {GLOBE_HOTSPOTS.map((spot, index) => {
        const next = GLOBE_HOTSPOTS[(index + 1) % GLOBE_HOTSPOTS.length];
        const start = latLngToVector3(spot.lat, spot.lng);
        const end = latLngToVector3(next.lat, next.lng);
        const mid = start.clone().add(end).normalize().multiplyScalar(GLOBE_RADIUS * 1.35);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(48);
        return (
          <Line
            key={`${spot.id}-${next.id}`}
            points={points}
            color="#22d3ee"
            transparent
            opacity={0.35}
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}

function Particles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const v = latLngToVector3(
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 360,
        GLOBE_RADIUS * (1.02 + Math.random() * 0.06)
      );
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#67e8f9" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function HotspotMarker({
  hotspot,
  active,
  focused,
  onSelect,
  onHover
}: {
  hotspot: GlobeHotspot;
  active: boolean;
  focused: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const visibleRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pulse = useRef(0);
  const scaleCurrent = useRef(1);

  const position = latLngToVector3(hotspot.lat, hotspot.lng, GLOBE_RADIUS * 1.01);
  const expanded = active || focused;

  useFrame((_, delta) => {
    pulse.current += delta * 3;
    const base = hovered ? 1.55 : expanded ? 1.4 : 1;
    const pulseFactor = expanded ? 1 + Math.sin(pulse.current) * 0.1 : 1 + Math.sin(pulse.current) * 0.06;
    const target = base * pulseFactor;
    scaleCurrent.current = THREE.MathUtils.lerp(scaleCurrent.current, target, 1 - Math.exp(-delta * 10));

    if (visibleRef.current) {
      visibleRef.current.scale.setScalar(scaleCurrent.current);
    }
    if (glowRef.current) {
      const glowScale = hovered ? 2.6 : expanded ? 2.1 : 1.5;
      glowRef.current.scale.setScalar(glowScale);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = hovered ? 0.48 : expanded ? 0.32 : 0.14;
    }
    if (pulseRingRef.current) {
      const ringPulse = 1 + Math.sin(pulse.current * 1.4) * 0.22;
      pulseRingRef.current.scale.setScalar((expanded ? 2.8 : 2.2) * ringPulse);
      const ringMat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
      ringMat.opacity = expanded ? 0.28 : hovered ? 0.2 : 0.08;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        onClick={e => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={e => {
          e.stopPropagation();
          setHovered(true);
          onHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={e => {
          e.stopPropagation();
          setHovered(false);
          onHover(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[HIT_AREA_RADIUS, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[VISIBLE_MARKER_RADIUS * 1.8, 16, 16]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      <mesh ref={pulseRingRef}>
        <ringGeometry args={[VISIBLE_MARKER_RADIUS * 1.4, VISIBLE_MARKER_RADIUS * 2.2, 32]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={visibleRef}>
        <sphereGeometry args={[VISIBLE_MARKER_RADIUS, 16, 16]} />
        <meshStandardMaterial
          color={hovered || expanded ? "#a5f3fc" : "#22d3ee"}
          emissive={hovered || expanded ? "#22d3ee" : "#0891b2"}
          emissiveIntensity={hovered ? 1.6 : expanded ? 1.25 : 0.55}
        />
      </mesh>

      {(hovered || expanded) && (
        <Html
          center
          distanceFactor={7}
          style={{ pointerEvents: "none", userSelect: "none" }}
          position={[0, 0.18, 0]}
        >
          <div className="whitespace-nowrap rounded-lg border border-cyan-400/40 bg-slate-950/90 px-3 py-1.5 shadow-lg shadow-cyan-500/20">
            <p className="text-[11px] font-semibold text-cyan-100">{hotspot.label}</p>
            <p className="text-[9px] text-slate-400">{hotspot.subtitle}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeCameraController({
  focusId,
  globalViewToken,
  resumeAutoRotateToken,
  onFocusComplete,
  onCameraModeChange
}: {
  focusId: string | null;
  globalViewToken: number;
  resumeAutoRotateToken: number;
  onFocusComplete?: () => void;
  onCameraModeChange?: (mode: CameraMode) => void;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFlying, setIsFlying] = useState(false);

  const modeRef = useRef<CameraMode>("AUTO_ROTATE");
  const flyProgress = useRef(1);
  const flyingHome = useRef(false);
  const focusCompleteFired = useRef(true);

  const flyStartPos = useRef(new THREE.Vector3());
  const flyEndPos = useRef(new THREE.Vector3());
  const flyStartTarget = useRef(new THREE.Vector3());
  const flyEndTarget = useRef(new THREE.Vector3());

  const lastFocusId = useRef<string | null>(null);
  const lastGlobalToken = useRef(0);
  const lastResumeToken = useRef(0);

  const beginFlight = (toFocusId: string | null, isHome: boolean) => {
    const controls = controlsRef.current;
    if (!controls) return;

    flyProgress.current = 0;
    focusCompleteFired.current = false;
    flyingHome.current = isHome;
    setIsFlying(true);

    flyStartPos.current.copy(camera.position);
    flyStartTarget.current.copy(controls.target);

    if (isHome || !toFocusId) {
      flyEndPos.current.copy(HOME_CAMERA_POSITION);
      flyEndTarget.current.copy(HOME_TARGET);
    } else {
      const spot = GLOBE_HOTSPOTS.find(h => h.id === toFocusId);
      if (!spot) return;
      const { surface, camera: camPos } = hotspotCameraVectors(spot.lat, spot.lng);
      flyEndPos.current.copy(camPos);
      flyEndTarget.current.copy(surface);
    }

    setAutoRotate(false);
    if (!isHome && toFocusId) {
      modeRef.current = "NODE_FOCUS";
      onCameraModeChange?.("NODE_FOCUS");
    }
  };

  useEffect(() => {
    if (focusId && focusId !== lastFocusId.current) {
      lastFocusId.current = focusId;
      beginFlight(focusId, false);
    }
  }, [focusId]);

  useEffect(() => {
    if (globalViewToken > 0 && globalViewToken !== lastGlobalToken.current) {
      lastGlobalToken.current = globalViewToken;
      lastFocusId.current = null;
      beginFlight(null, true);
    }
  }, [globalViewToken]);

  useEffect(() => {
    if (resumeAutoRotateToken > 0 && resumeAutoRotateToken !== lastResumeToken.current) {
      lastResumeToken.current = resumeAutoRotateToken;
      setAutoRotate(true);
      modeRef.current = "AUTO_ROTATE";
      onCameraModeChange?.("AUTO_ROTATE");
    }
  }, [resumeAutoRotateToken, onCameraModeChange]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || flyProgress.current >= 1) return;

    flyProgress.current = Math.min(1, flyProgress.current + delta * 1.15);
    const eased = easeInOutCubic(flyProgress.current);

    camera.position.lerpVectors(flyStartPos.current, flyEndPos.current, eased);
    controls.target.lerpVectors(flyStartTarget.current, flyEndTarget.current, eased);
    camera.lookAt(controls.target);
    controls.update();

    if (flyProgress.current >= 1 && !focusCompleteFired.current) {
      focusCompleteFired.current = true;

      if (flyingHome.current) {
        modeRef.current = "AUTO_ROTATE";
        setAutoRotate(true);
        setIsFlying(false);
        onCameraModeChange?.("AUTO_ROTATE");
      } else {
        modeRef.current = "NODE_FOCUS";
        setIsFlying(false);
        onFocusComplete?.();
        onCameraModeChange?.("NODE_FOCUS");
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom
      minDistance={2.6}
      maxDistance={9}
      autoRotate={autoRotate && !isFlying}
      autoRotateSpeed={0.35}
      enableDamping
      dampingFactor={0.06}
      onStart={() => {
        if (modeRef.current === "NODE_FOCUS" && !isFlying) {
          modeRef.current = "FREE_ORBIT";
          onCameraModeChange?.("FREE_ORBIT");
        }
      }}
    />
  );
}

function Scene({
  activeId,
  focusId,
  globalViewToken,
  resumeAutoRotateToken,
  onSelect,
  onHover,
  onFocusComplete,
  onCameraModeChange,
  onBackgroundClick
}: Props) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} color="#e0f2fe" />
      <directionalLight position={[-4, -2, -3]} intensity={0.25} color="#22d3ee" />
      <GlobeCore onBackgroundClick={onBackgroundClick} />
      <WireframeShell />
      <Atmosphere />
      <NetworkArcs />
      <Particles />
      {GLOBE_HOTSPOTS.map(hotspot => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          active={activeId === hotspot.id}
          focused={focusId === hotspot.id}
          onSelect={() => onSelect(hotspot)}
          onHover={hovering => onHover?.(hovering ? hotspot.id : null)}
        />
      ))}
      <GlobeCameraController
        focusId={focusId}
        globalViewToken={globalViewToken}
        resumeAutoRotateToken={resumeAutoRotateToken}
        onFocusComplete={onFocusComplete}
        onCameraModeChange={onCameraModeChange}
      />
    </>
  );
}

export default function MissionControlGlobe3D({
  activeId,
  focusId,
  globalViewToken,
  resumeAutoRotateToken,
  onSelect,
  onHover,
  onFocusComplete,
  onBackgroundClick,
  onCameraModeChange
}: Props) {
  return (
    <Canvas
      camera={{ position: HOME_CAMERA_POSITION.toArray(), fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="h-full w-full"
      onPointerMissed={() => onBackgroundClick?.()}
    >
      <Suspense fallback={null}>
        <Scene
          activeId={activeId}
          focusId={focusId}
          globalViewToken={globalViewToken}
          resumeAutoRotateToken={resumeAutoRotateToken}
          onSelect={onSelect}
          onHover={onHover}
          onFocusComplete={onFocusComplete}
          onBackgroundClick={onBackgroundClick}
          onCameraModeChange={onCameraModeChange}
        />
      </Suspense>
    </Canvas>
  );
}
