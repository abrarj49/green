'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Low-poly Palm Tree component
function LowPolyPalm() {
  const palmGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (palmGroup.current) {
      // Gentle natural wind sway
      palmGroup.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      palmGroup.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.6) * 0.03;
    }
  });

  return (
    <group ref={palmGroup} position={[0.8, -0.5, 0]}>
      {/* Curved Trunk */}
      <mesh position={[0, 1.2, 0]} rotation={[0.08, 0, -0.05]}>
        <cylinderGeometry args={[0.15, 0.28, 2.6, 7]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>

      {/* Palm Fronds (Frond Clustered Canopy) */}
      <group position={[0, 2.5, 0]}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <mesh
            key={i}
            rotation={[0.6, 0, (angle * Math.PI) / 180]}
            position={[0, 0, 0]}
          >
            <coneGeometry args={[0.35, 1.8, 4]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#3E7D3E' : '#8DC63F'}
              roughness={0.6}
              flatShading
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Low-poly Garden Bed & Sprinkler
function GardenBed() {
  const sprinklerRef = useRef<THREE.Mesh>(null);
  const waterRingsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sprinklerRef.current) {
      sprinklerRef.current.rotation.y += 0.04;
    }
    if (waterRingsRef.current) {
      waterRingsRef.current.rotation.y += 0.02;
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      waterRingsRef.current.scale.set(s, 1, s);
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      {/* Main Stylized Grass Mound */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3.4, 0.4, 16]} />
        <meshStandardMaterial color="#2E5D2E" roughness={0.9} flatShading />
      </mesh>

      {/* Raised Terraced Herb/Garden Ring */}
      <mesh position={[-0.8, 0.25, 0.4]}>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 10]} />
        <meshStandardMaterial color="#16332A" roughness={0.8} flatShading />
      </mesh>

      {/* Smaller Accent Bushes */}
      {[-1.2, -0.4, 1.4].map((x, idx) => (
        <mesh key={idx} position={[x, 0.35, idx * 0.4 - 0.2]}>
          <dodecahedronGeometry args={[0.3 + idx * 0.1, 0]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#8DC63F' : '#3E7D3E'}
            roughness={0.7}
            flatShading
          />
        </mesh>
      ))}

      {/* Irrigation Sprinkler Head */}
      <mesh ref={sprinklerRef} position={[-0.8, 0.5, 0.4]}>
        <cylinderGeometry args={[0.04, 0.06, 0.3, 6]} />
        <meshStandardMaterial color="#C9A34E" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Animated Water Spray Droplets / Rings */}
      <group ref={waterRingsRef} position={[-0.8, 0.65, 0.4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.25, 12]} />
          <meshBasicMaterial
            color="#8DC63F"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 16]} />
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function HeroScene() {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    // Check WebGL availability and reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isSmallScreen = window.innerWidth < 768;

    // Detect WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && !prefersReducedMotion && !isSmallScreen) {
        setCanRender3D(true);
      }
    } catch {
      setCanRender3D(false);
    }
  }, []);

  if (!canRender3D) {
    // Fallback: Elegant subtle ambient glow with zero 3D overhead
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 end-12 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute bottom-1/4 start-1/4 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-auto opacity-70 hover:opacity-90 transition-opacity">
      <Canvas
        camera={{ position: [2.5, 2.5, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
        <pointLight position={[-4, 3, -2]} intensity={0.5} color="#8DC63F" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[1.4, 0, 0]}>
            <LowPolyPalm />
            <GardenBed />
          </group>
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3.5}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
