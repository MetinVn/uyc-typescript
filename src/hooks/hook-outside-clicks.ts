import { useEffect } from "react";

type HandleOutsideClicksProps = {
  isActive: boolean;
  ref: React.RefObject<HTMLElement | null>;
  stateChanger: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useHandleOutsideClicks = ({ isActive, ref, stateChanger }: HandleOutsideClicksProps): void => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        stateChanger(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, ref, stateChanger]);
};
