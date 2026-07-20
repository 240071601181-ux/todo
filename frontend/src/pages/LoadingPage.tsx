export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">
          Loading
        </span>
      </div>
    </div>
  )
}
