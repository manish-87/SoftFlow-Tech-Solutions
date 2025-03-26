import { useQuery } from "@tanstack/react-query";
import { Partner } from "@shared/schema";
import { motion } from "framer-motion";

// Fallback partners in case API fails or returns empty
const fallbackPartners = [
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" }
];

export default function Partners() {
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  // Use the API data if available, otherwise use fallback
  const displayPartners = partners.length > 0 ? partners : fallbackPartners;
  
  // Duplicate the partners for the infinite scroll effect
  const allPartners = [...displayPartners, ...displayPartners];
  
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 font-sans">Our Partners</h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">We collaborate with industry leaders to deliver exceptional solutions.</p>
        </motion.div>
        
        <div className="overflow-hidden relative">
          <motion.div 
            className="flex space-x-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              }
            }}
          >
            {allPartners.map((partner, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center h-24 bg-white px-8 rounded-lg shadow-sm inline-block"
              >
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="h-10 w-auto grayscale hover:grayscale-0 transition duration-300" 
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
