import { FcGoogle } from "react-icons/fc";
import { useButtonState } from "../../stores/shared/button-state";

interface GoogleSignInButtonProps {
  onClick: () => void;
  id: string;
}

const RegisterWithGoogle = ({ onClick, id }: GoogleSignInButtonProps) => {
  const buttonState = useButtonState((s) => s.getButtonState(id));

  return (
    <button
      type="button"
      disabled={buttonState !== "default"}
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 bg-white text-black py-2 rounded-md hover:bg-gray-200 transition-colors"
    >
      <FcGoogle size={20} />
      <span className="text-sm font-medium">Continue with Google</span>
    </button>
  );
};

export default RegisterWithGoogle;
