type CustomInputProps = {
  onValueChange: (value: string) => void;
  value: string;
};

export const CustomInput = ({ onValueChange, value }: CustomInputProps) => (
  <input
    type="text"
    name="musicLink"
    placeholder="Paste YouTube link here…"
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="bg-[var(--gray-700)] text-[var(--gray-100)] text-sm w-full py-3 px-1 sm:p-3 border border-[var(--gray-600)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] rounded-md placeholder-[var(--gray-400)] transition"
  />
);
