import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InsertMessage, insertMessageSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

// Extend the schema with additional validation
const contactFormSchema = insertMessageSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  service: z.string().optional(),
  company: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: ""
    },
  });
  
  const messageMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ContactFormValues) => {
    messageMutation.mutate(data);
  };
  
  const services = [
    { value: "frontend", label: "Frontend Development" },
    { value: "backend", label: "Backend & Web Services" },
    { value: "app", label: "Application Development" },
    { value: "cloud", label: "Cloud Managed Services" },
    { value: "data", label: "Data Analytics" },
    { value: "consulting", label: "Consultancy Services" }
  ];
  
  return (
    <section id="contact" className="py-16 md:py-24 bg-[#1C1C1C] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-sm uppercase font-medium mb-2">
          GET IN TOUCH
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Partner with Us for Your IT Solutions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="lg:pt-10"
          >
            <p className="text-gray-300 mb-8 text-lg">
              We're happy to answer any questions you may have and help you determine which of our services best fit your needs.
            </p>
            
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-2">Call us at: +1 (555) 123-4567</h4>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-4">Why Choose SoftFlow?</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="text-sky-500 mt-1">✓</div>
                  <span>Faster Turnaround</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-sky-500 mt-1">✓</div>
                  <span>Robust Engineering</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-sky-500 mt-1">✓</div>
                  <span>One Stop Solution</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-sky-500 mt-1">✓</div>
                  <span>Trusted Advisory</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-white text-black p-8 rounded shadow"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-neutral-800 mb-4">Schedule a Free Consultation</h3>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="text-sky-500 text-5xl mb-4">✓</div>
                <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                <p className="text-neutral-600 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                <Button onClick={() => setIsSubmitted(false)} className="bg-sky-500 hover:bg-sky-600">Send Another Message</Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                            <Input type="email" placeholder="john@example.com" {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.value} value={service.value}>
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
                    className="w-full bg-sky-500 hover:bg-sky-600"
                    disabled={messageMutation.isPending}
                  >
                    {messageMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
