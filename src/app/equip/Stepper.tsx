'use client';

const steps = [
  { num: 1, label: 'Choose Loadout', path: '/equip' },
  { num: 2, label: 'Configure', path: '/equip/configure' },
  { num: 3, label: 'Generate Files', path: '/equip/generate' },
  { num: 4, label: 'Deploy', path: '/equip/deploy' },
];

export function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 py-6">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              s.num < current ? 'bg-emerald-500 border-emerald-500 text-black' :
              s.num === current ? 'border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]' :
              'border-zinc-700 text-zinc-600'
            }`}>
              {s.num < current ? '✓' : s.num}
            </div>
            <span className={`text-xs sm:text-sm font-medium hidden sm:inline ${
              s.num <= current ? 'text-emerald-400' : 'text-zinc-600'
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 sm:w-16 h-0.5 ${s.num < current ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
