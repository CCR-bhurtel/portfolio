"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Globe, PenToolIcon as Tool, FileCode2 } from "lucide-react"

export default function Skills() {
  const skillCategories = [
    {
      title: "Languages",
      icon: <Code className="h-8 w-8 mb-4 text-primary" />,
      skills: [
        { name: "JavaScript", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Python", level: 60 },
        { name: "Go", level: 50 },
      ],
    },
    {
      title: "Backend",
      icon: <Server className="h-8 w-8 mb-4 text-primary" />,
      skills: [
        { name: "Node.js", level: 95 },
        { name: "Express.js", level: 90 },
        { name: "Fastify", level: 65 },
        { name: "RESTful APIs", level: 95 },
      ],
    },
    {
      title: "Frontend",
      icon: <Globe className="h-8 w-8 mb-4 text-primary" />,
      skills: [
        { name: "React.js", level: 90 },
        { name: "Redux.js", level: 85 },
        { name: "Next.js", level: 80 },
        { name: "HTML/CSS", level: 90 },
      ],
    },
    {
      title: "Database",
      icon: <Database className="h-8 w-8 mb-4 text-primary" />,
      skills: [
        { name: "MongoDB", level: 90 },
        { name: "MySQL", level: 85 },
        { name: "PostgreSQL", level: 80 },
        { name: "Redis", level: 75 },
      ],
    },
    {
      title: "Tools & DevOps",
      icon: <Tool className="h-8 w-8 mb-4 text-primary" />,
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 85 },
        { name: "AWS", level: 80 },
        { name: "Jenkins", level: 75 },
      ],
    },
    {
      title: "Development Practices",
      icon: <FileCode2 className="h-8 w-8 mb-4 text-primary" />,
      skills: [
        { name: "Test-Driven Development", level: 85 },
        { name: "Refactoring", level: 90 },
        { name: "Extreme Programming", level: 80 },
        { name: "Clean Code", level: 90 },
      ],
    },
  ]

  return (
    <section id="skills" className="py-20 w-full bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">Skills</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Technical Expertise</h2>
          <div className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            A comprehensive overview of my technical skills and proficiency levels
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-background p-6 rounded-lg shadow-sm border border-border"
            >
              <div className="flex flex-col items-center text-center mb-4">
                {category.icon}
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + skillIndex * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

