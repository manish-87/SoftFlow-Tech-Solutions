import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function About() {
  const features = [
    {
      title: "Innovative Solutions",
      description: "We leverage cutting-edge technologies to deliver innovative solutions."
    },
    {
      title: "Client-Focused Approach",
      description: "We prioritize understanding your business needs to deliver tailored solutions."
    },
    {
      title: "Continuous Support",
      description: "We provide ongoing maintenance and support for all our solutions."
    }
  ];
  
  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 font-sans mb-6">What We Do</h2>
            <p className="text-neutral-700 mb-4">
              At SoftFlow, we're passionate about leveraging technology to solve complex business challenges. We partner with organizations of all sizes to deliver innovative software solutions that drive efficiency, growth, and competitive advantage.
            </p>
            <p className="text-neutral-700 mb-6">
              Our team of skilled developers, engineers, and consultants brings together decades of experience across various industries. We pride ourselves on delivering high-quality, scalable, and maintainable solutions that exceed our clients' expectations.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-blue-500 mt-1">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">{feature.title}</h4>
                    <p className="text-neutral-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                 alt="Team working together" 
                 className="rounded-lg shadow-lg w-full h-auto object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
