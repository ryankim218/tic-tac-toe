"use client";

import { SYMBOLS } from "@/lib/icons";

type IconSelectorProps = {
  label: string;
  selected: string;
  taken: string;
  onSelect: (emoji: string) => void;
};

export function IconSelector({
  label,
  selected,
  taken,
  onSelect,
}: IconSelectorProps) {
  return (
    <div>
      <p id={label} className="mb-2 text-sm font-medium text-ink">
        Symbol
      </p>
      <div
        className="grid grid-cols-4 gap-2"
        role="listbox"
        aria-labelledby={label}
      >
        {SYMBOLS.map((symbol) => {
          const unavailable = symbol.emoji === taken;
          const isSelected = symbol.emoji === selected;
          return (
            <button
              key={symbol.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={unavailable}
              disabled={unavailable}
              title={unavailable ? `${symbol.name} is taken` : symbol.name}
              onClick={() => onSelect(symbol.emoji)}
              className={`flex h-16 flex-col items-center justify-center rounded-xl border text-xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice disabled:cursor-not-allowed disabled:opacity-35 ${
                isSelected
                  ? "border-ice bg-ice/10"
                  : "border-line bg-surface hover:border-[#3d5278]"
              }`}
            >
              <span aria-hidden="true">{symbol.emoji}</span>
              <span className="mt-0.5 text-[10px] font-medium tracking-wide text-muted">
                {symbol.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
