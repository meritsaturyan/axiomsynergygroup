import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Bounds,
  Environment,
  OrbitControls,
  useBounds,
  useGLTF,
} from '@react-three/drei'
import * as THREE from 'three'

function Model({ url }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = false
        obj.receiveShadow = false
        if (obj.material) {
          obj.material.envMapIntensity = 0.9
          if ('metalness' in obj.material) obj.material.metalness = Math.min(obj.material.metalness ?? 0, 0.6)
          if ('roughness' in obj.material) obj.material.roughness = Math.max(obj.material.roughness ?? 0.5, 0.35)
        }
      }
    })
  }, [scene])

  return <primitive object={scene} />
}

function Refit({ deps }) {
  const api = useBounds()
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      api.refresh().clip().fit()
    })
    return () => cancelAnimationFrame(id)
  }, deps)
  return null
}

function HydraScene({ src }) {
  const groupRef = useRef(null)

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 3.2], fov: 32, near: 0.01, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <color attach="background" args={[0x0a0a0a]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={1.1} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} />

      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.15}>
          <group ref={groupRef}>
            <Model url={src} />
          </group>
          <Refit deps={[src]} />
        </Bounds>
        <Environment preset="studio" />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={0.6}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.9}
      />
    </Canvas>
  )
}

export default HydraScene
