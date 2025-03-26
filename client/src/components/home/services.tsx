import { motion } from "framer-motion";
import { Link } from "wouter";

// Import custom SVG icons
import serviceIconsSrc from "../../assets/service-icons.svg";

const services = [
  {
    iconId: "frontend-dev",
    title: "Frontend Development",
    description: "Modern, responsive user interfaces built with the latest technologies for exceptional user experiences.",
    link: "/services"
  },
  {
    iconId: "backend-dev",
    title: "Backend & API Development",
    description: "Robust and scalable server-side solutions, APIs, and web services for your business applications.",
    link: "/services"
  },
  {
    iconId: "mobile-dev",
    title: "Mobile App Development",
    description: "Cross-platform mobile applications designed for your specific business requirements and user expectations.",
    link: "/services"
  },
  {
    iconId: "cloud-services",
    title: "Cloud Managed Services",
    description: "Cloud governance, infrastructure automation, monitoring, support, and security posture management.",
    link: "/services"
  },
  {
    iconId: "data-analytics",
    title: "AI & Data Analytics",
    description: "Custom AI solutions, data warehousing, real-time monitoring, advanced analytics, and data visualization.",
    link: "/services"
  },
  {
    iconId: "consulting",
    title: "Consultancy Services",
    description: "Architecture consulting, technology best practices, scalability and security advisory for your business.",
    link: "/services"
  },
  {
    iconId: "system-integration",
    title: "System Integration",
    description: "Seamless integration of various software components, platforms, and legacy systems into a unified solution.",
    link: "/services"
  },
  {
    iconId: "ai-services",
    title: "AI & ML Solutions",
    description: "Build custom AI models, integrate large language models, and develop intelligent solutions for your business.",
    link: "/services"
  },
  {
    iconId: "security-services",
    title: "Cybersecurity Services",
    description: "End-to-end security solutions including audits, implementation of security controls, and ongoing monitoring.",
    link: "/services"
  }
];

// SVG Icon Component
const ServiceIcon = ({ iconId }: { iconId: string }) => (
  <svg className="w-12 h-12" aria-hidden="true">
    <use href={`${serviceIconsSrc}#${iconId}`} />
  </svg>
);

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
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block bg-blue-100 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-2">
            OUR CAPABILITIES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Comprehensive Technology Solutions
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of services to help businesses transform their digital presence and operations.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
              variants={item}
            >
              <Link href={service.link}>
                <a className="block p-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                    <ServiceIcon iconId={service.iconId} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="text-primary font-medium inline-flex items-center mt-2 group-hover:translate-x-1 transition-transform">
                    Learn more <span className="ml-2">→</span>
                  </div>
                </a>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <Link href="/services">
            <a className="inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-white py-3 px-8 rounded-md font-medium transition duration-300 ease-in-out">
              View All Services
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
