import { lazy, memo, Suspense, useRef, useState } from "react";
import placeholder from "../../images/kitty-reduced.webp";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import { AnimatePresence, motion } from "framer-motion";

export const GuestProfile = memo(() => {
  const [expand, setExpand] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => setExpand((prev) => !prev);
  const LazyGuestProfileDropdown = lazy(() => import("./home-page-profile-dropdown"));

  useHandleOutsideClicks({ isActive: expand, ref: dropdownRef, stateChanger: setExpand });

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
      y: "10px",
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div ref={dropdownRef} className="relative w-fit sm:mr-20">
      {/* Desktop view profile card */}
      <div
        onClick={handleToggle}
        className="hidden sm:flex items-center gap-1 p-1 rounded-full cursor-pointer bg-[var(--gray-800)] hover:opacity-90 active:bg-[var(--gray-700)] hover:bg-[var(--gray-700)] transition"
      >
        <img
          src={placeholder}
          alt="profile"
          draggable={false}
          className="w-15 h-15 rounded-full object-cover object-center"
        />
        <h1 className="px-2 text-[var(--gray-100)]">Guest Account</h1>
      </div>

      {/* Mobile view profile card */}
      <button
        onClick={handleToggle}
        className="sm:hidden flex items-end p-1 rounded-full bg-[var(--gray-700)] active:bg-[var(--gray-800)] transition"
      >
        <img src={placeholder} alt="profile" draggable={false} className="w-14 h-14 rounded-full object-cover" />
      </button>

      <AnimatePresence>
        {expand && (
          <motion.div
            key="dropdown-profile"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
          >
            <Suspense
              fallback={
                <div className="absolute text-center text-white inset-0 -translate-x-30 sm:translate-x-0 w-full min-w-40 h-20 p-4 rounded-xl z-20 bg-[var(--gray-800)]">
                  Loading...
                </div>
              }
            >
              <LazyGuestProfileDropdown />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
