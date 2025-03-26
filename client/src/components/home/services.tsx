import { Code, Server, Smartphone, Cloud, BarChart3, Clipboard } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const services = [
  {
    icon: <Code className="text-primary text-2xl" />,
    title: "Frontend Development",
    description: "Modern, responsive user interfaces built with the latest technologies for exceptional user experiences.",
    link: "/services"
  },
  {
    icon: <Server className="text-primary text-2xl" />,
    title: "Backend & Web Services",
    description: "Robust and scalable server-side solutions, APIs, and web services for your business applications.",
    link: "/services"
  },
  {
    icon: <Smartphone className="text-primary text-2xl" />,
    title: "Application Development",
    description: "Custom desktop, mobile, and web applications designed for your specific business requirements.",
    link: "/services"
  },
  {
    icon: <Cloud className="text-primary text-2xl" />,
    title: "Cloud Managed Services",
    description: "Cloud governance, infrastructure automation, monitoring, support, and security posture management.",
    link: "/services"
  },
  {
    icon: <BarChart3 className="text-primary text-2xl" />,
    title: "Data Analytics",
    description: "Data warehousing, real-time monitoring, advanced analytics, and data visualization solutions.",
    link: "/services"
  },
  {
    icon: <Clipboard className="text-primary text-2xl" />,
    title: "Consultancy Services",
    description: "Architecture consulting, technology best practices, scalability and security advisory.",
    link: "/services"
  }
];

export default function Services() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <section id="services" className="py-16 md:py-24 bg-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 font-sans">Services We Offer</h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">Comprehensive technology solutions tailored to your business needs.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              variants={item}
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-3 font-sans">{service.title}</h3>
                <p className="text-neutral-600">{service.description}</p>
              </div>
              <div className="px-6 pb-6">
                <Link href={service.link}>
                  <a className="text-primary font-medium hover:text-primary/80 inline-flex items-center">
                    Learn more <span className="ml-2">→</span>
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
