type BB8ThemeToggleProps = {
  theme: 'dark' | 'light'
  onToggle: () => void
}

export function BB8ThemeToggle({
  theme,
  onToggle,
}: BB8ThemeToggleProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="bb8-theme-toggle-root"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className="bb8-toggle">
        {/* SCENERY */}
        <span className="bb8-toggle__scenery">
          {/* SUN / MOON */}
          <span className="bb8-toggle__star" />
          <span className="bb8-toggle__star bb8-toggle__star--2" />

          {/* CLOUDS */}
          <span className="bb8-toggle__cloud bb8-toggle__cloud--1" />
          <span className="bb8-toggle__cloud bb8-toggle__cloud--2" />

          {/* BB-8 */}
          <span className="bb8">
            <span className="bb8__antenna" />

            <span className="bb8__body" />

            <span className="bb8__head">
              <span className="bb8__eye" />
              <span className="bb8__sensor" />
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}
