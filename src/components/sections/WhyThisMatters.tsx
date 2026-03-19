'use client';

import { motion } from 'framer-motion';

export default function WhyThisMatters() {
  return (
    <section id="why" className="bg-surface-0 py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24">

          {/* Left — editorial */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-4">A Deeper Question</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-8">Why this matters.</h2>
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="relative mb-10"
            >
              {/* Decorative large quote mark */}
              <span
                className="absolute -top-2 -left-2 font-serif text-[96px] leading-none text-earth-green/10 select-none pointer-events-none"
                aria-hidden
              >"</span>
              <div className="relative border-l-[3px] border-earth-green/25 pl-7 py-1">
                <p className="text-xl md:text-2xl font-display italic font-light text-text-primary/80 leading-[1.6]">
                  The Lord God took the man and put him in the Garden of Eden to work it and take care of it.
                </p>
                <cite className="block mt-5 text-[11px] text-earth-green not-italic font-semibold tracking-[0.15em] uppercase">Genesis 2:15</cite>
              </div>
            </motion.blockquote>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-5 text-[15px] text-text-secondary leading-[1.85]"
            >
              <p>Long before the first data centre hummed to life, a mandate was given: tend the garden. This ancient call to stewardship is not opposed to technology — it invites us to wield our tools with wisdom.</p>
              <p>As Christians, churches, and organisations increasingly adopt AI, there is a quiet cost being overlooked. Every query draws on energy and water — resources that belong to a shared creation.</p>
              <p className="text-text-primary/60">The data on this page is imperfect. Many companies refuse to disclose their impact at all. That silence, too, is a kind of answer.</p>
            </motion.div>
          </div>

          {/* Right — questions card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="lg:pt-20"
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <h3 className="text-xl font-display font-semibold text-earth-green mb-7">Questions worth asking</h3>
              <ul className="space-y-5">
                {[
                  'Does our AI provider publish an annual sustainability report?',
                  'Are they genuinely renewable, or just buying offsets to claim credit?',
                  'Could we achieve the same outcome with a smaller, efficient model?',
                  'Are we using AI intentionally, or without reflecting on its cost?',
                ].map((q, i) => (
                  <motion.li
                    key={q}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <span className="mt-1.5 w-5 h-5 rounded-full bg-earth-green/10 border border-earth-green/20 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-earth-green/50" />
                    </span>
                    <span className="text-[14px] text-text-secondary leading-relaxed">{q}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Origin note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 p-5 rounded-2xl bg-surface-2 border border-border-subtle"
            >
              <p className="text-[12px] text-text-tertiary leading-relaxed italic">
                This scorecard was inspired by a reader named Jacob — who asked whether AI companies were taking environmental stewardship seriously, especially for churches and Christians adopting these tools.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
