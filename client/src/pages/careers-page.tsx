import { useState } from "react";
import Layout from "@/components/layout/layout";
import { useQuery } from "@tanstack/react-query";
import { Career } from "@shared/schema";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, MapPin, Clock, Filter } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Application form schema
const applicationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  resume: z.string().url({ message: "Please enter a valid URL to your resume" }),
  coverLetter: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function CareersPage() {
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const { data: careers, isLoading } = useQuery<Career[]>({
    queryKey: ["/api/careers"],
  });

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      resume: "",
      coverLetter: "",
    },
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues) => {
      if (!selectedJobId) throw new Error("No job selected");
      const res = await apiRequest(
        "POST",
        `/api/careers/${selectedJobId}/apply`,
        data
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description:
          "Thank you for applying. We'll review your application and get back to you soon.",
      });
      form.reset();
      setSelectedJobId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationFormValues) => {
    applicationMutation.mutate(data);
  };

  // Filter careers based on selected filters
  const filteredCareers = careers?.filter((career) => {
    if (!career.published) return false;
    if (selectedDepartment && career.department !== selectedDepartment)
      return false;
    if (selectedLocation && career.location !== selectedLocation) return false;
    if (selectedType && career.type !== selectedType) return false;
    return true;
  });

  // Extract unique filter options
  const departments = careers
    ? Array.from(new Set(careers.map((career) => career.department)))
    : [];
  const locations = careers
    ? Array.from(new Set(careers.map((career) => career.location)))
    : [];
  const types = careers
    ? Array.from(new Set(careers.map((career) => career.type)))
    : [];

  const resetFilters = () => {
    setSelectedDepartment(null);
    setSelectedLocation(null);
    setSelectedType(null);
  };

  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-blue-50 to-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sans text-neutral-800">
                Join Our Team
              </h1>
              <p className="text-lg text-neutral-700">
                Discover exciting career opportunities and grow with us
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-sans">
                Why Join SoftFlow?
              </h2>
              <p className="text-neutral-700 max-w-2xl mx-auto">
                We offer a dynamic, innovative environment where talent thrives
                and great ideas come to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovative Projects",
                  description:
                    "Work on cutting-edge technologies and challenging projects that make a real impact.",
                },
                {
                  title: "Growth Opportunities",
                  description:
                    "Continuous learning, professional development, and clear career progression paths.",
                },
                {
                  title: "Collaborative Culture",
                  description:
                    "A supportive environment that values teamwork, diversity, and open communication.",
                },
                {
                  title: "Work-Life Balance",
                  description:
                    "Flexible working arrangements and policies designed to support your wellbeing.",
                },
                {
                  title: "Competitive Benefits",
                  description:
                    "Comprehensive healthcare, retirement plans, and additional perks for our team.",
                },
                {
                  title: "Global Reach",
                  description:
                    "Opportunities to work with international clients and on global projects.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-neutral-50 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-2 font-sans">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8 font-sans">
              Current Openings
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters */}
              <div className="lg:w-1/4">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Department Filter */}
                    <div>
                      <Label className="mb-2 block">Department</Label>
                      <div className="space-y-2">
                        {departments.map((department) => (
                          <button
                            key={department}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                              selectedDepartment === department
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-neutral-100"
                            }`}
                            onClick={() =>
                              setSelectedDepartment(
                                selectedDepartment === department
                                  ? null
                                  : department
                              )
                            }
                          >
                            {department}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <Label className="mb-2 block">Location</Label>
                      <div className="space-y-2">
                        {locations.map((location) => (
                          <button
                            key={location}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                              selectedLocation === location
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-neutral-100"
                            }`}
                            onClick={() =>
                              setSelectedLocation(
                                selectedLocation === location ? null : location
                              )
                            }
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Job Type Filter */}
                    <div>
                      <Label className="mb-2 block">Job Type</Label>
                      <div className="space-y-2">
                        {types.map((type) => (
                          <button
                            key={type}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                              selectedType === type
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-neutral-100"
                            }`}
                            onClick={() =>
                              setSelectedType(
                                selectedType === type ? null : type
                              )
                            }
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="lg:w-3/4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-lg shadow-sm"
                      >
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <div className="flex gap-4 mb-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredCareers && filteredCareers.length > 0 ? (
                      <div className="space-y-4">
                        {filteredCareers.map((job) => (
                          <motion.div
                            key={job.id}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                          >
                            <h3 className="text-xl font-bold mb-2 font-sans">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {job.department}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {job.type}
                              </div>
                            </div>

                            <Accordion type="single" collapsible className="mb-4">
                              <AccordionItem value="details">
                                <AccordionTrigger>
                                  View Job Details
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="mt-2 space-y-4">
                                    <div>
                                      <h4 className="font-bold mb-2">
                                        Description
                                      </h4>
                                      <p className="text-neutral-700">
                                        {job.description}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-bold mb-2">
                                        Requirements
                                      </h4>
                                      <p className="text-neutral-700">
                                        {job.requirements}
                                      </p>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setSelectedJobId(job.id)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  Apply Now
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>
                                    Apply for {job.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Fill out the form below to submit your
                                    application.
                                  </DialogDescription>
                                </DialogHeader>

                                <Form {...form}>
                                  <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4 mt-4"
                                  >
                                    <FormField
                                      control={form.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Full Name</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="John Doe"
                                              {...field}
                                            />
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

                                    <FormField
                                      control={form.control}
                                      name="phone"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Phone Number</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="+1 (123) 456-7890"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name="resume"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Resume URL</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="https://example.com/resume.pdf"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormDescription>
                                            Provide a link to your resume (Google
                                            Drive, Dropbox, etc.)
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name="coverLetter"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Cover Letter</FormLabel>
                                          <FormControl>
                                            <Textarea
                                              placeholder="Tell us why you're interested in this position..."
                                              className="min-h-[100px]"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <Button
                                      type="submit"
                                      className="w-full"
                                      disabled={applicationMutation.isPending}
                                    >
                                      {applicationMutation.isPending
                                        ? "Submitting..."
                                        : "Submit Application"}
                                    </Button>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <Filter className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">
                          No positions found
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          We couldn't find any positions matching your current
                          filters.
                        </p>
                        <Button onClick={resetFilters} variant="outline">
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
