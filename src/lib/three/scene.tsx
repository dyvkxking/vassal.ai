'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AnimatedBoxProps {
  position?: [number, number, number]
  color?: string
  speed?: number
}

export function AnimatedBox({
  position = [0, 0, 0],
  color = '#6366f1',
  speed = 1
}: AnimatedBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = time * 0.5 * speed
    meshRef.current.rotation.y = time * 0.3 * speed
  })

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function GroundPlane({ size = 20 }: { size?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  )
}

export function GridHelper({ size = 20 }: { size?: number }) {
  return (
    <gridHelper args={[size, size, '#444', '#222']} position={[0, -0.49, 0]} />
  )
}