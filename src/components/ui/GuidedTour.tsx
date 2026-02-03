"use client";

import { useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Compass } from "lucide-react";

export interface GuidedTourStep {
  title: string;
  description: string;
}

interface GuidedTourProps {
  steps: GuidedTourStep[];
  sectionRefs: React.RefObject<HTMLElement | null>[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
  /** Fond semi-transparent pour recentrer l'attention (défaut: false) */
  showBackdrop?: boolean;
  /** Mettre en avant la section ciblée avec un contour (défaut: true) */
  highlightSection?: boolean;
  /** Clic sur la section surlignée = étape suivante (défaut: true) */
  clickSectionToAdvance?: boolean;
}

const HIGHLIGHT_CLASS = "guided-tour-highlight";
const CLICKABLE_CLASS = "guided-tour-clickable";

export function GuidedTour({
  steps,
  sectionRefs,
  currentStep,
  onNext,
  onPrev,
  onEnd,
  showBackdrop = false,
  highlightSection = true,
  clickSectionToAdvance = true,
}: GuidedTourProps) {
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const prevStepRef = useRef(currentStep);

  const removeHighlight = useCallback(() => {
    const prevRef = sectionRefs[prevStepRef.current];
    if (prevRef?.current?.classList) {
      prevRef.current.classList.remove(HIGHLIGHT_CLASS);
    }
  }, [sectionRefs]);

  const applyHighlight = useCallback(
    (index: number) => {
      if (!highlightSection) return;
      const ref = sectionRefs[index];
      if (ref?.current) {
        ref.current.classList.add(HIGHLIGHT_CLASS);
        if (clickSectionToAdvance) ref.current.classList.add(CLICKABLE_CLASS);
      }
    },
    [sectionRefs, highlightSection, clickSectionToAdvance]
  );

  const removeClickable = useCallback(() => {
    const prevRef = sectionRefs[prevStepRef.current];
    if (prevRef?.current?.classList) {
      prevRef.current.classList.remove(CLICKABLE_CLASS);
    }
  }, [sectionRefs]);

  // Scroll + highlight + clic sur la section pour avancer
  useEffect(() => {
    const el = sectionRefs[currentStep]?.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    removeHighlight();
    removeClickable();
    applyHighlight(currentStep);
    prevStepRef.current = currentStep;

    if (!el || !clickSectionToAdvance) {
      return () => {
        removeHighlight();
        removeClickable();
      };
    }

    const handleSectionClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button'], input, [data-tour-ignore]")) return;
      e.preventDefault();
      e.stopPropagation();
      if (currentStep === steps.length - 1) onEnd();
      else onNext();
    };
    el.addEventListener("click", handleSectionClick, true);
    return () => {
      el.removeEventListener("click", handleSectionClick, true);
      removeHighlight();
      removeClickable();
    };
  }, [
    currentStep,
    sectionRefs,
    removeHighlight,
    removeClickable,
    applyHighlight,
    clickSectionToAdvance,
    steps.length,
    onNext,
    onEnd,
  ]);

  if (!step) return null;

  return (
    <>
      {showBackdrop && (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity"
          aria-hidden
          onClick={onEnd}
        />
      )}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pb-6 sm:pb-8 guided-tour-card">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-lg w-full overflow-hidden">
          <div className="flex items-start gap-3 p-4 sm:p-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-primary uppercase tracking-wide">
                Étape {currentStep + 1} / {steps.length}
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-0.5">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
              {clickSectionToAdvance && (
                <p className="text-xs text-primary/80 mt-2 font-medium">
                  Cliquez sur la zone surlignée pour continuer
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onEnd}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-transform ${
                    i === currentStep ? "bg-primary scale-110" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            {isLast ? (
              <button
                type="button"
                onClick={onEnd}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90"
              >
                Terminer
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
