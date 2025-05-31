interface CustomInputProps {
  onValueChange: (value: string) => void;
}

export const CustomInput = ({ onValueChange }: CustomInputProps) => (
  <input
    type="text"
    name="musicLink"
    placeholder="Paste YouTube link here…"
    onChange={(e) => onValueChange(e.target.value)}
    className=" text-[var(--homepage-body-input-text)] text-sm w-full py-3 px-1 sm:p-3 focus:outline-none focus:ring-0 sm:focus:ring-2 rounded-md placeholder-[var(--homepage-body-input-placeholder)] focus:ring-[var(--homepage-body-input-focus)] transition"
  />
);
