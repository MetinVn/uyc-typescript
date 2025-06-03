import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { LuLoader } from "react-icons/lu";
import { useButtonState } from "../../stores/shared/button-state";

type AnimatingButtonProps = {
  id: string;
  defaultText: string;
  fullWidth?: boolean;
  setButtonState: (e: React.FormEvent<HTMLElement>) => any;
};

const sceneAnimDuration = 0.1;
const colorAnimDuration = 0.3;

export default function AnimatingButton({ defaultText, fullWidth = false, setButtonState, id }: AnimatingButtonProps) {
  const buttonState = useButtonState((s) => s.getButtonState(id));

  return (
    <motion.button
      disabled={buttonState !== "default"}
      onClick={(e) => setButtonState(e)}
      type="submit"
      title="Convert the link"
      className={`min-w-[70px] min-h-10 ${
        fullWidth ? "w-full" : "w-fit"
      } cursor-pointer rounded-md text-white flex justify-center items-center overflow-hidden`}
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
            <LuLoader size={20} />
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
            <MdDone size={20} />
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
            <IoMdClose size={20} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
