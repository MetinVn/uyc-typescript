import { useState, memo, lazy, Suspense, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Music2, Video } from "lucide-react";
import { AvailableFormats, useMusicFormat } from "../../../stores/shared/format-change";
import { useHandleOutsideClicks } from "../../../hooks/hook-outside-clicks";
import { AnimatePresence, motion } from "framer-motion";

export const CustomSelect = memo(() => {
  const LazyCustomSelectDropdown = lazy(() => import("./reused-select-dropdown"));
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const currentFormat = useMusicFormat((state) => state.format);

  useHandleOutsideClicks({ isActive: isOpen, ref: dropdownRef, stateChanger: setIsOpen });

  const iconMap: Record<AvailableFormats, React.JSX.Element> = {
    mp3: <Music2 size={15} />,
    mp4: <Video size={15} />,
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 0,
      transition: {
        duration: 0.1,
      },
    },
    visible: {
      opacity: 1,
      y: "1rem",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown-select"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className={`absolute w-full rounded-md z-50 bg-[var(--gray-700)] overflow-hidden`}
          >
            <Suspense
              fallback={
                <div className="w-full h-10 flex items-center justify-center text-[var(--gray-300)]">Loading...</div>
              }
            >
              <LazyCustomSelectDropdown onClose={setIsOpen} iconMap={iconMap} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
