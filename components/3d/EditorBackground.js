"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export default function EditorBackground() {
  const group = useRef();

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      group.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
      
      {/* Background soft spheres */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5} position={[-5, 2, -10]}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="var(--accent)" transparent opacity={0.03} roughness={1} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8} position={[6, -3, -15]}>
        <mesh>
          <torusGeometry args={[3, 0.8, 16, 32]} />
          <meshStandardMaterial color="var(--accent)" transparent opacity={0.02} roughness={1} />
        </mesh>
      </Float>
    </group>
  );
}
