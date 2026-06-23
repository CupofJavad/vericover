"use client";

export interface FlowStep {
  id: string;
  label: string;
}

interface FlowStepperProps {
  steps: FlowStep[];
  currentStep: number;
  className?: string;
}

export function FlowStepper({ steps, currentStep, className = "" }: FlowStepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center gap-2 sm:gap-0">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                    isComplete
                      ? "bg-emerald-400 text-[#060b14]"
                      : isCurrent
                        ? "border-2 border-emerald-400 bg-emerald-400/10 text-emerald-300"
                        : "border border-white/15 bg-black/20 text-slate-500"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isComplete ? "✓" : stepNum}
                </span>
                <span
                  className={`max-w-[4.5rem] text-center text-[10px] leading-tight sm:max-w-none sm:text-left sm:text-xs ${
                    isCurrent ? "font-medium text-emerald-200" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-1 hidden h-px flex-1 sm:block ${
                    isComplete ? "bg-emerald-400/50" : "bg-white/10"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}