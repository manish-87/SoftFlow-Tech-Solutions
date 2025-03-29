import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WhatsappButton() {
  return (
    <motion.a
      href="https://wa.me/+918328609180"
      className="fixed bottom-8 right-8 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all z-40"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <FaWhatsapp className="text-2xl" />
    </motion.a>
  );
}
