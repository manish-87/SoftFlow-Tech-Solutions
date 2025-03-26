import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const { data: blogs, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blogs"],
  });
  
  // Filter for published blogs and take the latest 3
  const displayBlogs = blogs?.filter(blog => blog.published).slice(0, 3);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  if (isLoading) {
    return (
      <section id="blog" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-[300px] mx-auto mb-4" />
            <Skeleton className="h-6 w-[500px] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="blog" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 font-sans">Success Stories</h2>
          <p className="mt-3 text-neutral-600 max-w-2xl mx-auto">Read how we've helped businesses overcome their technology challenges.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayBlogs && displayBlogs.map((blog) => (
            <motion.div 
              key={blog.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={item}
            >
              {blog.coverImage && (
                <img 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  className="w-full h-48 object-cover" 
                />
              )}
              <div className="p-6">
                <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">{blog.category}</span>
                <h3 className="text-xl font-bold text-neutral-800 mt-2 mb-3 font-sans">{blog.title}</h3>
                <p className="text-neutral-600 mb-4">{blog.summary}</p>
                <Link href={`/blog/${blog.slug}`}>
                  <a className="text-primary font-medium hover:text-primary/80 inline-flex items-center">
                    Read more <span className="ml-2">→</span>
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
          
          {/* Show fallback if no blogs */}
          {(!displayBlogs || displayBlogs.length === 0) && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8">
              <p className="text-neutral-500">No blog posts available at the moment. Check back soon!</p>
            </div>
          )}
        </motion.div>
        
        <div className="text-center mt-10">
          <Link href="/blog">
            <motion.a 
              className="inline-block bg-neutral-800 hover:bg-neutral-900 text-white py-3 px-8 rounded-md font-medium transition duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Success Stories
            </motion.a>
          </Link>
        </div>
      </div>
    </section>
  );
}
