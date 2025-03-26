import Layout from "@/components/layout/layout";
import Hero from "@/components/home/hero";
import Stats from "@/components/home/stats";
import Services from "@/components/home/services";
import About from "@/components/home/about";
import Partners from "@/components/home/partners";
import Blog from "@/components/home/blog";
import Contact from "@/components/home/contact";

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <Services />
      <About />
      <Partners />
      <Blog />
      <Contact />
    </Layout>
  );
}
