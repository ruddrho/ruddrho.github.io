import { AnimatedBackground } from './components/AnimatedBackground'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { About } from './sections/About'
import { Activities } from './sections/Activities'
import { Contact } from './sections/Contact'
import { Education } from './sections/Education'
import { Github } from './sections/Github'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export default function App(){return <div className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-200"><AnimatedBackground/><div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"/><Navbar/><main className="relative z-10"><Hero/><About/><Skills/><Education/><Activities/><Projects/><Github/><Contact/></main><Footer/></div>}
