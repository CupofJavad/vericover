"use client";

export type TimelineStatus = "complete" | "current" | "upcoming";

export interface TimelineStep {
  title: string;
  description: string;
  status: TimelineStatus;
}

interface WhatHappensNextProps {
  title?: string;
  steps: TimelineStep[];
  className?: string;
}

export function WhatHappensNext({
  title = "What happens next",
  steps,
  className = "",
}: WhatHappensNextProps) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-black/20 p-5 ${className}`}
    >
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <ol className="mt-4 space-y-0">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
            {index < steps.length - 1 && (
              <span
                className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-px ${
                  step.status === "complete" ? "bg-emerald-400/40" : "bg-white/10"
                }`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                step.status === "complete"
                  ? "bg-emerald-400 text-[#060b14]"
                  : step.status === "current"
                    ? "border-2 border-emerald-400 bg-emerald-400/10 text-emerald-300"
                    : "border border-white/15 bg-[#131f35] text-slate-500"
              }`}
            >
              {step.status === "complete" ? "✓" : index + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={`text-sm font-medium ${
                  step.status === "upcoming" ? "text-slate-500" : "text-slate-200"
                }`}
              >
                {step.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}