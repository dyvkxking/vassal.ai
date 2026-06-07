'use client'

import { SceneCanvas } from '@/lib/three/canvas'
import { AnimatedBox, GroundPlane, GridHelper } from '@/lib/three/scene'

export default function DemoScene() {
  return (
    <SceneCanvas className="w-full h-[400px] rounded-lg overflow-hidden">
      <AnimatedBox position={[0, 0.5, 0]} color="#6366f1" speed={1} />
      <AnimatedBox position={[2, 0.5, 0]} color="#ec4899" speed={0.8} />
      <AnimatedBox position={[-2, 0.5, 0]} color="#10b981" speed={1.2} />
      <GroundPlane size={20} />
      <GridHelper size={20} />
    </SceneCanvas>
  )
}