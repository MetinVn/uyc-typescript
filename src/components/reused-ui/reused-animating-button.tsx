import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Loader } from "lucide-react";

import { memo } from "react";
import { useButtonState } from "../../stores/shared/button-state";

type AnimatingButtonProps = {
  id: string;
  defaultText: string;
  fullWidth?: boolean;
  setButtonState: (e: React.FormEvent<HTMLElement>) => any;
};

const sceneAnimDuration = 0.1;
const colorAnimDuration = 0.3;

export const AnimatingButton = memo(({ defaultText, fullWidth = false, setButtonState, id }: AnimatingButtonProps) => {
  const buttonState = useButtonState((s) => s.getButtonState(id));

  return (
    <motion.button
      disabled={buttonState !== "default"}
      onClick={(e) => setButtonState(e)}
      type="submit"
      title={
        buttonState === "default"
          ? defaultText
          : buttonState === "pending"
          ? "Please Wait..."
          : buttonState === "success"
          ? "Success"
          : "Error occurred"
      }
      className={`min-w-[70px] min-h-10 ${fullWidth ? "w-full" : "w-fit"} ${
        buttonState === "default"
          ? "cursor-default"
          : buttonState === "pending"
          ? "cursor-progress"
          : buttonState === "success"
          ? "cursor-grab"
          : "cursor-not-allowed"
      } rounded-md text-white flex justify-center items-center overflow-hidden`}
      initial={{ backgroundColor: "var(--gray-700)" }}
      animate={{
        backgroundColor:
          buttonState === "pending"
            ? "var(--gray-600)"
            : buttonState === "success"
            ? "#38b000"
            : buttonState === "error"
            ? "var(--red-700)"
            : "var(--gray-700)",
      }}
      whileHover={buttonState === "default" ? { backgroundColor: "var(--gray-600)" } : {}}
      transition={{ duration: colorAnimDuration }}
    >
      <AnimatePresence mode="wait">
        {buttonState === "default" && (
          <motion.span
            key="run"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: sceneAnimDuration }}
          >
            {defaultText}
          </motion.span>
        )}

        {buttonState === "pending" && (
          <motion.span
            key="pending"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: sceneAnimDuration }}
            className="animate-[spin_1.1s_linear_infinite]"
          >
            <Loader strokeWidth={1} size={24} />
          </motion.span>
        )}

        {buttonState === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: sceneAnimDuration }}
          >
            <Check strokeWidth={1} size={24} />
          </motion.span>
        )}

        {buttonState === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: sceneAnimDuration }}
          >
            <X strokeWidth={1} size={24} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
});
