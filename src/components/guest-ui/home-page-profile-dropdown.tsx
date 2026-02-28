import { ROUTES } from "../../routes/routes";
import { CustomLink } from "../reused-ui/reused-router-link";

export const GuestProfileDropdown = () => {
  const featuresToUnlock = [
    { icon: "★", label: "Favorite songs" },
    { icon: "✩", label: "Rate songs" },
    { icon: "♫", label: "Playlists" },
    { icon: "🎬", label: "Convert to MP4" },
  ];

  return (
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
  );
};

export default GuestProfileDropdown;
