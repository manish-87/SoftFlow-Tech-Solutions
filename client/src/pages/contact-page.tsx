import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { MapPin, Mail, Phone, MessageSquare, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Service, InsertMessage, insertMessageSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";

// Extend the schema with additional validation
const contactFormSchema = insertMessageSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  service: z.string().optional(),
  company: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  
  // Parse the query parameters to check for service=true
  const params = new URLSearchParams(window.location.search);
  const showServiceSection = params.get('service') === 'true';

  // Fetch services from the API
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    select: (data) => data.filter(service => service.active).sort((a, b) => a.order - b.order),
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  // Set focus on the service dropdown if coming from services page
  useEffect(() => {
    if (showServiceSection && servicesData && servicesData.length > 0) {
      // Scroll to the form section
      document.getElementById('contact-form')?.scrollIntoView({
        behavior: 'smooth', 
        block: 'start'
      });
      
      // Show a welcoming toast
      toast({
        title: "Looking for services?",
        description: "Please select the service you're interested in and tell us about your project.",
      });
    }
  }, [showServiceSection, servicesData]);

  const messageMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    messageMutation.mutate(data);
  };

  // Prepare services for the dropdown
  const services = servicesData 
    ? servicesData.map(service => ({
        value: service.slug,
        label: service.title
      }))
    : [
        { value: "frontend", label: "Frontend Development" },
        { value: "backend", label: "Backend & Web Services" },
        { value: "app", label: "Application Development" },
        { value: "cloud", label: "Cloud Managed Services" },
        { value: "data", label: "Data Analytics" },
        { value: "consulting", label: "Consultancy Services" },
      ];

  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sky-50 via-sky-50 to-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sans text-neutral-800">
                Contact Us
              </h1>
              <p className="text-lg text-neutral-700">
                We'd love to hear from you. Get in touch with our team.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <motion.div
                className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-sans">Our Location</h3>
                <p className="text-neutral-700">
                  172, Vaddeshwaram, Guntur <br />
                  Andhra Pradesh, India, 522302
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-sans">Email Us</h3>
                <p className="text-neutral-700">
                  info@softflow.com <br />
                  support@softflow.com
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-8 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-sans">Call Us</h3>
                <p className="text-neutral-700">
                  +91 8328609180 <br />
                  
                </p>
              </motion.div>
            </div>

            {/* Contact Form and Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                id="contact-form"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-sans">
                    Send Us a Message
                  </h2>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Interested In</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem
                                  key={service.value}
                                  value={service.value}
                                >
                                  {service.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your project..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-sky-500 hover:bg-sky-600 transition-colors"
                      disabled={messageMutation.isPending}
                    >
                      {messageMutation.isPending
                        ? "Sending..."
                        : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </motion.div>

              <motion.div
                className="h-[500px] rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101408.19513798697!2d-122.11019901431131!3d37.414582932067124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb68ad0cfc739%3A0x7eb356b66bd4b50e!2sSilicon%20Valley%2C%20CA!5e0!3m2!1sen!2sus!4v1690217208633!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SoftFlow Office Location"
                ></iframe>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-br from-sky-50 via-sky-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-sans mb-4 text-neutral-800">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-700 max-w-2xl mx-auto">
                Find answers to common questions about our services and processes.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "How long does a typical project take?",
                  answer:
                    "Project timelines vary based on scope and complexity. A simple website might take 4-6 weeks, while enterprise applications can take several months. We provide detailed timelines during our initial consultation.",
                },
                {
                  question: "What is your pricing model?",
                  answer:
                    "We offer flexible pricing models including fixed-price projects, time and materials, and retainer agreements. The right model depends on your project needs and we'll recommend the most suitable approach during our discussions.",
                },
                {
                  question: "Do you provide ongoing support after project completion?",
                  answer:
                    "Yes, we offer various maintenance and support packages to ensure your solution continues to perform optimally. Our support services include bug fixes, security updates, and performance enhancements.",
                },
                {
                  question: "What technologies do you specialize in?",
                  answer:
                    "We have expertise in a wide range of technologies including React, Angular, Node.js, .NET, Java, Python, AWS, Azure, and more. Our team stays current with the latest advancements to provide modern, efficient solutions.",
                },
                {
                  question: "How do you handle project communication?",
                  answer:
                    "We believe in transparent, regular communication. Depending on project needs, we schedule weekly or bi-weekly update meetings, use project management tools for daily updates, and provide access to real-time development progress.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="mb-4 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-bold mb-2 font-sans">
                    {faq.question}
                  </h3>
                  <p className="text-neutral-700">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
