const Loading = () => {
  return (
    <>
      <div className="relative flex h-10 w-10 items-center justify-center">
      {/* Glow */}
      <div
        className="
          absolute inset-0 rounded-full
          bg-emerald-500/10 blur-md
          dark:bg-orange-500/15
          dark:blur-lg
        "
      />

      {/* Outer ring */}
      <div
        className="
          absolute inset-0 rounded-full
          border-[3px]
          border-emerald-200
          border-t-emerald-600
          animate-spin
          dark:border-orange-950/60
          dark:border-t-orange-400
          dark:shadow-[0_0_12px_rgba(251,146,60,0.65)]
        "
      />

      {/* Inner ring — opposite direction */}
      <div
        className="
          absolute inset-1.5 rounded-full
          border-2
          border-emerald-100
          border-b-emerald-500
          animate-[spin_1.2s_linear_infinite_reverse]
          dark:border-orange-950/50
          dark:border-b-orange-300
          dark:shadow-[0_0_8px_rgba(251,146,60,0.5)]
        "
      />

      {/* Center */}
      <div
        className="
          h-1.5 w-1.5 rounded-full
          bg-emerald-500
          animate-pulse
          dark:bg-orange-300
          dark:shadow-[0_0_8px_rgba(253,186,116,1)]
        "
      />
    </div>
    </>
  )
}

export default Loading