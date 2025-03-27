import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Service } from "@shared/schema";

// Import custom SVG icons
import serviceIconsSrc from "../../assets/service-icons.svg";

// We'll map backend icon names to our SVG icon IDs
const iconNameMapping: Record<string, string> = {
  // Development icons
  "code": "frontend-dev",
  "server": "backend-dev",
  "api": "api-integration",
  "database": "database-services",
  "git": "version-control",
  
  // Mobile icons
  "smartphone": "mobile-dev",
  "android": "android-dev",
  "apple": "ios-dev",
  "flutter": "cross-platform",
  
  // Cloud & DevOps
  "cloud": "cloud-services",
  "aws": "aws-services",
  "azure": "azure-services",
  "google-cloud": "gcp-services",
  "kubernetes": "kubernetes",
  "docker": "containerization",
  
  // Data & Analytics
  "bar-chart": "data-analytics",
  "data": "big-data",
  "ai": "ai-services",
  "ml": "machine-learning",
  "analytics": "business-intelligence",
  
  // Business & Consulting
  "lightbulb": "consulting",
  "briefcase": "business-solutions",
  "handshake": "partnership",
  "presentation": "training",
  
  // Security
  "security": "security-services",
  "shield": "cyber-security",
  "lock": "data-protection",
  
  // Testing & QA
  "testing": "quality-assurance",
  "quality": "quality-control",
  "bug": "bug-fixing",
  
  // UI/UX
  "design": "ui-design",
  "palette": "ux-design",
  "layout": "responsive-design"
};

// Fallback icons for any missing mappings
const fallbackIcons = [
  "system-integration",
  "ai-services",
  "security-services",
  "web-development",
  "devops",
  "qa-testing",
  "business-analysis",
  "project-management",
  "custom-development"
];

// SVG Icon Component
const ServiceIcon = ({ iconName }: { iconName: string }) => {
  // More intelligent fallback selection based on the service name
  let iconId = iconNameMapping[iconName];
  
  // If no direct mapping exists, use a more intelligent fallback selection
  if (!iconId) {
    // Get a fallback icon based on the hash of the iconName string
    // This ensures the same service consistently gets the same fallback icon
    const hash = iconName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fallbackIndex = hash % fallbackIcons.length;
    iconId = fallbackIcons[fallbackIndex];
  }
  
  return (
    <svg className="w-12 h-12" aria-hidden="true">
      <use href={`${serviceIconsSrc}#${iconId}`} />
    </svg>
  );
};

export default function Services() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    select: (data) => data.sort((a, b) => a.order - b.order),
  });

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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Unable to load services. Please try again later.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {services && services.map((service) => (
              <motion.div 
                key={service.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                variants={item}
              >
                <Link href={`/services/${service.slug}`}>
                  <div className="block p-6 cursor-pointer">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                      <ServiceIcon iconName={service.icon} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description.length > 120 
                        ? `${service.description.substring(0, 120)}...` 
                        : service.description}
                    </p>
                    <div className="text-primary font-medium inline-flex items-center mt-2 group-hover:translate-x-1 transition-transform">
                      Learn more <span className="ml-2">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/services">
            <div className="inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-white py-3 px-8 rounded-md font-medium transition duration-300 ease-in-out cursor-pointer">
              View All Services
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
