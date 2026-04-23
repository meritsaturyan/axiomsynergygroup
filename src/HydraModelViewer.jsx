import { useEffect, useRef, useState } from 'react'
import '@google/model-viewer'

function HydraModelViewer({ src, alt }) {
  const wrapRef = useRef(null)
  const mvRef = useRef(null)
  const [loadModel, setLoadModel] = useState(false)

  useEffect(() => {
    const root = wrapRef.current
    if (!root) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setLoadModel(true)
          io.disconnect()
        }
      },
      { rootMargin: '150px' },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = mvRef.current
    if (!el || !loadModel) return

    const reframe = async () => {
      try {
        el.bounds = 'tight'
        if (typeof el.updateFraming === 'function') {
          await el.updateFraming()
        }
        const { theta, phi } = el.getCameraOrbit?.() ?? { theta: 0, phi: Math.PI / 2 }
        const radius = el.getCameraOrbit?.()?.radius ?? 1
        el.cameraTarget = 'auto auto auto'
        el.cameraOrbit = `${(theta * 180) / Math.PI}deg ${(phi * 180) / Math.PI}deg ${radius * 0.85}m`
        el.fieldOfView = '30deg'
        if (typeof el.jumpCameraToGoal === 'function') el.jumpCameraToGoal()
      } catch (err) {
        console.warn('hydra reframe failed', err)
      }
    }

    const onLoad = () => reframe()
    el.addEventListener('load', onLoad)
    if (el.loaded) reframe()

    const ro = new ResizeObserver(() => reframe())
    if (wrapRef.current) ro.observe(wrapRef.current)

    return () => {
      el.removeEventListener('load', onLoad)
      ro.disconnect()
    }
  }, [loadModel, src])

  return (
    <div ref={wrapRef} className="hydra3d-stage">
      {loadModel ? (
        <model-viewer
          ref={mvRef}
          src={src}
          alt={alt}
          camera-controls
          touch-action="pan-y"
          auto-rotate
          rotation-per-second="18deg"
          interaction-prompt="none"
          shadow-intensity="1"
          exposure="1"
          environment-image="neutral"
          bounds="tight"
          field-of-view="30deg"
          camera-orbit="0deg 90deg auto"
          camera-target="auto auto auto"
          min-field-of-view="10deg"
          max-field-of-view="45deg"
          className="hydra3d-viewer"
        />
      ) : (
        <div className="hydra3d-placeholder" aria-hidden />
      )}
    </div>
  )
}

export default HydraModelViewer
