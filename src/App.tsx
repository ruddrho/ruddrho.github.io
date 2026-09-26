import { useEffect, useState } from 'react'

import { AnimatedBackground } from './components/AnimatedBackground'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { WelcomeIntro } from './components/WelcomeIntro'
import { ScrollProgress } from './components/ScrollProgress'

import { About } from './sections/About'
import { Activities } from './sections/Activities'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Github } from './sections/Github'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('portfolio-theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return 'dark'
  })

  /* =====================================================
      THEME SYSTEM
  ====================================================== */

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark' ? 'light' : 'dark',
    )
  }

  return (
    <div
      className={`portfolio-app relative min-h-screen bg-[#050816] text-slate-200 ${
        theme === 'light' ? 'theme-light' : 'theme-dark'
      } ${
        showIntro ? 'h-screen overflow-hidden' : 'overflow-hidden'
      }`}
    >
      {/* EXISTING WEBSITE BACKGROUND */}
      <AnimatedBackground />

      {/* ANIMATED SCROLL PROGRESS */}
      {!showIntro && <ScrollProgress />}

      {/* EXISTING GRID BACKGROUND */}
      <div className="portfolio-grid fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

      {/* EXISTING WEBSITE */}
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Education />
        <Activities />
        <Projects />
        <Github />
        <Contact />
      </main>

      <Footer />

      {/* =====================================================
          BB-8 THEME TOGGLE MOUNT POINT
          Visual BB-8 toggle will be added in the next step.
      ====================================================== */}

      {!showIntro && (
        <div
          id="bb8-theme-toggle-root"
          data-theme={theme}
          data-theme-toggle-ready="true"
          onClick={toggleTheme}
          className="bb8-theme-toggle-root"
          role="button"
          tabIndex={0}
          aria-label={`Switch to ${
            theme === 'dark' ? 'light' : 'dark'
          } theme`}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              toggleTheme()
            }
          }}
        />
      )}

      {/* CINEMATIC WELCOME SCREEN */}
      {showIntro && (
        <WelcomeIntro
          onEnter={() => {
            setShowIntro(false)

            window.scrollTo({
              top: 0,
              behavior: 'instant',
            })
          }}
        />
      )}
    </div>
  )
}
