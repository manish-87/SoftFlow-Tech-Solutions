import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Service } from "@shared/schema";

export default function ServicesPage() {
  const [, setLocation] = useLocation();
  
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-6">Our Services</h1>
            <p className="text-lg text-gray-600 mb-8">
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
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
                      className="w-full"
                    >
                      Get a Quote <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to transform your business?</h2>
            <p className="mb-8 text-white/80">
              Contact our team today to discuss how our services can help you achieve your goals.
            </p>
            <Button 
              onClick={() => setLocation('/contact')}
              variant="secondary" 
              size="lg"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

// Helper function to render icon based on icon name
function getServiceIcon(iconName: string | null) {
  // This is a placeholder - ideally you would import and use actual icons
  switch (iconName) {
    case 'code':
      return '💻';
    case 'server':
      return '🖥️';
    case 'smartphone':
      return '📱';
    case 'cloud':
      return '☁️';
    case 'bar-chart':
      return '📊';
    case 'lightbulb':
      return '💡';
    default:
      return '🔧';
  }
}