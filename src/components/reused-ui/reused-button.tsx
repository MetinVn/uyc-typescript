export const Button = ({ title, onClick }: { title: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    type="button"
    className="p-2 rounded-md w-full text-sm cursor-pointer bg-[var(--gray-700)] text-[var(--gray-100)] hover:bg-[var(--gray-600)] hover:text-[var(--accent-500)] transition"
  >
    {title}
  </button>
);

export const DangerButton = ({ title, onClick }: { title: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    type="button"
    className="p-2 rounded-md w-full text-sm cursor-pointer bg-[var(--red-700)] text-[var(--gray-100)] hover:bg-[var(--red-500)] hover:text-[var(--red-200)] transition"
  >
    {title}
  </button>
);
