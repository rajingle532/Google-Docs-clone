"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function SceneWrapper({ children, className, style, camera = { position: [0, 0, 5], fov: 50 } }) {
  return (
    <div 
      className={className} 
      style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        pointerEvents: "none", // Ensure it doesn't block UI clicks
        zIndex: 0,
        ...style 
      }}
    >
      <Canvas camera={camera}>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
