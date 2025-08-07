import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";

const sortOptions = [
  { value: "rating", label: "Rating" },
  { value: "size", label: "File size" },
  { value: "name", label: "From A to Z" },
];

export type SortOptions = "rating" | "size" | "name" | "";

interface ISortSelectProps {
  selected: SortOptions;
  onChange: (option: SortOptions) => void;
}

export const SortSelect = ({ selected, onChange }: ISortSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useHandleOutsideClicks({ isActive: isOpen, ref: dropdownRef, stateChanger: setIsOpen });

  const handleSelect = (option: SortOptions) => {
    if (selected === option) {
      onChange("");
    } else {
      onChange(option);
    }
    setIsOpen(false);
  };

  const displayLabel = sortOptions.find((opt) => opt.value === selected)?.label || "Sort by";

  return (
    <div ref={dropdownRef} className="relative w-fit min-w-[150px] text-sm">
      <button
        title="Sort music"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full cursor-pointer text-[var(--gray-100)] bg-[var(--gray-700)] hover:bg-[var(--gray-600)] min-h-10 p-2 rounded-md flex justify-between items-center transition"
      >
        <span>{displayLabel}</span>
        <ChevronDown className={`transition-transform ${isOpen ? "-rotate-90" : ""}`} />
      </button>

      <div
        className={`absolute ${
          isOpen ? "translate-y-4 visible opacity-100" : "translate-y-0 invisible opacity-0"
        } w-full transition-all rounded-md z-50 bg-[var(--gray-700)] overflow-hidden`}
      >
        {sortOptions.map((option) => (
          <button
            title={option.label}
            type="button"
            key={option.value}
            onClick={() => handleSelect(option.value as SortOptions)}
            className={`px-4 py-2 w-full text-[var(--gray-100)] text-left transition
            ${
              selected === option.value
                ? "bg-[var(--gray-600)] font-semibold"
                : "cursor-pointer hover:bg-[var(--gray-600)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
