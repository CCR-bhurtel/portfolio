"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Facebook,
  Github,
  Linkedin,
  Briefcase,
  ChevronDown,
  Server,
  Globe,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const rotatingTexts = [
    "Backend Developer",
    "Node.js Expert",
    "React Developer",
    "Golang Enthusiast",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex(
          (prevIndex) => (prevIndex + 1) % rotatingTexts.length
        );
        setIsVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingTexts]);

  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      href: "https://www.facebook.com/logicmaestro403/",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/CCR-bhurtel",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/shishir-bhurtel-54974b1b7/",
    },
  ];

  const freelanceLinks = [
    {
      name: "Upwork",
      href: "https://www.upwork.com/freelancers/~01057ddfd5f75dcab7",
      className: "bg-[#6FDA44] hover:bg-[#6FDA44]/90",
    },
    {
      name: "Fiverr",
      href: "https://www.fiverr.com/s/jjG8lZV",
      className: "bg-[#1DBF73] hover:bg-[#1DBF73]/90",
    },
  ];

  const skills = [
    { name: "Node.js", icon: <Server className="h-6 w-6" /> },
    { name: "React", icon: <Globe className="h-6 w-6" /> },
    { name: "Golang", icon: <Server className="h-6 w-6" /> },
    { name: "Postgres", icon: <Database className="h-6 w-6" /> },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/80"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Hello, I&apos;m{" "}
              <span className="text-[#1DBF73]">SHISHIR BHURTEL</span>
            </h1>
            <div className="h-12 mb-6">
              <AnimatePresence mode="wait">
                {isVisible && (
                  <motion.p
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl md:text-2xl text-muted-foreground"
                  >
                    {rotatingTexts[currentTextIndex]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              Crafting scalable web solutions with modern technologies and best
              practices.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center bg-muted/50 rounded-full px-4 py-2"
                >
                  {skill.icon}
                  <span className="ml-2 text-sm font-medium">{skill.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
              {freelanceLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors",
                    link.className
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Hire me on {link.name}
                </motion.a>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#1DBF73] transition-colors p-2 bg-muted/50 rounded-full"
                  aria-label={link.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative w-full aspect-square rounded-full overflow-hidden  shadow-xl">
              <Image
                src="/images/developer_coding_front.png"
                alt="Shishir Bhurtel"
                layout="fill"
                objectFit="contain"
                priority
                className="rounded-full"
              />
            </div>
            <motion.div
              className="absolute -bottom-6 -right-6 bg-[#1DBF73] rounded-lg p-4 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="text-sm font-medium text-white">Currently</div>
              <div className="text-lg font-bold text-white">Open to Work</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Link href="#projects">
        <motion.div
          className="absolute z-[999] bottom-5 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-[#1DBF73]"
          >
            <ChevronDown className="h-8 w-8" />
          </Button>
        </motion.div>
      </Link>
    </section>
  );
}
