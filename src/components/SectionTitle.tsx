import { motion } from 'framer-motion'

export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: .65 }} className="mb-12 max-w-3xl">
      <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[.3em] text-cyan-300"><span className="h-px w-8 bg-cyan-300/70" />{eyebrow}</div>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-5 max-w-2xl leading-7 text-slate-400">{text}</p>}
    </motion.div>
  )
}
