import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Users, CheckCircle2, Trophy, Clock, Code2, Cpu } from "lucide-react";

// Counter component that animates from 0 to a target value
const Counter = ({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 seconds animation
      const increment = end / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, end]);
  
  return <div ref={ref}>{prefix}{count}{suffix}</div>;
};

export default function Stats() {
  const stats = [
    {
      value: 100,
      suffix: "%",
      title: "Customer Satisfaction",
      description: "Our clients consistently rate us with high satisfaction scores.",
      icon: <CheckCircle2 className="w-8 h-8" />
    },
    {
      value: 50,
      suffix: "+",
      title: "Projects Completed",
      description: "Successfully delivered projects across various industries.",
      icon: <Trophy className="w-8 h-8" />
    },
    {
      value: 40,
      suffix: "+",
      title: "Happy Clients",
      description: "Businesses who trust us with their technology needs.",
      icon: <Users className="w-8 h-8" />
    },
    {
      value: 2,
      suffix: "+",
      title: "Years Experience",
      description: "Decade of excellence in delivering technology solutions.",
      icon: <Clock className="w-8 h-8" />
    },
    {
      value: 150,
      suffix: "K+",
      title: "Lines of Code",
      description: "Crafting clean, efficient code for exceptional performance.",
      icon: <Code2 className="w-8 h-8" />
    },
    {
      value: 10,
      suffix: "+",
      title: "AI Models",
      description: "Custom AI solutions solving complex business challenges.",
      icon: <Cpu className="w-8 h-8" />
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-primary-900/[0.2]" 
          style={{ backgroundSize: '30px 30px', backgroundImage: 'linear-gradient(to right, #dee2e680 1px, transparent 1px), linear-gradient(to bottom, #dee2e680 1px, transparent 1px)' }}>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block bg-sky-100 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-2">
            OUR SUCCESS IN NUMBERS
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Making an Impact
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We take pride in our work and the measurable impact we've made for our clients across industries.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start">
                <div className="bg-sky-50 p-3 rounded-lg mr-4 text-primary">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-primary text-4xl font-bold tracking-tight">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-lg text-gray-900 font-semibold mt-1">{stat.title}</div>
                  <p className="text-gray-600 mt-2 text-sm">{stat.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
