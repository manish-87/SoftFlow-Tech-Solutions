import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import {
  Code,
  Server,
  Smartphone,
  Cloud,
  BarChart3,
  Clipboard,
  Check,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  const services = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Frontend Development",
      description:
        "Modern, responsive user interfaces built with the latest technologies for exceptional user experiences. We use React, Angular, Vue, and other modern frameworks to create stunning, responsive web applications.",
      features: [
        "UI/UX Design Implementation",
        "Responsive Web Applications",
        "Single Page Applications (SPAs)",
        "Progressive Web Apps (PWAs)",
        "Performance Optimization",
      ],
    },
    {
      icon: <Server className="h-8 w-8 text-primary" />,
      title: "Backend & Web Services",
      description:
        "Robust and scalable server-side solutions, APIs, and web services for your business applications. Our backends are built to scale, providing security, performance, and reliability.",
      features: [
        "RESTful API Development",
        "GraphQL Services",
        "Microservices Architecture",
        "Database Design & Optimization",
        "Authentication & Authorization Systems",
      ],
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Application Development",
      description:
        "Custom desktop, mobile, and web applications designed for your specific business requirements. We develop native and cross-platform applications that deliver exceptional user experiences.",
      features: [
        "iOS & Android App Development",
        "Cross-Platform Development",
        "Desktop Application Development",
        "Enterprise Software Solutions",
        "Legacy System Modernization",
      ],
    },
    {
      icon: <Cloud className="h-8 w-8 text-primary" />,
      title: "Cloud Managed Services",
      description:
        "Cloud governance, infrastructure automation, monitoring, support, and security posture management. We help you leverage the power of the cloud securely and efficiently.",
      features: [
        "Cloud Migration & Strategy",
        "Infrastructure as Code (IaC)",
        "Continuous Integration/Deployment",
        "Security Compliance & Management",
        "24/7 Monitoring & Support",
      ],
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Data Analytics",
      description:
        "Data warehousing, real-time monitoring, advanced analytics, and data visualization solutions. Turn your data into actionable insights that drive business growth.",
      features: [
        "Business Intelligence Solutions",
        "Predictive Analytics",
        "Big Data Processing",
        "Custom Dashboards & Reporting",
        "Machine Learning Integration",
      ],
    },
    {
      icon: <Clipboard className="h-8 w-8 text-primary" />,
      title: "Consultancy Services",
      description:
        "Architecture consulting, technology best practices, scalability and security advisory. Our experts provide strategic guidance to help you make informed technology decisions.",
      features: [
        "Technology Roadmapping",
        "System Architecture Design",
        "IT Security Audits",
        "Performance Optimization",
        "Agile Process Implementation",
      ],
    },
  ];

  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sans">
                Our Services
              </h1>
              <p className="text-lg opacity-90">
                Comprehensive technology solutions tailored to your business
                needs
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-16">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                      {service.icon}
                    </div>
                    <h2 className="text-3xl font-bold mb-4 font-sans">
                      {service.title}
                    </h2>
                    <p className="text-neutral-700 mb-6">
                      {service.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <Button className="bg-primary hover:bg-primary/90">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <div
                    className={`bg-neutral-100 p-8 rounded-lg h-72 flex items-center justify-center ${
                      index % 2 === 1 ? "md:order-1" : ""
                    }`}
                  >
                    <div className="bg-primary/20 w-24 h-24 rounded-full flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 font-sans">
                Ready to Transform Your Business?
              </h2>
              <p className="text-neutral-700 mb-8">
                Contact us today to discuss how our services can help you achieve
                your technology goals.
              </p>
              <Link href="/contact">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition duration-300 ease-in-out">
                  Request a Consultation
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
