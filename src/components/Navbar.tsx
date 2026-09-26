import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

type Theme = 'dark' | 'light'

const links = [
  'About',
  'Skills',
  'Education',
  'Activities',
  'Projects',
  'GitHub',
  'Contact',
]

function BB8ThemeToggle({
  theme,
  onToggle,
  mobile = false,
}: {
  theme: Theme
  onToggle: () => void
  mobile?: boolean
}) {
  return (
    <div
      className={`navbar-bb8-wrapper ${
        mobile ? 'navbar-bb8-mobile' : ''
      }`}
    >
      <button
        type="button"
        className="bb8-theme-toggle-root"
        onClick={onToggle}
        aria-label={
          theme === 'dark'
            ? 'Switch to light theme'
            : 'Switch to dark theme'
        }
        aria-pressed={theme === 'light'}
        title={
          theme === 'dark'
            ? 'Switch to light mode'
            : 'Switch to dark mode'
        }
      >
        <span className="bb8-toggle" aria-hidden="true">
          <span className="bb8-toggle__scenery">
            <span className="bb8-toggle__cloud bb8-toggle__cloud--1" />
            <span className="bb8-toggle__cloud bb8-toggle__cloud--2" />

            <span className="bb8-toggle__star" />
            <span className="bb8-toggle__star bb8-toggle__star--2" />
          </span>

          <span className="bb8">
            <span className="bb8__body" />

            <span className="bb8__head">
              <span className="bb8__eye" />
              <span className="bb8__sensor" />
            </span>

            <span className="bb8__antenna" />
          </span>
        </span>
      </button>
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme')

    const initialTheme: Theme =
      savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : 'dark'

    setTheme(initialTheme)
    document.documentElement.dataset.theme = initialTheme
  }, [])

  const toggleTheme = () => {
    const nextTheme: Theme =
      theme === 'dark' ? 'light' : 'dark'

    setTheme(nextTheme)

    document.documentElement.dataset.theme = nextTheme

    localStorage.setItem(
      'portfolio-theme',
      nextTheme,
    )
  }

  return (
    <header className="site-navbar fixed inset-x-0 top-0 z-50 border-b border-white/[.06] backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* =========================
            BRAND
        ========================== */}

        <a
          href="#top"
          className="group flex items-center gap-4 font-mono text-base text-white"
        >
          {/* RM LOGO */}

          <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/[.05] text-sm font-medium text-cyan-300 transition duration-300 group-hover:border-cyan-300/50 group-hover:bg-cyan-300/[.08]">

            <span>RM</span>

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_14px_#c084fc]" />

          </span>

          {/* NAME */}

          <span className="hidden font-medium tracking-[.04em] sm:block">
            RUDDRHO

            <span className="text-cyan-300">
              {' '}MOLLIK
            </span>
          </span>
        </a>


        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

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


          {/* =========================
              BB-8 THEME TOGGLE
          ========================== */}

          <BB8ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
          />

        </div>


        {/* =========================
            MOBILE CONTROLS
        ========================== */}

        <div className="flex items-center gap-3 lg:hidden">

          <BB8ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
            mobile
          />

          <button
            type="button"
            onClick={() =>
              setOpen((value) => !value)
            }
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-lg text-slate-200 transition hover:border-cyan-300/20 hover:text-cyan-300"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

        </div>
      </nav>


      {/* =========================
          MOBILE MENU
      ========================== */}

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
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() =>
                    setOpen(false)
                  }
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
