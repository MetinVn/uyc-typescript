import { useEffect } from "react";

type HandleOutsideClicksProps = {
  isActive: boolean;
  ref: React.RefObject<HTMLElement | null>;
  stateChanger: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useHandleOutsideClicks = ({ isActive, ref, stateChanger }: HandleOutsideClicksProps): void => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyStrokes = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stateChanger(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        stateChanger(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyStrokes);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyStrokes);
    };
  }, [isActive, ref, stateChanger]);
};
