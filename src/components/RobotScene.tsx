import { motion } from 'framer-motion'

export function RobotScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px] select-none">
      <div className="absolute inset-[8%] rounded-full border border-cyan-300/10 bg-cyan-300/[.015] shadow-[inset_0_0_80px_rgba(34,211,238,.04)]" />
      <motion.div className="absolute inset-[15%] rounded-full border border-dashed border-cyan-300/20" animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="absolute inset-[25%] rounded-full border border-dashed border-purple-400/20" animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} />
      <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full drop-shadow-[0_0_20px_rgba(34,211,238,.18)]">
        <defs><linearGradient id="arm" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#67e8f9"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
        <g fill="none" stroke="url(#arm)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <motion.g animate={{ rotate: [0, 3, -2, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '300px 480px' }}>
            <path d="M210 500h180l-22-50H232z" opacity=".8"/><circle cx="300" cy="430" r="46"/><path d="M300 384l55-120"/><circle cx="360" cy="250" r="36"/><path d="M389 229l83-64"/><circle cx="486" cy="153" r="25"/><path d="M500 133l28-38m-20 50l46-5m-58 24l28 34"/>
            <path d="M279 394l52-115M329 396l59-116M389 223l75-78M404 245l78-66" opacity=".45"/>
          </motion.g>
        </g>
        <g fill="#67e8f9"><circle cx="300" cy="430" r="6"/><circle cx="360" cy="250" r="5"/><circle cx="486" cy="153" r="4"/></g>
        <g fontFamily="monospace" fontSize="12" fill="#94a3b8"><text x="70" y="160">JOINT_03 // 42.8°</text><text x="390" y="380">CTRL: CLOSED_LOOP</text><text x="80" y="440">STATE: NOMINAL</text></g>
        <g stroke="#67e8f9" opacity=".25"><path d="M100 180h80m-80 0v50M430 405h75m0 0v-50"/><circle cx="120" cy="310" r="3"/><circle cx="530" cy="300" r="3"/></g>
      </svg>
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [.35, .8, .35] }} transition={{ duration: 3, repeat: Infinity }} className="absolute right-[4%] top-[44%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_25px_#22d3ee]" />
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#07101f]/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[.24em] text-cyan-200 backdrop-blur">Robotic Manipulator // Live Model</div>
    </div>
  )
}
