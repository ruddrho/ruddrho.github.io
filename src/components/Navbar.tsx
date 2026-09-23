import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

const links = ['About', 'Skills', 'Education', 'Activities', 'Projects', 'GitHub', 'Contact']

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.06] bg-[#050816]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#top" className="group flex items-center gap-3 font-mono text-sm text-white">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/5 text-cyan-300 shadow-cyan"><span>RM</span><span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_12px_#c084fc]" /></span>
          <span className="hidden sm:block">RUDDRHO<span className="text-cyan-300">.SYS</span></span>
        </a>
        <div className="hidden items-center gap-6 lg:flex">{links.map(link => <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">{link}</a>)}</div>
        <button onClick={() => setOpen(v => !v)} className="rounded-lg border border-white/10 p-2 text-slate-200 lg:hidden" aria-label="Toggle menu">{open ? <FiX /> : <FiMenu />}</button>
      </nav>
      <AnimatePresence>{open && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/[.06] bg-[#050816]/95 lg:hidden"><div className="space-y-1 px-5 py-4">{links.map(link => <a onClick={() => setOpen(false)} key={link} href={`#${link.toLowerCase()}`} className="block rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-cyan-300">{link}</a>)}</div></motion.div>}</AnimatePresence>
    </header>
  )
}
