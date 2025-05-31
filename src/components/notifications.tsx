import { AnimatePresence, motion } from "framer-motion";
import { useNotification } from "../stores/shared/notification";
import { NotificationType } from "../types/types-notification";

const getColorClasses = (type: NotificationType) => {
  switch (type) {
    case "success":
      return "border-green-400 bg-green-500/10";
    case "error":
      return "border-red-400 bg-red-500/70";
    case "warning":
      return "border-yellow-400 bg-yellow-300/10";
    case "info":
      return "border-gray-400 bg-gray-300/10";
    default:
      return "border-gray-400 bg-gray-300/10";
  }
};

export const Notifications = () => {
  const notifications = useNotification((state) => state.notifications);
  const removeNotification = useNotification((state) => state.removeNotification);

  const displayed = notifications.slice(-5);

  return (
    <div className="#notification-container fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-3 max-w-md">
      <AnimatePresence mode="sync" initial={false}>
        {displayed.map((notif, index) => (
          <motion.div
            layout
            key={notif.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: 40,
              transition: {
                duration: 0.2,
                delay: index * 0.05,
                ease: "easeIn",
              },
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut",
            }}
            whileHover={{ scale: 0.97 }}
            onClick={() => removeNotification(notif.id)}
            className={`text-white cursor-pointer border px-4 py-3 rounded-lg shadow-lg min-w-fit flex justify-between items-center ${getColorClasses(
              notif.type
            )}`}
          >
            <span className="text-sm max-w-[300px]">{notif.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
