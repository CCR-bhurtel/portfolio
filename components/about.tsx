/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 w-full bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">
            About Me
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Get to know me
          </h2>
          <div className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            My journey, experience, and what drives me as a developer
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto overflow-hidden rounded-lg shadow-xl">
              <Image
                src="/images/developer_coding_back.png"
                alt="About Shishir Bhurtel"
                width={400}
                height={400}
                className="object-contain w-full h-[400px]"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background rounded-lg p-4 shadow-lg border border-border">
              <div className="text-sm font-medium">Experience</div>
              <div className="text-lg font-bold">3+ Years</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">Who am I?</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm Shishir Bhurtel, a passionate Full Stack Developer Engineer
                with over 3 years of experience building and deploying web
                applications. I specialize in JavaScript/TypeScript ecosystems
                with frameworks like React, Next.js, and Node.js.
              </p>
              <p>
                My journey in technology began with a deep curiosity about how
                softwares work, which led me to explore various aspects of
                software development. Today, I find fulfillment in creating
                elegant solutions to complex problems and sharing knowledge with
                the community.
              </p>
              <p>
                When I'm not coding, you can find me contributing to open source
                projects, writing blogs, or exploring the latest technologies to
                keep my skills sharp.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h4 className="font-medium">Name:</h4>
                <p className="text-muted-foreground">Shishir Bhurtel</p>
              </div>
              <div>
                <h4 className="font-medium">Email:</h4>
                <p className="text-muted-foreground">
                  bhurtelshishir@gmail.com
                </p>
              </div>
              <div>
                <h4 className="font-medium">Location:</h4>
                <p className="text-muted-foreground">Kathmandu, Nepal</p>
              </div>
              <div>
                <h4 className="font-medium">Availability:</h4>
                <p className="text-primary font-medium">
                  Open to opportunities
                </p>
              </div>
            </div>

            <Button className="mt-4" asChild>
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
