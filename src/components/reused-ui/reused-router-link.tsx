import { Link } from "react-router-dom";

export const CustomLink = ({ title, path, replace }: { title: string; path: string; replace?: boolean }) => (
  <Link
    replace={replace || false}
    title={"Go to: " + path}
    to={path}
    className="p-2 rounded-md bg-[var(--gray-700)] hover:bg-[var(--gray-600)] w-full text-sm text-[var(--gray-100)] hover:text-[var(--accent-500)] transition"
  >
    {title}
  </Link>
);
