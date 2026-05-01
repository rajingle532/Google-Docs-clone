"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";

/* ═══════════════════════════════════════════════
   ORBITING SPHERE
   Moves in an elliptical orbit, gently bobs on Y.
   ═══════════════════════════════════════════════ */
function OrbitingSphere({ radius, speed, size, offset, color, opacity }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.6) * (radius * 0.35);
    ref.current.position.z = Math.sin(t) * (radius * 0.5);
    ref.current.rotation.y += 0.008;
    ref.current.rotation.x += 0.004;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 20, 20]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   ROTATING SHAPE
   Spins on all axes + gentle vertical bob.
   ═══════════════════════════════════════════════ */
function RotatingShape({ position, children, color, opacity, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.3;
    ref.current.rotation.y = t * speed * 0.5;
    ref.current.rotation.z = t * speed * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * speed * 0.7) * 0.35;
  });
  return (
    <mesh ref={ref} position={position}>
      {children}
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.35}
        metalness={0.25}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   FLOATING DOCUMENT
   Thin box simulating a page, slowly tilts + drifts.
   ═══════════════════════════════════════════════ */
function FloatingDoc({ position, speed, color, opacity }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * speed) * 0.4;
    ref.current.rotation.x = Math.cos(t * speed * 0.7) * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * speed * 0.5) * 0.4;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.3) * 0.2;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1.2, 1.6, 0.015]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.3}
        metalness={0.1}
        side={2}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   ORBITAL RING
   A torus that orbits the scene centre on a tilted axis.
   ═══════════════════════════════════════════════ */
function OrbitalRing({ radius, tubeRadius, tilt, speed, color, opacity }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    ref.current.rotation.x = tilt;
    ref.current.rotation.y = t * 0.4;
    ref.current.rotation.z = t * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tubeRadius, 16, 48]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.5}
        metalness={0.2}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════════════════ */
export default function EditorScene() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.35} />
          <pointLight position={[6, 4, 4]} intensity={0.4} color="#4285F4" />
          <pointLight position={[-5, -3, 3]} intensity={0.25} color="#34A853" />

          {/* ── Orbiting spheres — Google brand colors ── */}
          <OrbitingSphere radius={3.2} speed={0.25} size={0.14} offset={0}   color="#4285F4" opacity={0.22} />
          <OrbitingSphere radius={2.6} speed={0.35} size={0.10} offset={2.1} color="#34A853" opacity={0.18} />
          <OrbitingSphere radius={3.8} speed={0.18} size={0.11} offset={4.2} color="#FBBC05" opacity={0.16} />
          <OrbitingSphere radius={2.0} speed={0.42} size={0.08} offset={1.0} color="#EA4335" opacity={0.18} />
          <OrbitingSphere radius={4.2} speed={0.15} size={0.06} offset={3.5} color="#4285F4" opacity={0.12} />

          {/* ── Orbital rings ── */}
          <OrbitalRing radius={2.8} tubeRadius={0.02} tilt={1.2} speed={0.2} color="#4285F4" opacity={0.08} />
          <OrbitalRing radius={3.5} tubeRadius={0.015} tilt={0.8} speed={0.15} color="#34A853" opacity={0.06} />

          {/* ── Geometric shapes — structured rotation ── */}
          <RotatingShape position={[-3.2, 1.6, -2]} color="#4285F4" opacity={0.12} speed={0.35}>
            <torusGeometry args={[0.35, 0.12, 16, 32]} />
          </RotatingShape>

          <RotatingShape position={[3.5, -1.2, -2.5]} color="#34A853" opacity={0.14} speed={0.28}>
            <octahedronGeometry args={[0.28]} />
          </RotatingShape>

          <RotatingShape position={[-2.8, -1.8, -1.5]} color="#FBBC05" opacity={0.11} speed={0.45}>
            <dodecahedronGeometry args={[0.22]} />
          </RotatingShape>

          <RotatingShape position={[2.2, 2.2, -2]} color="#EA4335" opacity={0.13} speed={0.32}>
            <icosahedronGeometry args={[0.2]} />
          </RotatingShape>

          <RotatingShape position={[0.5, -2.5, -3]} color="#4285F4" opacity={0.09} speed={0.25}>
            <torusKnotGeometry args={[0.2, 0.06, 64, 8]} />
          </RotatingShape>

          {/* ── Floating document planes ── */}
          <FloatingDoc position={[-4.5, 0.8, -4]}  speed={0.25} color="#ffffff" opacity={0.045} />
          <FloatingDoc position={[4.2, -0.6, -5]}   speed={0.2}  color="#e8f0fe" opacity={0.035} />
          <FloatingDoc position={[0.3, 2.5, -6]}     speed={0.18} color="#f8f9fa" opacity={0.03} />
        </Suspense>
      </Canvas>
    </div>
  );
}
