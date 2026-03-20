'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FRAME_COUNT = 121;
const DARK = '#1A1A19';
const frameUrl = (n: number) =>
  `/frames/frame_${String(n).padStart(4, '0')}.webp`;

// Cover-fit: draw img into canvas like CSS object-fit:cover
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const ia = img.naturalWidth / img.naturalHeight;
  const ca = cw / ch;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (ia > ca) {
    sw = sh * ca;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = sw / ca;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

export default function HeroScrollVideo() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const ctxRef        = useRef<CanvasRenderingContext2D | null>(null);
  const frames        = useRef<(HTMLImageElement | null)[]>(
    Array(FRAME_COUNT).fill(null),
  );
  const currentFrame  = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Draw one frame to canvas (zero overhead — cached ctx) ────────────
  const draw = useCallback((index: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const img = frames.current[index];
    if (!ctx || !canvas || !img?.complete || !img.naturalWidth) return;
    drawCover(ctx, img, canvas.width, canvas.height);
  }, []);

  // ── Load a single frame ─────────────────────────────────────────────
  const loadFrame = useCallback(
    (i: number) => {
      if (frames.current[i]?.complete) return;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        frames.current[i] = img;
        if (i === currentFrame.current) draw(i);
      };
      img.src = frameUrl(i + 1);
      frames.current[i] = img;
    },
    [draw],
  );

  // ── Progressive preload ─────────────────────────────────────────────
  useEffect(() => {
    for (let i = 0; i < Math.min(30, FRAME_COUNT); i++) loadFrame(i);
    const t = setTimeout(() => {
      for (let i = 30; i < FRAME_COUNT; i++) loadFrame(i);
    }, 400);
    return () => clearTimeout(t);
  }, [loadFrame]);

  // ── Canvas sizing + context caching ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(window.innerWidth  * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      // Cache context — avoid per-frame getContext overhead
      ctxRef.current = canvas.getContext('2d', { alpha: false });
      draw(currentFrame.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  // ── Scroll → frame (immediate draw, no RAF delay) ──────────────────
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(
        Math.floor(v * FRAME_COUNT),
        FRAME_COUNT - 1,
      );
      if (idx === currentFrame.current) return;
      currentFrame.current = idx;
      draw(idx);
    });
  }, [scrollYProgress, draw]);

  // ── Motion values ───────────────────────────────────────────────────
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  // Card fades out as user scrolls deeper into the sequence
  const cardOpacity = useTransform(scrollYProgress, [0, 0.55, 0.75], [1, 1, 0]);
  const cardScale   = useTransform(scrollYProgress, [0.55, 0.75], [1, 0.97]);

  return (
    <div ref={containerRef} className="relative h-[300vh]" style={{ background: DARK }}>
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: DARK, willChange: 'transform' }}
      >

        {/* ── Canvas frame sequence ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ willChange: 'contents' }}
        />

        {/* ── Subtle top darken ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, rgba(26,26,25,0.25) 0%, transparent 12%)`,
          }}
        />

        {/* ── Bottom fade → solid DARK ── */}
        <div
          className="absolute bottom-0 inset-x-0 h-[65%] pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${DARK} 0%, ${DARK} 18%, rgba(26,26,25,0.9) 38%, rgba(26,26,25,0.45) 62%, transparent 100%)`,
          }}
        />
        {/* ── Hard solid cap — pixel-perfect match with MissionStatement ── */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{ background: DARK }}
        />

        {/* ── Glass card — fades out on deeper scroll ── */}
        <div className="absolute inset-0 z-10 flex items-start justify-center pt-[18vh] md:pt-0 md:items-center px-5 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            style={{ opacity: cardOpacity, scale: cardScale }}
            className="pointer-events-auto w-full text-center"
          >
            <div
              style={{
                maxWidth: 420,
                margin: '0 auto',
                padding: 'clamp(1.1rem, 4vw, 2.25rem) clamp(1rem, 5vw, 2.75rem)',
                borderRadius: 'clamp(16px, 3.5vw, 28px)',
                background: 'rgba(250,250,248,0.42)',
                border: '1px solid rgba(255,255,255,0.62)',
                boxShadow:
                  '0 4px 6px rgba(0,0,0,0.03), 0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* TCC Logo */}
              <motion.a
                href="https://newsletter.theconsciouschurch.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="inline-block mb-3 md:mb-5"
              >
                <img
                  src="/tcc-logo-light.png"
                  alt="The Conscious Church"
                  className="h-[15px] md:h-[22px] w-auto mx-auto opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </motion.a>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="font-display font-extrabold text-text-primary leading-[0.92] tracking-[-0.025em]"
                style={{ fontSize: 'clamp(1.85rem, 7vw, 4.5rem)' }}
              >
                AI <span style={{ color: '#16A34A' }}>Green</span><br />Scorecard
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="mt-3 md:mt-4 text-[12.5px] md:text-[15px] text-text-primary/70 max-w-[300px] md:max-w-[340px] mx-auto leading-relaxed"
              >
                Rating the world&apos;s largest AI companies on carbon emissions,
                water usage, and transparency.
              </motion.p>

              <motion.a
                href="#impact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#impact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0, ease: [0.19, 1, 0.22, 1] }}
                className="mt-4 md:mt-6 inline-flex items-center gap-2 px-6 py-2.5 md:px-7 md:py-3 rounded-full bg-text-primary text-white text-[12px] md:text-[13px] font-semibold hover:bg-text-primary/85 transition-colors"
              >
                Explore the data
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M6.5 2v9m0 0l3.5-3.5M6.5 11L3 7.5"
                    stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[22px] h-[36px] rounded-full border-[1.5px] border-text-primary/20 flex items-start justify-center pt-2.5"
          >
            <div className="w-[3px] h-[5px] rounded-full bg-text-primary/30" />
          </motion.div>
          <p className="text-[9px] uppercase tracking-[0.28em] text-text-primary/25 font-medium">Scroll</p>
        </motion.div>

      </div>
    </div>
  );
}
