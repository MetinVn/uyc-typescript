import { AvailableFormats, useMusicFormat } from "../../../stores/shared/format-change";
import { email } from "../../../stores/user/user-state";

interface CustomSelectDropdownProps {
  onClose: (state: boolean) => void;
  iconMap: Record<AvailableFormats, React.JSX.Element>;
}

export const CustomSelectDropdown = ({ onClose, iconMap }: CustomSelectDropdownProps) => {
  const formats: AvailableFormats[] = ["mp3", "mp4"];
  const setCurrentFormat = useMusicFormat((state) => state.setFormat);

  return (
    <>
      {formats.map((option) => {
        const isDisabled = option === "mp4" && !email.state();
        return (
          <button
            title={option}
            type="button"
            key={option}
            onClick={() => {
              if (!isDisabled) {
                setCurrentFormat(option);
                onClose(false);
              }
            }}
            disabled={isDisabled}
            className={`px-4 py-2 w-full text-[var(--gray-100)] flex items-center gap-2 transition
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--gray-600)]"}`}
          >
            {iconMap[option]}
            {option.toUpperCase()}
          </button>
        );
      })}
    </>
  );
};

export default CustomSelectDropdown;
