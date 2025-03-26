import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-20 relative">
      <div className="bg-gradient-to-r from-primary via-blue-500 to-primary h-[600px] md:h-[650px] relative animate-gradient">
        <div className="absolute inset-0 bg-neutral-900 opacity-50"></div>
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center z-10 relative">
          <motion.div 
            className="max-w-3xl text-white space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans leading-tight">
              Innovative Software Solutions for Your Business
            </h1>
            <p className="text-lg md:text-xl opacity-90 font-light">
              We develop cutting-edge software and provide tech services to transform your business operations and drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <motion.a 
                  className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-md font-medium transition duration-300 ease-in-out text-center block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get a Free Consultation
                </motion.a>
              </Link>
              <Link href="/services">
                <motion.a 
                  className="bg-white text-primary hover:bg-neutral-100 py-3 px-8 rounded-md font-medium transition duration-300 ease-in-out text-center block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Our Services
                </motion.a>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
