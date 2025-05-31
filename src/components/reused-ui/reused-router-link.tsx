import { Link } from "react-router-dom";

export const CustomLink = ({ title, path, replace }: { title: string; path: string; replace?: boolean }) => (
  <Link
    replace={replace || false}
    title={"Go to: " + path}
    to={path}
    className="p-2 rounded-md bg-[var(--router-link-bg)] hover:bg-[var(--router-link-bg-hover)] w-full text-sm text-[var(--router-link-text)] hover:text-[var(--router-link-text-hover)] transition"
  >
    {title}
  </Link>
);
