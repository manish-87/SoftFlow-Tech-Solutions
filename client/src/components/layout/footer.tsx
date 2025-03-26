import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  FaLinkedin, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram,
  FaPaperPlane
} from "react-icons/fa";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function Footer() {
  const { toast } = useToast();
  
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: NewsletterFormValues) => {
    toast({
      title: "Subscribed!",
      description: "You have been subscribed to our newsletter.",
    });
    form.reset();
  };

  return (
    <footer className="bg-neutral-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 font-sans">SoftFlow</h3>
            <p className="text-neutral-300 mb-6">
              Empowering businesses with innovative software solutions and technology services since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white transition">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-sans">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-300 hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="text-neutral-300 hover:text-white transition">About Us</Link></li>
              <li><Link href="/services" className="text-neutral-300 hover:text-white transition">Services</Link></li>
              <li><Link href="/blog" className="text-neutral-300 hover:text-white transition">Blog</Link></li>
              <li><Link href="/careers" className="text-neutral-300 hover:text-white transition">Careers</Link></li>
              <li><Link href="/contact" className="text-neutral-300 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-sans">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-neutral-300 hover:text-white transition">Frontend Development</Link></li>
              <li><Link href="/services" className="text-neutral-300 hover:text-white transition">Backend & Web Services</Link></li>
              <li><Link href="/services" className="text-neutral-300 hover:text-white transition">Application Development</Link></li>
              <li><Link href="/services" className="text-neutral-300 hover:text-white transition">Cloud Managed Services</Link></li>
              <li><Link href="/services" className="text-neutral-300 hover:text-white transition">Data Analytics</Link></li>
              <li><Link href="/services" className="text-neutral-300 hover:text-white transition">Consultancy Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-sans">Newsletter</h3>
            <p className="text-neutral-300 mb-4">
              Subscribe to our newsletter to receive updates on our latest services and tech insights.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your email"
                          className="flex-grow px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-l-md focus:outline-none focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-r-md transition duration-300 ease-in-out">
                  <FaPaperPlane />
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-8 mt-8 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} SoftFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
