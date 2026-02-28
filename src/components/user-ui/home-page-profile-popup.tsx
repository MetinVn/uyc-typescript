import { memo, RefObject } from "react";

type UserProfilePopupProps = {
  confirmLogOutRef: RefObject<HTMLDivElement | null>;
  handleLogOutPopup: () => void;
  handleSignOut: () => void;
};

export const UserProfilePopup = memo(
  ({ handleLogOutPopup, handleSignOut, confirmLogOutRef }: UserProfilePopupProps) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,24,27,0.7)] px-4 sm:px-0 overflow-y-auto">
        <div
          ref={confirmLogOutRef}
          className="bg-[var(--gray-800)] text-[var(--gray-100)] rounded-xl p-4 sm:p-6 w-full max-w-md mx-auto my-10 shadow-lg"
        >
          <p className="text-sm text-[var(--gray-400)] mb-4">Are you sure to logout?</p>
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
            <button
              onClick={handleLogOutPopup}
              className="bg-[var(--gray-700)] hover:bg-[var(--gray-600)] cursor-pointer px-4 py-2 rounded-md transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="bg-[var(--red-700)] hover:bg-[var(--red-500)] cursor-pointer px-4 py-2 rounded-md transition"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default UserProfilePopup;
