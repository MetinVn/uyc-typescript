import { lazy, memo, Suspense, useRef, useState } from "react";
import placeholder from "../../images/kitty-reduced.webp";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import { ProfileLoader } from "./home-page-dropdown-skeleton";

export const GuestProfile = memo(() => {
  const [expand, setExpand] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => setExpand((prev) => !prev);

  useHandleOutsideClicks({
    isActive: expand,
    ref: dropdownRef,
    stateChanger: setExpand,
  });

  const LazyGuestProfileDropdown = lazy(
    () => import("./home-page-profile-dropdown")
  );

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
        <img
          src={placeholder}
          alt="profile"
          draggable={false}
          className="w-14 h-14 rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
      <div
        className={`${
          expand
            ? "translate-y-4 opacity-100 visible"
            : "translate-y-0 opacity-0 invisible"
        } absolute right-1/2 translate-x-4 sm:translate-x-1/2 top-full min-w-55 w-full p-4 rounded-xl z-20 transition-all bg-[var(--gray-800)]`}
      >
        {expand && (
          <Suspense fallback={<ProfileLoader />}>
            <LazyGuestProfileDropdown />
          </Suspense>
        )}
      </div>
    </div>
  );
});
