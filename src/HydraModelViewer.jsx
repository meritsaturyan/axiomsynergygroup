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
      el.setAttribute('camera-target', 'auto')
      el.setAttribute('field-of-view', '28deg')
      el.setAttribute('camera-orbit', '0deg 82deg 52%')
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
          shadow-intensity="1"
          exposure="1"
          environment-image="neutral"
          className="hydra-model-viewer"
        />
      ) : (
        <div className="hydra-model-placeholder" aria-hidden />
      )}
    </div>
  )
}

export default HydraModelViewer
