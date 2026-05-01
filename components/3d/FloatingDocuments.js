"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";

function DocumentMesh({ position, rotation, scale, color }) {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.002;
      mesh.current.rotation.x += 0.001;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
        {/* A thin box representing a document */}
        <boxGeometry args={[2, 2.8, 0.02]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.1} 
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingDocuments() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />
      
      <DocumentMesh 
        position={[-3, 1, -2]} 
        rotation={[0.2, 0.4, -0.1]} 
        scale={1.2} 
        color="#ffffff" 
      />
      <DocumentMesh 
        position={[3, -1, -3]} 
        rotation={[-0.2, -0.3, 0.2]} 
        scale={0.9} 
        color="#e8f0fe" 
      />
      <DocumentMesh 
        position={[0, 0, -5]} 
        rotation={[0, 0, 0]} 
        scale={1.5} 
        color="#f8f9fa" 
      />
    </>
  );
}
