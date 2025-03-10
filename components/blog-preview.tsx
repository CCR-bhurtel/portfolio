"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function BlogPreview() {
  const blogPosts = [
    {
      title: "A comprehensive guide for PostgreSQL indexing",
      excerpt:
        "PostgreSQL is one of the most widely used open-source relational database management systems. Because of its powerful capabilities, adaptability, and scalability, it is frequently used by developers and businesses. Indexing, one of PostgreSQL’s key features, is essential for increasing query performance and enhancing overall database efficiency.",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*iAA2W95eGuDWRWlG2L95Cg.jpeg",
      date: "Apr 12, 2023",
      readTime: "12 min read",
      slug: "a-comprehensive-guide-for-postgresql-indexing-800af5459dba",
    },
    {
      title:
        "Understanding the internal architecture of Slack: How Slack sends millions of messages at a time?",
      excerpt:
        "The architecture of Slack is built to manage enormous volumes of data in real-time, guaranteeing that messages are delivered promptly and consistently. Slack’s design is based on a distributed system that spans numerous data centers across the world.",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*oMIrmlYu1sAbFMmsURO_FQ.png",
      date: "April 3, 2023",
      readTime: "10 min read",
      slug: "understanding-the-internal-architecture-of-slack-how-slack-sends-millions-of-messages-at-a-time-4d4189968fd0",
    },
    {
      title: "Django vs Express, Which Framework should you choose?",
      excerpt:
        "The success of your web application development depends on selecting the appropriate framework. Choosing the right solution for your project might be challenging with so many possibilities on the market.",
      image:
        "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*FQhwWYdBU8jZWHbg_EpNNw.jpeg",
      date: "March 12, 2023",
      readTime: "12 min read",
      slug: "django-vs-express-which-framework-should-you-choose-80585a821bc2",
    },
  ];

  return (
    <section id="blog" className="py-20 w-full">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">
            Blog
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Latest Articles
          </h2>
          <div className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Insights, tutorials, and thoughts on development and technology
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={500}
                    height={300}
                    className="object-center object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="p-0 h-auto" asChild>
                    <Link
                      target="_blank"
                      href={`https://medium.com/@bhurtelshishir/${post.slug}`}
                    >
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link target="_blank" href="https://medium.com/@bhurtelshishir">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
