import { motion } from 'framer-motion'
import { FiArrowDown, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { portfolio } from '../data/portfolio'
import { RobotScene } from '../components/RobotScene'

export function Hero() {
  const cvAvailable = Boolean(portfolio.cvPath)
  return <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-20">
    <div className="orb orb-cyan left-[-10rem] top-[10%]"/><div className="orb orb-purple right-[-8rem] top-[18%]"/>
    <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
        <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/[.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[.24em] text-cyan-200"><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]"/> Graduate Research Trajectory // 2026</div>
        <p className="mb-3 font-mono text-sm tracking-[.18em] text-slate-400">HELLO, I&apos;M</p>
        <h1 className="text-5xl font-semibold leading-[.95] tracking-[-.05em] text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]">{portfolio.name}</h1>
        <h2 className="mt-6 max-w-3xl bg-gradient-to-r from-cyan-200 via-white to-purple-300 bg-clip-text text-xl font-medium leading-8 text-transparent sm:text-2xl">{portfolio.title}</h2>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{portfolio.subtitle}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          {cvAvailable ? <a className="btn-primary" href={portfolio.cvPath} download><FiDownload/> Download CV</a> : <a className="btn-primary opacity-80" href="#contact" title="Add your CV path in src/data/portfolio.ts"><FiDownload/> CV — Add File</a>}
          <a className="btn-secondary" href={portfolio.github} target="_blank" rel="noreferrer"><FiGithub/> GitHub</a>
          <a className="btn-secondary" href={portfolio.linkedin} target="_blank" rel="noreferrer"><FiLinkedin/> LinkedIn</a>
          <a className="btn-secondary" href="#contact"><FiMail/> Contact</a>
        </div>
        <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-white/[.07] pt-6 font-mono text-[10px] uppercase tracking-[.16em] text-slate-500"><span>Focus<br/><b className="mt-1 block text-slate-300">Robotics</b></span><span>Domain<br/><b className="mt-1 block text-slate-300">Autonomy</b></span><span>Method<br/><b className="mt-1 block text-slate-300">Model → Test</b></span></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }}><RobotScene/></motion.div>
    </div>
    <a href="#about" className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2 animate-bounce text-slate-500" aria-label="Scroll to about"><FiArrowDown/></a>
  </section>
}
