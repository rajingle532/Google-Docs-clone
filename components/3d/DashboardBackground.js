"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function DashboardBackground() {
  const group = useRef();
  
  // Generate random positions for floating "nodes"
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
        ],
        size: Math.random() * 0.2 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.001;
      group.current.rotation.x += 0.0005;
    }
  });

  return (
    <group ref={group}>
      {/* Ambient environment */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {nodes.map((node, i) => (
        <Float
          key={i}
          speed={node.speed} 
          rotationIntensity={2} 
          floatIntensity={2}
        >
          <Sphere position={node.position} args={[node.size, 16, 16]}>
            <MeshDistortMaterial
              color="var(--accent)"
              speed={2}
              distort={0.4}
              radius={1}
              opacity={0.3}
              transparent
            />
          </Sphere>
        </Float>
      ))}

      {/* Subtle grid of lines connecting some nodes */}
      <Lines count={15} nodes={nodes} />
    </group>
  );
}

function Lines({ count, nodes }) {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      const start = nodes[Math.floor(Math.random() * nodes.length)].position;
      const end = nodes[Math.floor(Math.random() * nodes.length)].position;
      p.push(new THREE.Vector3(...start), new THREE.Vector3(...end));
    }
    return p;
  }, [count, nodes]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="var(--accent)" opacity={0.2} transparent />
    </lineSegments>
  );
}
