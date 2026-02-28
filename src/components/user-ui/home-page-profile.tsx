import { lazy, memo, Suspense, useCallback, useRef, useState } from "react";
import { User } from "firebase/auth";

import { useMusicFormat } from "../../stores/shared/format-change";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import { signOutCurrentUser } from "../../services/user/firebase";
import { converted } from "../../stores/shared/converted-song";
import { notify } from "../../stores/shared/notification";
import { ImageLoader } from "../../utils/img-loader";
import { ProfileLoader } from "./profile-loader";
import { AnimatePresence, motion } from "framer-motion";
import { PopupLoader } from "./popup-loader";

export const UserProfile = memo(({ user }: { user: User }) => {
  const [expand, setExpand] = useState(false);
  const [confirmLogOut, setConfirmLogOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const confirmLogOutRef = useRef<HTMLDivElement>(null);

  const getOptimizedPhotoURL = (url: string | null | undefined, size: number) => {
    if (!url) return null;
    const urlObj = new URL(url);
    urlObj.searchParams.set("s", size.toString());
    return urlObj.toString();
  };

  const optimizedPhotoURL = getOptimizedPhotoURL(user.photoURL, 60);

  const LazyUserProfileDropdown = lazy(() => import("./home-page-profile-dropdown"));
  const LazyUserProfilePopup = lazy(() => import("./home-page-profile-popup"));

  const resetFormat = useMusicFormat((state) => state.resetFormat);
  useHandleOutsideClicks({ isActive: expand, ref: dropdownRef, stateChanger: setExpand });
  useHandleOutsideClicks({ isActive: confirmLogOut, ref: confirmLogOutRef, stateChanger: setConfirmLogOut });

  const handleToggle = useCallback(() => {
    setExpand((prev) => !prev);
  }, []);

  const handleLogOutPopup = useCallback(() => {
    setConfirmLogOut((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
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
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-fit sm:mr-20">
      {/* Desktop view profile */}
      <div
        onClick={handleToggle}
        className="hidden sm:flex items-center gap-1 p-1 rounded-xl cursor-pointer bg-[var(--gray-700)] hover:opacity-90 active:bg-[var(--gray-500)] hover:bg-[var(--gray-600)] transition"
      >
        <ImageLoader
          imgSrc={optimizedPhotoURL}
          loading="eager"
          className="w-15 h-15 rounded-full object-cover object-center"
        />
        <div className="flex flex-col items-start px-2 text-left">
          <h1 className="text-sm max-w-[125px] truncate text-[var(--gray-100)]">{user?.displayName || "User"}</h1>
          <p className="text-xs max-w-[135px] truncate text-[var(--gray-400)]">{user?.email || "example@gmail.com"}</p>
        </div>
      </div>

      {/* Mobile view profile */}
      <button
        onClick={handleToggle}
        className="sm:hidden flex items-center justify-center p-1 rounded-full cursor-pointer bg-[var(--gray-700)] active:bg-[var(--gray-800)] transition"
      >
        <ImageLoader imgSrc={optimizedPhotoURL} className="w-14 h-14 rounded-full object-cover" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {expand && (
          <motion.div
            initial={{ opacity: 0, y: "100%", visibility: "hidden" }}
            animate={{ opacity: 1, y: "120%", visibility: "visible" }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <Suspense fallback={<ProfileLoader />}>
              <LazyUserProfileDropdown onLogOut={handleLogOutPopup} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {confirmLogOut && (
        <Suspense fallback={<PopupLoader />}>
          <LazyUserProfilePopup
            confirmLogOutRef={confirmLogOutRef}
            handleLogOutPopup={handleLogOutPopup}
            handleSignOut={handleSignOut}
          />
        </Suspense>
      )}
    </div>
  );
});
