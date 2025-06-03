import { useRef, useState } from "react";
import placeholder from "../../images/kitty.jpg";
import { ROUTES } from "../../routes/routes";
import { CustomLink } from "../reused-ui/reused-router-link";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";

export const GuestProfile = () => {
  const [expand, setExpand] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleToggle = () => setExpand((prev) => !prev);

  const featuresToUnlock = [
    { icon: "★", label: "Favorite songs" },
    { icon: "✩", label: "Rate songs" },
    { icon: "♫", label: "Playlists" },
    { icon: "🎬", label: "Convert to MP4" },
  ];

  useHandleOutsideClicks({ isActive: expand, ref: dropdownRef, stateChanger: setExpand });

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
          className="w-15 h-15 rounded-full object-cover object-top"
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

      {/* Dropdown */}
      <div
        className={`${
          expand ? "translate-y-4 opacity-100 visible" : "translate-y-0 opacity-0 invisible"
        } absolute right-1/2 translate-x-4 sm:translate-x-1/2 top-full min-w-55 w-full p-4 rounded-xl z-20 transition-all bg-[var(--gray-800)]`}
      >
        <div className="flex flex-col gap-1 text-[var(--gray-100)]">
          {/* Welcome section */}
          <div className="text-center text-xs">
            <p className="font-semibold">&#128075; Welcome!</p>
            <p>Sign in to access these features:</p>
          </div>

          {/* Feature List */}
          <ul className="space-y-1 text-xs">
            {featuresToUnlock.map((item, index) => (
              <li key={index} className="flex items-center gap-2 pl-1">
                <span className="w-4 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          {/* Action buttons */}
          <div className="flex flex-col font-medium items-center text-center gap-1">
            <CustomLink path={ROUTES.AUTH.SIGN_IN} title="Sign in" />
            <CustomLink path={ROUTES.AUTH.SIGN_UP} title="Create Account" />
          </div>
        </div>
      </div>
    </div>
  );
};
