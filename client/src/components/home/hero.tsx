import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-20 relative bg-white">
      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6 order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-blue-100 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-2">
              NEXT-GEN TECHNOLOGY SOLUTIONS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Building <span className="text-primary">AI Powered</span> Platforms on Scale
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              Building & Integrating LLMs, AI Agents, Chatbots in your platforms for smarter solutions that drive business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/contact">
                <motion.a 
                  className="bg-primary hover:bg-blue-700 text-white py-3 px-8 rounded-md font-medium transition duration-300 ease-in-out text-center block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule a Free Consultation
                </motion.a>
              </Link>
              <Link href="/services">
                <motion.a 
                  className="bg-white text-primary border border-primary hover:bg-blue-50 py-3 px-8 rounded-md font-medium transition duration-300 ease-in-out text-center block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Services
                </motion.a>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="AI Technology Illustration" 
              className="max-w-full h-auto rounded-lg object-cover shadow-xl"
            />
          </motion.div>
        </div>
      </div>
      
      {/* Curved Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f9fafb"></path>
        </svg>
      </div>
    </section>
  );
}
