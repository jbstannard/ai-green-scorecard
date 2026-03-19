'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Scores', href: '#scores' },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Compare', href: '#compare' },
  { label: 'Why It Matters', href: '#why' },
];

export default function ScorecardNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 72);
  });

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex flex-col items-center pointer-events-none">
      {/* ── Floating pill ── */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
        className="pointer-events-auto flex items-center gap-1 rounded-full px-2 py-2"
        style={{
          background: scrolled ? 'rgba(250,250,248,0.97)' : 'rgba(250,250,248,0.70)',
          border: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.65)',
          boxShadow: scrolled
            ? '0 6px 40px rgba(0,0,0,0.13), 0 1px 0 rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)'
            : '0 2px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          transition: 'background 0.45s cubic-bezier(0.19,1,0.22,1), box-shadow 0.45s cubic-bezier(0.19,1,0.22,1), border-color 0.45s cubic-bezier(0.19,1,0.22,1)',
        }}
      >
        {/* Logo mark */}
        <a href="#" className="flex items-center gap-2 px-3 py-1 group">
          <div className="w-5 h-5 relative shrink-0">
            <div className="absolute inset-0 rounded-[6px] rotate-45 bg-earth-green/10 group-hover:bg-earth-green/20 transition-colors duration-300" />
            <div className="absolute inset-[4.5px] rounded-[2.5px] rotate-45 bg-earth-green" />
          </div>
          <span className="font-display font-bold text-[14px] text-text-primary tracking-[-0.02em] hidden sm:block whitespace-nowrap">
            AI Green Scorecard
          </span>
        </a>

        {/* Divider */}
        <div className="hidden md:block w-px h-4 bg-black/10 mx-1" />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium text-text-secondary hover:text-text-primary hover:bg-black/[0.05] transition-all duration-250 whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 rounded-full text-text-secondary hover:bg-black/[0.05] transition-colors duration-200 mr-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </motion.div>

      {/* ── Mobile dropdown (expands below pill) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="pointer-events-auto mt-2 rounded-2xl px-2 py-2 flex flex-col gap-0.5 min-w-[180px]"
            style={{
              background: 'rgba(250,250,248,0.92)',
              border: '1px solid rgba(255,255,255,0.65)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.85)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
            }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="px-4 py-2.5 rounded-xl text-[14px] text-text-secondary hover:text-text-primary hover:bg-black/[0.04] transition-all duration-200"
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
