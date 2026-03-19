'use client';

import { motion } from 'framer-motion';

const analogies = [
  {
    stat: '1 ChatGPT query',
    equals: '= A lightbulb on for 10 min',
    detail: '~0.3 Wh · 0.13g CO₂',
    icon: '💡',
    color: '#CA8A04',
  },
  {
    stat: '1 Claude Opus query',
    equals: '= Boiling a kettle',
    detail: '~4.05 Wh · 1.80g CO₂',
    icon: '☕',
    color: '#EA580C',
  },
  {
    stat: '1 image generated',
    equals: '= Charging your phone 2%',
    detail: '~2.9 Wh · 1.3g CO₂',
    icon: '📱',
    color: '#D97706',
  },
  {
    stat: 'Training GPT-4',
    equals: '= 500 return flights London–NYC',
    detail: '~50 GWh · 12,000 tonnes CO₂',
    icon: '✈️',
    color: '#DC2626',
  },
  {
    stat: 'ChatGPT per day',
    equals: '= 37,000 US homes powered',
    detail: '340+ MWh · 700M weekly users',
    icon: '🏘️',
    color: '#9333EA',
  },
  {
    stat: 'Google\'s AI data centres',
    equals: '= Half of Ireland\'s electricity',
    detail: '30.8 TWh in 2024',
    icon: '🇮🇪',
    color: '#0891B2',
  },
];

const questions = [
  { q: 'Do I actually need the biggest model?', a: 'For most tasks — no. Claude Haiku uses 18× less energy than Opus with similar quality for simple queries.' },
  { q: 'Is my company\'s AI provider transparent?', a: 'OpenAI, Cohere, and xAI publish zero environmental data. Mistral and Google are leading on disclosure.' },
  { q: 'Do carbon credits mean a company is clean?', a: 'Not necessarily. Microsoft\'s Scope 3 emissions rose 26% while claiming 100% renewable energy.' },
  { q: 'What difference can I actually make?', a: 'Collectively, model choice matters. 700M ChatGPT users switching to lighter models would save millions of tonnes annually.' },
];

export default function PracticalGuide() {
  return (
    <section className="bg-surface-2/40 py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Analogies grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-4">What This Actually Means</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">Put it in perspective.</h2>
          <p className="text-[14px] text-text-secondary mb-12 max-w-lg leading-relaxed">
            Abstract terawatt-hours don't feel real. Here's what AI energy use looks like in everyday terms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analogies.map((item, i) => (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
                className="bg-white rounded-2xl p-6 border border-border-subtle shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-shadow duration-400"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <div>
                  <p className="text-[13px] font-bold text-text-primary">{item.stat}</p>
                  <p className="text-[15px] font-semibold mt-1" style={{ color: item.color }}>{item.equals}</p>
                  <p className="text-[11px] text-text-tertiary mt-2">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Q&A section */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="lg:sticky lg:top-24"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-earth-green font-semibold mb-3">Real Questions</p>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-text-primary max-w-[240px] leading-[1.1]">
              What<br />should I<br />actually do?
            </h3>
          </motion.div>

          <div className="space-y-4">
            {questions.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
                className="bg-white rounded-2xl p-7 border border-border-subtle"
              >
                <p className="text-[15px] font-semibold text-text-primary mb-2">{item.q}</p>
                <p className="text-[14px] text-text-secondary leading-[1.75]">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
