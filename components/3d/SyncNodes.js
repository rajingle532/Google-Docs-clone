"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SyncNodes() {
  const pointsRef = useRef();
  const linesRef = useRef();
  
  const particleCount = 15;
  const maxDistance = 1.5;

  // Generate random positions for the nodes
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      vel.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      });
    }
    return [pos, vel];
  }, []);

  // Update positions and lines every frame
  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const positionsArray = pointsRef.current.geometry.attributes.position.array;
    const linePositions = [];

    // Update positions based on velocity
    for (let i = 0; i < particleCount; i++) {
      let x = positionsArray[i * 3] + velocities[i].x;
      let y = positionsArray[i * 3 + 1] + velocities[i].y;
      let z = positionsArray[i * 3 + 2] + velocities[i].z;

      // Bounce off walls
      if (Math.abs(x) > 2) velocities[i].x *= -1;
      if (Math.abs(y) > 0.75) velocities[i].y *= -1;
      if (Math.abs(z) > 1) velocities[i].z *= -1;

      positionsArray[i * 3] = x;
      positionsArray[i * 3 + 1] = y;
      positionsArray[i * 3 + 2] = z;

      // Check distance to other particles to form lines
      for (let j = i + 1; j < particleCount; j++) {
        const dx = x - positionsArray[j * 3];
        const dy = y - positionsArray[j * 3 + 1];
        const dz = z - positionsArray[j * 3 + 2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < maxDistance) {
          linePositions.push(
            x, y, z,
            positionsArray[j * 3], positionsArray[j * 3 + 1], positionsArray[j * 3 + 2]
          );
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update line geometry
    const lineGeo = linesRef.current.geometry;
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    // Slowly rotate the whole system
    pointsRef.current.rotation.y += 0.001;
    linesRef.current.rotation.y += 0.001;
  });

  return (
    <group position={[0, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#4285F4" transparent opacity={0.6} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#4285F4" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}
