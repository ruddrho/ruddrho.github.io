import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

const links = [
  'About',
  'Skills',
  'Education',
  'Activities',
  'Projects',
  'GitHub',
  'Contact',
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.06] bg-[#050816]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* BRAND */}
        <a
          href="#top"
          className="group flex items-center gap-4 font-mono text-base text-white"
        >
          {/* RM LOGO */}
          <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/[.05] text-sm font-medium text-cyan-300 shadow-cyan transition duration-300 group-hover:border-cyan-300/50 group-hover:bg-cyan-300/[.08]">

            <span>RM</span>

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_14px_#c084fc]" />

          </span>

          {/* NAME */}
          <span className="hidden font-medium tracking-[.04em] sm:block">
            RUDDRHO
            <span className="text-cyan-300">
              .SYS
            </span>
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="nav-link text-[11px] tracking-[.18em]"
            >
              {link}
            </a>
          ))}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-lg text-slate-200 transition hover:border-cyan-300/20 hover:text-cyan-300 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="overflow-hidden border-t border-white/[.06] bg-[#050816]/95 lg:hidden"
          >
            <div className="space-y-1 px-5 py-4">
              {links.map((link) => (
                <a
                  onClick={() => setOpen(false)}
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
