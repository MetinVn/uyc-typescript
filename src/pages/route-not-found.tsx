import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-2xl font-semibold mb-2">Page Not Found</p>
      <p className="text-zinc-400 mb-6 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
      </p>
      <Link
        to={ROUTES.HOME}
        className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
