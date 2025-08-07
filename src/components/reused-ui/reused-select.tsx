import { useState, useRef, memo } from "react";
import { ChevronDown } from "lucide-react";
import { Music2, Video } from "lucide-react";
import { AvailableFormats, useMusicFormat } from "../../stores/shared/format-change";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import { email } from "../../stores/user/user-state";

const iconMap: Record<AvailableFormats, React.JSX.Element> = {
  mp3: <Music2 size={15} />,
  mp4: <Video size={15} />,
};

export const CustomSelect = memo(() => {
  const formats: AvailableFormats[] = ["mp3", "mp4"];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useHandleOutsideClicks({ isActive: isOpen, ref: dropdownRef, stateChanger: setIsOpen });
  const currentFormat = useMusicFormat((state) => state.format);
  const setCurrentFormat = useMusicFormat((state) => state.setFormat);

  return (
    <div ref={dropdownRef} className="relative w-fit text-sm">
      <button
        title="Choose format"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full cursor-pointer text-[var(--gray-100)] bg-[var(--gray-700)] hover:bg-[var(--gray-600)] min-h-10 p-2 rounded-md flex justify-between items-center transition"
      >
        <div className="flex items-center gap-2">
          {iconMap[currentFormat]}
          {currentFormat.toUpperCase()}
        </div>
        <ChevronDown size={15} className={`transition-transform ${isOpen ? "-rotate-90" : ""}`} />
      </button>

      <div
        className={`absolute ${
          isOpen ? "translate-y-4 visible opacity-100" : "translate-y-0 invisible opacity-0"
        } w-full transition-all rounded-md z-50 bg-[var(--gray-700)] overflow-hidden`}
      >
        {formats.map((option) => {
          const isDisabled = option === "mp4" && !email.state();
          return (
            <button
              title={option}
              type="button"
              key={option}
              onClick={() => {
                if (!isDisabled) {
                  setCurrentFormat(option);
                  setIsOpen(false);
                }
              }}
              disabled={isDisabled}
              className={`px-4 py-2 w-full text-[var(--gray-100)] flex items-center gap-2 transition
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--gray-600)]"}`}
            >
              {iconMap[option]}
              {option.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
});
