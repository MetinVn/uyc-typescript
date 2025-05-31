export const Button = ({ title, onClick }: { title: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    type="button"
    className="p-2 rounded-md w-full text-sm cursor-pointer hover:bg-[var(--regular-button-bg)] text-[var(--regular-button-text)] hover:text-[var(--regular-button-text-hover)] transition"
  >
    {title}
  </button>
);

export const DangerButton = ({ title, onClick }: { title: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    type="button"
    className="p-2 rounded-md w-full text-sm cursor-pointer hover:bg-[var(--danger-button-bg-hover)] text-[var(--danger-button-text)] hover:text-[var(--danger-button-text-hover)] transition"
  >
    {title}
  </button>
);
