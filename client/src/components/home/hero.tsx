import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Cloud, Code, Bot } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-white pt-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>NEXT-GEN TECHNOLOGY SOLUTIONS</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Building <span className="text-primary relative">
                AI Powered
                <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/20 -z-10 rounded"></span>
              </span> Platforms at Scale
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700">
              Integrating LLMs, AI Agents, and intelligent systems into your platforms for 
              smarter solutions that drive innovation and business growth.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Cloud className="h-5 w-5 text-primary" />
                <span>Cloud Solutions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Code className="h-5 w-5 text-primary" />
                <span>Custom Development</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Bot className="h-5 w-5 text-primary" />
                <span>AI Integration</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/contact" className="group bg-primary hover:bg-primary/90 text-white py-3.5 px-8 rounded-md font-medium transition duration-300 ease-in-out text-center flex items-center justify-center gap-2">
                  Schedule a Free Consultation
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/services" className="bg-white/80 backdrop-blur-sm text-primary border border-primary/30 hover:border-primary hover:bg-primary/5 py-3.5 px-8 rounded-md font-medium transition duration-300 ease-in-out text-center block">
                  Explore Our Services
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 bg-primary/10 w-32 h-32 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -right-4 bg-primary/10 w-24 h-24 rounded-full -z-10"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2006&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="AI Technology Illustration" 
                className="max-w-full h-auto rounded-xl object-cover shadow-2xl border-4 border-white"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Curved Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="white"></path>
        </svg>
      </div>
    </section>
  );
}
