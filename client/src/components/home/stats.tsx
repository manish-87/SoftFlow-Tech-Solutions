import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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
      value: 98,
      suffix: "%",
      title: "Customer Satisfaction",
      description: "Our clients consistently rate us with high satisfaction scores."
    },
    {
      value: 500,
      suffix: "+",
      title: "Projects Completed",
      description: "Successfully delivered projects across various industries."
    },
    {
      value: 250,
      suffix: "+",
      title: "Happy Clients",
      description: "Businesses who trust us with their technology needs."
    }
  ];
  
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 font-sans">What We've Accomplished</h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">We take pride in our work and the impact we've made for our clients.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-neutral-100 p-8 rounded-lg shadow-sm text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-primary text-5xl font-bold mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xl text-neutral-700 font-medium">{stat.title}</div>
              <p className="text-neutral-600 mt-3">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
