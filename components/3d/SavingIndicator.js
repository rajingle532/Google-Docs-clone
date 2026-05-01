"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";

export default function SavingIndicator() {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={mesh}>
          <boxGeometry args={[0.4, 0.5, 0.05]} />
          <meshStandardMaterial color="var(--accent)" transparent opacity={0.8} />
        </mesh>
      </Float>
      <pointLight position={[2, 2, 2]} intensity={0.5} />
    </group>
  );
}
