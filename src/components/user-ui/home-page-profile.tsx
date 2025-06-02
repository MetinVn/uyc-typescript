import { useRef, useState } from "react";
import placeholder from "../../images/profilePic.avif";
import { ROUTES } from "../../routes/routes";
import { DangerButton } from "../reused-ui/reused-button";
import { CustomLink } from "../reused-ui/reused-router-link";
import { User } from "firebase/auth";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import { signOutCurrentUser } from "../../services/user/firebase";
import { notify } from "../../stores/shared/notification";
import { useMusicFormat } from "../../stores/shared/format-change";
import { converted } from "../../stores/shared/converted-song";

export const UserProfile = ({ user }: { user: User }) => {
  const [expand, setExpand] = useState(false);
  const [imgSrc, setImgSrc] = useState(user.photoURL || placeholder);
  const [confirmLogOut, setConfirmLogOut] = useState(false);
  const handleToggle = () => setExpand((prev) => !prev);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const resetFormat = useMusicFormat((state) => state.resetFormat);
  useHandleOutsideClicks({ isActive: expand, ref: dropdownRef, stateChanger: setExpand });

  const handleLogOutPopup = () => {
    setConfirmLogOut(true);
  };

  const handleSignOut = async () => {
    const result = await signOutCurrentUser();
    if (result) {
      resetFormat();
      converted.clear();
      setConfirmLogOut(false);
      notify.success("Signed out succesfully", 2500);
      return true;
    }
    notify.error("Unexpected error happened while signing you out, please try again.", 2500);
    return false;
  };

  return (
    <div ref={dropdownRef} className="relative w-fit sm:mr-20">
      {/* Desktop view profile */}
      <div
        onClick={handleToggle}
        className="hidden sm:flex items-center gap-1 p-1 rounded-full cursor-pointer bg-[var(--homepage-profile-bg)] hover:opacity-90 active:bg-[var(--homepage-profile-bg-active)] transition"
      >
        <img
          src={imgSrc}
          alt="profile picture"
          draggable={false}
          onError={() => setImgSrc(placeholder)}
          className="w-15 h-15 rounded-full object-cover object-center"
        />
        <div className="flex flex-col items-start px-2 text-left">
          <h1 className="text-sm max-w-[125px] truncate text-[var(--homepage-profile-user-name)]">
            {user?.displayName || "User"}
          </h1>
          <p className="text-xs max-w-[135px] truncate text-[var(--homepage-profile-user-email)]">
            {user?.email || "example@gmail.com"}
          </p>
        </div>
      </div>

      {/* Mobile view profile */}
      <button
        onClick={handleToggle}
        className="sm:hidden flex items-center justify-center p-1 rounded-full cursor-pointer bg-[var(--homepage-profile-guest-bg)] active:bg-[var(--homepage-profile-bg-active)] transition"
      >
        <img
          src={user.photoURL || placeholder}
          alt="profile"
          draggable={false}
          className="w-14 h-14 rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
      <div
        className={`${
          expand ? "translate-y-4 opacity-100 visible" : "translate-y-0 opacity-0 invisible"
        } absolute right-1/2 translate-x-4 sm:translate-x-1/2 top-full w-full min-w-35 p-4 rounded-xl z-20 transition-all bg-[var(--homepage-profile-dropdown-bg)]`}
      >
        <div className="flex flex-col font-medium items-center text-center gap-2 text-[var(--homepage-profile-dropdown-text)]">
          <CustomLink path={ROUTES.AUTH.ACCOUNT} title="Account" />
          <CustomLink path={ROUTES.MUSIC} title="My music" />
          <hr className="text-[#9f2323] h-[1px] w-full" />
          <DangerButton onClick={handleLogOutPopup} title="Log out" />
        </div>
      </div>

      {confirmLogOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 sm:px-0 overflow-y-auto">
          <div className="bg-[#3e3e3e] text-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-auto my-10 shadow-lg">
            <p className="text-sm text-gray-300 mb-4">Are you sure to logout?</p>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                onClick={() => setConfirmLogOut(false)}
                className="bg-[#606060] hover:bg-[#7b7b7b] cursor-pointer px-4 py-2 rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 cursor-pointer px-4 py-2 rounded-md transition"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
