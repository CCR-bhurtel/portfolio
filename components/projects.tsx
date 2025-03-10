"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

export default function Projects() {
  const [visibleProjects, setVisibleProjects] = useState(3);

  const projects = [
    {
      title: "ShareDirect - A peer to peer file transfer application",
      description:
        "A peer-to-peer file transfer application that allows users to share files directly between devices without uploading them to a server.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Golang", "Next.js", "WebRTC", "WebSockets", "Tailwind CSS"],
      github: "https://github.com/CCR-bhurtel/ShareDirect",
      demo: "https://share-direct.vercel.app",
    },

    {
      title: "ChatUp - Realtime Chat Application",
      description:
        "A feature-rich chat application with private messaging, group chats, file sharing, and end-to-end encryption.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Node.js", "Express.js", "WebSockets", "MongoDB", "Next.js"],
      github: "https://github.com/CCR-bhurtel/ChatUp",
      demo: "https://chat-up-phi.vercel.app/",
    },

    {
      title: "Electrostatics",
      description:
        "A simple elctrostatics model with various modules such as induction and conduction, circular motion of charge, dipole moment etc. Designed for students to learn electrostatics concepts.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["p5.js", "HTML", "CSS", "JavaScript"],
      // github: "https://github.com/shishirbhurtel/ecommerce-platform",
      demo: "https://electrostatics.netlify.app/",
    },

    {
      title: "Penvoke - Social Media for Writers (Backend)",
      description:
        "A social media platform designed to connect writers, literature enthusiasts, and content creators. Implemented using Level 3 Richardson's maturity Model for RESTful APIs.",
      image: "/placeholder.svg?height=400&width=600",
      tags: [
        "Express.js",
        "Socket.IO",
        "Redis",
        "Docker",
        "Prometheus",
        "Winston",
        "JWT",
        "OAuth",
      ],
      // github: "https://github.com/shishirbhurtel/penvoke",
      // demo: "https://penvoke.shishirbhurtel.com.np",
    },
  ];

  const loadMoreProjects = () => {
    setVisibleProjects(projects.length);
  };

  return (
    <section id="projects" className="py-20 w-full">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">
            Projects
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Featured Work
          </h2>
          <div className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            A showcase of my most significant projects and technical
            achievements
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.slice(0, visibleProjects).map((project, index) => (
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
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 my-2">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {visibleProjects < projects.length && (
          <div className="mt-12 text-center">
            <Button
              onClick={loadMoreProjects}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Load More Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
