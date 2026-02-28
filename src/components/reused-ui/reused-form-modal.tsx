import { memo } from "react";
import { ButtonState } from "../../types/types-animating-button";
import { AnimatingButton } from "./reused-animating-button";

interface IFormModal {
  children: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
  title: string;
  dangerTitle?: boolean;

  buttonState: ButtonState;
  onCloseModal: () => void;
  animButtonText: string;
  animButtonId: string;
  onSubmit: (e: React.FormEvent<HTMLElement>) => void;
}

export const FormModal = memo(
  ({
    children,
    ref,
    title,
    dangerTitle = false,

    buttonState,
    onCloseModal,
    animButtonText,
    animButtonId,
    onSubmit,
  }: IFormModal) => {
    return (
      <div
        id={animButtonId}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,24,27,0.7)] px-4 sm:px-0 overflow-y-auto"
      >
        <div
          ref={ref}
          className="bg-[var(--gray-800)] text-[var(--gray-100)] rounded-xl p-4 sm:p-6 w-full max-w-md my-10 shadow-lg"
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              dangerTitle ? "text-[var(--red-500)]" : ""
            }`}
          >
            {title}
          </h3>

          {children}
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 mt-4">
            <button
              type="button"
              disabled={buttonState !== "default"}
              onClick={onCloseModal}
              className="bg-[var(--gray-700)] hover:bg-[var(--gray-600)] text-[var(--gray-100)] hover:text-[var(--accent-500)] cursor-pointer px-4 py-2 rounded-md transition"
            >
              Cancel
            </button>
            <AnimatingButton
              fullWidth
              defaultText={animButtonText}
              id={animButtonId}
              setButtonState={onSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
);
