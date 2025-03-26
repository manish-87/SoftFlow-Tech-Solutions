import { useEffect } from "react";
import Layout from "@/components/layout/layout";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: blog, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blogs/${slug}`],
    enabled: !!slug,
  });

  // Fetch related blogs (just using all blogs and filtering)
  const { data: allBlogs } = useQuery<BlogPost[]>({
    queryKey: ["/api/blogs"],
  });

  const relatedBlogs = allBlogs
    ?.filter(
      (b) => b.published && b.category === blog?.category && b.id !== blog?.id
    )
    .slice(0, 3);

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-20">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-3xl mx-auto">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="flex gap-4 mb-8">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className="pt-20">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-4">
                Blog post not found or unavailable
              </h1>
              <p className="text-neutral-600 mb-6">
                The article you're looking for might have been removed or is
                temporarily unavailable.
              </p>
              <Link href="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20">
        {/* Article Section */}
        <article className="py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <Link href="/blog">
                <a className="inline-flex items-center text-primary mb-6 hover:text-primary/80">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles
                </a>
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-4 font-sans">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-neutral-600 mb-8">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(blog.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span className="text-sm">{blog.category}</span>
                  </div>
                </div>

                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-auto rounded-lg mb-8"
                  />
                )}

                <div
                  className="prose max-w-none prose-headings:font-sans prose-headings:font-bold prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </motion.div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <section className="py-12 bg-neutral-100">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-2xl font-bold mb-8 font-sans">
                Related Articles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <motion.div
                    key={relatedBlog.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {relatedBlog.coverImage && (
                      <img
                        src={relatedBlog.coverImage}
                        alt={relatedBlog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                        {relatedBlog.category}
                      </span>
                      <h3 className="text-lg font-bold text-neutral-800 mt-2 mb-2 font-sans">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {relatedBlog.summary}
                      </p>
                      <Link href={`/blog/${relatedBlog.slug}`}>
                        <a className="text-primary font-medium hover:text-primary/80 inline-flex items-center text-sm">
                          Read more <span className="ml-2">→</span>
                        </a>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
