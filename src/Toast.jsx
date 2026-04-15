import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

function Toast({ message, isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-20 left-1/2 z-[100] bg-white text-gray-900 px-6 py-4 rounded-lg shadow-2xl border border-gray-200 flex items-center gap-3 min-w-[300px] max-w-md"
        >
          <CheckCircle className="w-6 h-6 text-olive green-600 flex-shrink-0" />
          <p className="flex-1 font-medium text-gray-800">{message}</p>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
