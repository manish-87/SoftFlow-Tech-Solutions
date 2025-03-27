import { useState } from "react";
import Layout from "@/components/layout/layout";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: blogs, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blogs"],
  });

  // Filter blogs based on search term and category
  const filteredBlogs = blogs?.filter((blog) => {
    const matchesSearch =
      searchTerm === "" ||
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === null || blog.category === selectedCategory;

    return matchesSearch && matchesCategory && blog.published;
  });

  // Extract unique categories
  const categories = blogs
    ? Array.from(new Set(blogs.map((blog) => blog.category)))
    : [];

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
                Success Stories & Insights
              </h1>
              <p className="text-lg text-neutral-700">
                Read about our latest projects, technology insights, and
                industry trends
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            {/* Search and filter */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedCategory === null
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
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
            ) : (
              <>
                {filteredBlogs && filteredBlogs.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {filteredBlogs.map((blog) => (
                      <motion.div
                        key={blog.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {blog.coverImage && (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                              {blog.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(blog.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-neutral-800 mb-3 font-sans">
                            {blog.title}
                          </h3>
                          <p className="text-neutral-600 mb-4">
                            {blog.summary}
                          </p>
                          <Link href={`/blog/${blog.slug}`}>
                            <a className="text-primary font-medium hover:text-primary/80 inline-flex items-center">
                              Read more <span className="ml-2">→</span>
                            </a>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold mb-2">
                      No articles found
                    </h3>
                    <p className="text-neutral-600">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
