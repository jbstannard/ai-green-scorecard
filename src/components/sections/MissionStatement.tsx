'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function MissionStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative overflow-hidden py-32 md:py-48 px-6" style={{ background: '#1A1A19' }}>

      {/* ── Ambient green glow — pushed well below top edge ── */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[130px] pointer-events-none" style={{ background: 'rgba(21,128,61,0.08)' }} />

      <motion.div style={{ y }} className="relative max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="text-[10px] uppercase tracking-[0.4em] text-earth-green-light/60 font-semibold mb-8"
        >
          The reality
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.02] tracking-[-0.02em]"
        >
          Every query has a cost.<br />
          <span className="text-earth-green-light">Every model, a footprint.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="mt-8 text-[15px] md:text-lg text-white/50 leading-relaxed max-w-2xl mx-auto"
        >
          Data centres consumed 415 TWh of electricity in 2024 — more than the UK — and are on
          track to double by 2030. Yet most AI companies refuse to disclose their individual impact.
        </motion.p>

        {/* Three key stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { val: '415 TWh', label: 'consumed in 2024' },
            { val: '60%',     label: 'powered by fossil fuels' },
            { val: '4 of 11', label: 'companies publish no data' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-display font-bold text-earth-green-light">{s.val}</p>
              <p className="text-[12px] text-white/35 mt-1 tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
