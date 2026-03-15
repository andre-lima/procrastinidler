import { createPortal } from 'react-dom';
import styles from './crt-filter.module.scss';
import { useGameStore } from '../../store/gameStore';

/** CRT overlay: scanlines, vignette, chromatic aberration. Portals into #crt-overlay-root (see index.html). */
export const CRTFilter = () => {
  const crtEnabled = useGameStore((s) => s.crtEnabled);
  const chromaticAberration = useGameStore((s) => s.crtChromaticAberration);

  // No zoom normalization lib in this project — use 1:1 scale
  const inverseScale = 1;
  const zoomLevel = 1;
  const chromaticAberrationMultiplier = chromaticAberration / 20;

  const scaleFactor = inverseScale;

  const redOffset = '-1.8;-1.5;-2;-1.3;-1.8;-1.5'
    .split(';')
    .map((v) => (parseFloat(v) * scaleFactor * chromaticAberrationMultiplier).toFixed(2))
    .join(';');

  const blueOffset = '1.5;1;1.7;1.6;1.3;1.8;0.9'
    .split(';')
    .map((v) => (parseFloat(v) * scaleFactor * chromaticAberrationMultiplier).toFixed(2))
    .join(';');

  // Scanline period: pixel-aligned for crisp lines
  const dpr = Math.min(4, Math.max(1, Math.round(1 / zoomLevel)));
  const dark = 2 * dpr;
  const gap = 2 * dpr;
  const period = dark + gap;
  const darkAlpha = 0.14;
  const gapAlpha = 0.05;

  if (!crtEnabled) return null;

  const container =
    typeof document !== 'undefined' ? document.getElementById('crt-overlay-root') : null;
  if (!container) return null;

  const content = (
    <div className={styles.crtFilter}>
      {/* Scanlines (SVG – pixel perfect) */}
      <svg
        className={styles.scanlines}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <pattern
            id="scanlinePattern"
            patternUnits="userSpaceOnUse"
            width={period}
            height={period}
          >
            <rect
              x="0"
              y="0"
              width="100%"
              height={dark}
              fill={`rgba(0,0,0,${darkAlpha})`}
            />
            <rect
              x="0"
              y={dark}
              width="100%"
              height={gap}
              fill={`rgba(0,0,0,${gapAlpha})`}
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlinePattern)" />
      </svg>

      <div className={styles.vignette} />
      {/* Curved-screen darkening at edges (inset shadow) */}
      <div className={styles.screenCurvature} />

      {/* Chromatic aberration filter (referenced by id from CSS if needed) */}
      <svg width="0" height="0" aria-hidden="true">
        <filter
          id="chromatic-aberration"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="
              1 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 1 0
            "
            result="r"
          />
          <feOffset in="r" dy="-1" result="rOff">
            <animate
              attributeName="dx"
              dur="900ms"
              repeatCount="indefinite"
              values={redOffset}
            />
          </feOffset>

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="
              0 0 0 0 0
              0 1 0 0 0
              0 0 0 0 0
              0 0 0 1 0
            "
            result="g"
          />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 1 0 0
              0 0 0 1 0
            "
            result="b"
          />
          <feOffset in="b" dy="1" result="bOff">
            <animate
              attributeName="dx"
              dur="1030ms"
              repeatCount="indefinite"
              values={blueOffset}
            />
          </feOffset>

          <feBlend in="rOff" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bOff" mode="screen" />
        </filter>
      </svg>
    </div>
  );

  return createPortal(content, container);
};
