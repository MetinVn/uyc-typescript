import { memo } from "react";
import { useButtonState } from "../../stores/shared/button-state";

interface GoogleSignInButtonProps {
  onClick: (e: any) => void;
  id: string;
}

export const RegisterWithGoogle = memo(
  (props: GoogleSignInButtonProps) => {
    const buttonState = useButtonState((s) => s.getButtonState(props.id));

    return (
      <button
        type="button"
        disabled={buttonState !== "default"}
        onClick={props.onClick}
        className="w-full flex items-center justify-center gap-3 bg-white text-black py-2 rounded-md hover:bg-gray-200 transition-colors"
      >
        <svg width={10} height={10} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={""}>
          <path
            fill="#4285F4"
            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37.5 24 37.5c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 3.2l6.4-6.4C34.6 4.9 29.5 3 24 3 12.9 3 3 12.9 3 24s9.9 21 21 21c11.1 0 20.1-8.9 21-20.1z"
          />
        </svg>
        <span className="text-sm font-medium">Continue with Google</span>
      </button>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the id changes
    // if true then it will not re-render
    return prevProps.id === nextProps.id;
  }
);
