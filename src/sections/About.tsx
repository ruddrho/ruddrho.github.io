import { motion } from 'framer-motion'
import { GlassCard } from '../components/GlassCard'
import { SectionTitle } from '../components/SectionTitle'
import { portfolio } from '../data/portfolio'

export function About() {
  return <section id="about" className="section-wrap">
    <SectionTitle eyebrow="01 // Profile" title="Engineering curiosity, shaped toward research." text="A concise academic profile designed for graduate admissions, research groups, and engineering collaborators." />
    <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
      <GlassCard className="p-7 sm:p-9"><div className="mb-5 font-mono text-xs text-cyan-300">ABOUT_ME.md</div><p className="text-lg leading-8 text-slate-300">{portfolio.intro}</p><p className="mt-5 leading-7 text-slate-400">My current direction emphasizes simulation-first development, measurable engineering outcomes, and the integration of perception, planning, control, and embedded computation into coherent robotic systems.</p></GlassCard>
      <GlassCard className="p-7 sm:p-9"><div className="space-y-5">{[['Degree', portfolio.degree], ['University', portfolio.university], ['Expected Graduation', portfolio.graduation]].map(([a,b]) => <div key={a} className="border-b border-white/[.07] pb-4"><div className="font-mono text-[10px] uppercase tracking-[.18em] text-slate-500">{a}</div><div className="mt-1 text-slate-200">{b}</div></div>)}</div></GlassCard>
    </div>
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-5 flex flex-wrap gap-2">{portfolio.researchInterests.map(x => <span key={x} className="tech-chip">{x}</span>)}</motion.div>
  </section>
}
