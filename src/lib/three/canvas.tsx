'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Suspense } from 'react'

interface SceneCanvasProps {
  children: React.ReactNode
  cameraPosition?: [number, number, number]
  shadows?: boolean
  className?: string
}

export function SceneCanvas({
  children,
  cameraPosition = [5, 5, 5],
  shadows = true,
  className = ''
}: SceneCanvasProps) {
  return (
    <div className={className}>
      <Canvas shadows={shadows}>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow={shadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>{children}</Suspense>
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

export function LoadingPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#gray" wireframe />
    </mesh>
  )
}