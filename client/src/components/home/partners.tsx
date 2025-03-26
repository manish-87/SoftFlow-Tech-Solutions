import { useQuery } from "@tanstack/react-query";
import { Partner } from "@shared/schema";
import { motion } from "framer-motion";

// Fallback partners with logo data
const fallbackPartners = [
  { 
    name: "Microsoft", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
  },
  { 
    name: "IBM", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" 
  },
  { 
    name: "Amazon", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
  },
  { 
    name: "Google", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
  },
  { 
    name: "Oracle", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" 
  },
  { 
    name: "Salesforce", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" 
  },
  { 
    name: "Adobe", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" 
  },
  { 
    name: "Apple", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png" 
  },
  { 
    name: "Samsung", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" 
  },
  { 
    name: "Siemens", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg" 
  },
  { 
    name: "Dell", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/82/Dell_Logo.png" 
  },
  { 
    name: "Intel", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg" 
  }
];

// Partner logo component 
const PartnerLogo = ({ partner }: { partner: { name: string, logo: string } }) => (
  <div className="flex flex-col items-center justify-center space-y-3">
    <img 
      src={partner.logo} 
      alt={`${partner.name} logo`} 
      className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300" 
    />
    <span className="text-sm font-medium text-gray-600">{partner.name}</span>
  </div>
);

export default function Partners() {
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  // Use the API data if available, otherwise use fallback
  const hasApiPartners = partners.length > 0;
  
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block bg-blue-100 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-2">
            TRUSTED BY INDUSTRY LEADERS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our Partners & Clients
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We collaborate with innovative companies across industries to deliver exceptional technology solutions.
          </p>
        </motion.div>
        
        {/* First row marquee - left to right */}
        <div className="overflow-hidden relative mb-8 py-6">
          <motion.div 
            className="flex space-x-16 whitespace-nowrap"
            animate={{ x: ["-15%", "0%"] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 20,
                ease: "linear",
              }
            }}
          >
            {hasApiPartners ? 
              partners.slice(0, Math.ceil(partners.length/2)).map((partner, index) => (
                <div key={index} className="inline-block">
                  <PartnerLogo partner={partner} />
                </div>
              ))
              :
              fallbackPartners.slice(0, 8).map((partner, index) => (
                <div key={index} className="inline-block">
                  <PartnerLogo partner={partner} />
                </div>
              ))
            }
          </motion.div>
          
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
        </div>
        
        {/* Second row marquee - right to left */}
        <div className="overflow-hidden relative py-6">
          <motion.div 
            className="flex space-x-16 whitespace-nowrap"
            animate={{ x: ["0%", "-15%"] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 25,
                ease: "linear",
              }
            }}
          >
            {hasApiPartners ? 
              partners.slice(Math.ceil(partners.length/2)).map((partner, index) => (
                <div key={index} className="inline-block">
                  <PartnerLogo partner={partner} />
                </div>
              ))
              :
              fallbackPartners.slice(8).map((partner, index) => (
                <div key={index} className="inline-block">
                  <PartnerLogo partner={partner} />
                </div>
              ))
            }
          </motion.div>
          
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}
