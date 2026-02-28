import { memo } from "react";
import { ROUTES } from "../../routes/routes";
import { DangerButton } from "../reused-ui/reused-button";
import { CustomLink } from "../reused-ui/reused-router-link";

export const UserProfileDropdown = memo(({ onLogOut }: { onLogOut: () => void }) => {
  return (
    <div className="w-full min-w-35 p-4 rounded-xl z-20 bg-[var(--gray-800)]">
      <div className="flex flex-col font-medium items-center text-center gap-2">
        <CustomLink path={ROUTES.AUTH.ACCOUNT} title="Account" />
        <CustomLink path={ROUTES.MUSIC} title="My music" />
        <hr className="text-[var(--red-700)] h-[1px] w-full" />
        <DangerButton onClick={onLogOut} title="Log out" />
      </div>
    </div>
  );
});

export default UserProfileDropdown;
