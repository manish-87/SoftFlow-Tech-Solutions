import Layout from "@/components/layout/layout";
import { motion } from "framer-motion";
import { Check, Award, Users, Target, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <Layout>
      <div className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-sky-50 via-sky-50 to-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-sans text-neutral-800">About SoftFlow</h1>
              <p className="text-lg text-neutral-700">
                We are a team of passionate technology professionals dedicated to helping businesses grow through innovative software solutions
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6 font-sans">Our Story</h2>
                <p className="text-neutral-700 mb-4">
                  Founded in 2024, SoftFlow began with a vision to bridge the gap between complex technology and business needs. Our founders, seasoned tech professionals, saw that many businesses struggled to implement effective tech solutions that truly served their goals.
                </p>
                <p className="text-neutral-700 mb-4">
                  Starting with just 5 team members in a small office, we've now grown to a big team of experts across multiple disciplines. Throughout our journey, our core values have remained the same delivering excellence, embracing innovation, and prioritizing our clients' success.
                </p>
                
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Our team" 
                  className="rounded-lg shadow-lg w-full" 
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl font-bold mb-4 font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Mission & Vision
              </motion.h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-sky-100 p-3 rounded-full mr-4">
                    <Target className="h-6 w-6 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-bold font-sans">Our Mission</h3>
                </div>
                <p className="text-neutral-700">
                  To empower businesses through innovative technology solutions that drive growth, efficiency, and competitive advantage. We are committed to understanding our clients' unique challenges and delivering tailored solutions that exceed expectations.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-sky-100 p-3 rounded-full mr-4">
                    <Lightbulb className="h-6 w-6 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-bold font-sans">Our Vision</h3>
                </div>
                <p className="text-neutral-700">
                  To be the global leader in delivering transformative technology solutions that shape the future of industries. We envision a world where businesses of all sizes can harness the full potential of technology to create sustainable value and impact.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl font-bold mb-4 font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Core Values
              </motion.h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                These principles guide every decision we make and every solution we deliver
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="h-6 w-6 text-sky-500" />,
                  title: "Excellence",
                  description: "We are committed to delivering the highest quality in everything we do, from code to customer service."
                },
                {
                  icon: <Users className="h-6 w-6 text-sky-500" />,
                  title: "Collaboration",
                  description: "We believe in the power of teamwork, both within our organization and with our clients."
                },
                {
                  icon: <Lightbulb className="h-6 w-6 text-sky-500" />,
                  title: "Innovation",
                  description: "We continuously explore new technologies and approaches to solve complex business challenges."
                },
                {
                  icon: <Target className="h-6 w-6 text-sky-500" />,
                  title: "Client Focus",
                  description: "Our clients' success is our success. We prioritize understanding their needs and exceeding expectations."
                },
                {
                  icon: <Check className="h-6 w-6 text-sky-500" />,
                  title: "Integrity",
                  description: "We uphold the highest ethical standards in all our interactions and business practices."
                },
                {
                  icon: <Award className="h-6 w-6 text-sky-500" />,
                  title: "Continuous Improvement",
                  description: "We are committed to ongoing learning and growth, both as individuals and as an organization."
                }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  className="bg-neutral-50 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-sky-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 font-sans">{value.title}</h3>
                  <p className="text-neutral-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl font-bold mb-4 font-sans"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Leadership Team
              </motion.h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Meet the experienced professionals who lead our organization
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "J Manish Kumar",
                  position: "Chief Executive Officer",
                  image: "https://media.licdn.com/dms/image/v2/D4D03AQG1sd15gE9FdA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1712851215326?e=1748476800&v=beta&t=ntS5N0etPBZSL0lwQRxCB-hhb1srvZgcszd2rVFBdu4"
                },
                {
                  name: "VSS Radha Krishna Kowshik",
                  position: "Chief Technology Officer",
                  image: "https://media.licdn.com/dms/image/v2/D5603AQHGmZSC5ZCctQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1722534144625?e=1748476800&v=beta&t=Rs_WTLVbd1slIg0jmv8wPAzYW8XZQic9UgOeu96bWY0"
                },
                {
                  name: "P Manish Abhi Sai",
                  position: "Chief Operations Officer",
                  image: "https://media.licdn.com/dms/image/v2/D5635AQEuY8OY1MYL2Q/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1716193972208?e=1743789600&v=beta&t=oe9BROutTyiN4bEvHJ5hAjxKtYrfp5Wg54DOPEIEqyY"
                },
               
              ].map((member, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-lg overflow-hidden shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover object-center" 
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold font-sans">{member.name}</h3>
                    <p className="text-neutral-600">{member.position}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
