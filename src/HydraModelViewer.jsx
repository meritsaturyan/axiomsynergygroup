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

    const frameCamera = () => {
      el.setAttribute('camera-target', 'auto auto auto')
      el.setAttribute('field-of-view', '24deg')
      el.setAttribute('camera-orbit', '0deg 80deg auto')
      el.setAttribute('min-field-of-view', '12deg')
      el.setAttribute('max-field-of-view', '45deg')
      if (typeof el.updateFraming === 'function') el.updateFraming()
      if (typeof el.resetTurntableRotation === 'function') el.resetTurntableRotation()
      if (typeof el.jumpCameraToGoal === 'function') el.jumpCameraToGoal()
    }

    const onLoad = () => frameCamera()
    el.addEventListener('load', onLoad)
    if (el.loaded) frameCamera()
    return () => el.removeEventListener('load', onLoad)
  }, [loadModel, src])

  return (
    <div ref={wrapRef} className="hydra-model-viewer-wrap">
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
          field-of-view="24deg"
          camera-orbit="0deg 80deg auto"
          camera-target="auto auto auto"
          className="hydra-model-viewer"
        />
      ) : (
        <div className="hydra-model-placeholder" aria-hidden />
      )}
    </div>
  )
}

export default HydraModelViewer
