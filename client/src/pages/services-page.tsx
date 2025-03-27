import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Loader2, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Service } from "@shared/schema";

export default function ServicesPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/services/:slug");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Handle the service detail view when a slug is provided
  useEffect(() => {
    if (params?.slug && services?.length) {
      const service = services.find(s => s.slug === params.slug);
      setSelectedService(service || null);
    } else {
      setSelectedService(null);
    }
  }, [params?.slug, services]);

  const handleServiceContactClick = (serviceSlug: string) => {
    setLocation(`/contact?service=${serviceSlug}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-20 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }
  
  // Show service detail view if a service is selected
  if (selectedService) {
    return (
      <Layout>
        {/* Breadcrumb Navigation */}
        <div className="bg-gradient-to-br from-sky-50 via-sky-50 to-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-gray-600">
              <button 
                onClick={() => setLocation('/services')}
                className="hover:text-sky-600 transition-colors"
              >
                Services
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">{selectedService.title}</span>
            </div>
          </div>
        </div>
        
        {/* Service Detail Hero */}
        <section className="bg-gradient-to-br from-sky-50 via-sky-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start gap-10">
              <div className="md:w-2/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl font-bold mb-6 text-gray-900">{selectedService.title}</h1>
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {selectedService.description}
                  </p>
                  <Button 
                    onClick={() => handleServiceContactClick(selectedService.slug)}
                    className="bg-sky-500 hover:bg-sky-600 text-white group"
                    size="lg"
                  >
                    Get a Quote <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
              <div className="md:w-1/3 bg-white rounded-lg p-6 shadow-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="mx-auto h-24 w-24 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-sky-500 text-5xl">
                      {getServiceIcon(selectedService.icon)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Why choose our {selectedService.title} service?</h3>
                  <ul className="text-left text-gray-700 space-y-3">
                    <li className="flex items-start">
                      <span className="text-sky-500 mr-2">✓</span> 
                      <span>Expert team with years of experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-500 mr-2">✓</span> 
                      <span>Tailored solutions for your business needs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-500 mr-2">✓</span> 
                      <span>Ongoing support and maintenance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-sky-500 mr-2">✓</span> 
                      <span>Competitive pricing and flexible packages</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      
        {/* CTA Section */}
        <section className="bg-sky-500 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">Ready to get started?</h2>
              <p className="mb-8 text-white/90">
                Contact our team today to discuss how our {selectedService.title} service can help you achieve your goals.
              </p>
              <Button 
                onClick={() => handleServiceContactClick(selectedService.slug)}
                variant="default" 
                size="lg"
                className="bg-white text-sky-600 hover:bg-sky-50 group"
              >
                Contact Us <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-50 via-sky-50 to-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-6 text-neutral-800">Our Services</h1>
            <p className="text-lg text-neutral-700 mb-8">
              We offer a comprehensive range of technology solutions tailored to meet your business needs.
              From front-end development to cloud management, our team of experts is ready to
              help you achieve your digital transformation goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 border border-transparent hover:border-sky-100">
                  <CardHeader>
                    <div className="h-12 w-12 bg-sky-50 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-primary text-2xl">
                        {getServiceIcon(service.icon)}
                      </span>
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleServiceContactClick(service.slug)}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white group"
                    >
                      Get a Quote <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sky-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to transform your business?</h2>
            <p className="mb-8 text-white/90">
              Contact our team today to discuss how our services can help you achieve your goals.
            </p>
            <Button 
              onClick={() => setLocation('/contact')}
              variant="default" 
              size="lg"
              className="bg-white text-sky-600 hover:bg-sky-50 group"
            >
              Contact Us <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

// Helper function to render icon based on icon name
function getServiceIcon(iconName: string | null) {
  // Expanded service icons for better visual representation
  switch (iconName) {
    // Development icons
    case 'code':
      return '💻';
    case 'server':
      return '🖥️';
    case 'api':
      return '🔌';
    case 'database':
      return '🗄️';
    case 'git':
      return '📊';
    
    // Mobile icons
    case 'smartphone':
      return '📱';
    case 'android':
      return '🤖';
    case 'apple':
      return '🍎';
    case 'flutter':
      return '📱';
    
    // Cloud & DevOps
    case 'cloud':
      return '☁️';
    case 'aws':
      return '🌩️';
    case 'azure':
      return '☁️';
    case 'google-cloud':
      return '☁️';
    case 'kubernetes':
      return '🚢';
    case 'docker':
      return '🐳';
    
    // Data & Analytics
    case 'bar-chart':
      return '📊';
    case 'data':
      return '📈';
    case 'ai':
      return '🤖';
    case 'ml':
      return '🧠';
    case 'analytics':
      return '📉';
    
    // Business & Consulting
    case 'lightbulb':
      return '💡';
    case 'briefcase':
      return '💼';
    case 'handshake':
      return '🤝';
    case 'presentation':
      return '📝';
    
    // Security
    case 'security':
      return '🔒';
    case 'shield':
      return '🛡️';
    case 'lock':
      return '🔐';
    
    // Testing & QA
    case 'testing':
      return '🧪';
    case 'quality':
      return '✅';
    case 'bug':
      return '🐛';
    
    // UI/UX
    case 'design':
      return '🎨';
    case 'palette':
      return '🖌️';
    case 'layout':
      return '📐';
    
    // Default for any other icon
    default:
      return '⚙️';
  }
}