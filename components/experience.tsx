/* eslint-disable react/no-unescaped-entities */
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Experience() {
  const experiences = [
    {
      title: "Full Stack Developer (Contract)",
      company: "AppCentric (US)",
      period: "December 2024 - Present",
      description:
        "Working on BackToIt and BidStruct projects, optimizing RESTful APIs, and developing user interfaces.",
      responsibilities: [
        "Optimized RESTful APIs, enhancing response times by 10% and reducing database query times by 8%",
        "Integrated third-party services and implemented caching strategies",
        "Developed and integrated React.js and Redux.js for government-based bidding platform",
        "Contributed to creating an intuitive and user-friendly interface",
      ],
      technologies: ["Node.js", "Express.js", "React.js", "Redux.js", "MongoDB"],
    },
    {
      title: "Full Stack Developer (Contract)",
      company: "TijgerSoftware, Germany",
      period: "April 2024 - September 2024",
      description:
        "Drove the organization to remarkable achievements, helping to accomplish multiple national-level projects in Netherlands and Germany.",
      responsibilities: [
        "Developed and maintained RESTful APIs using Express.js, Next.js, and MongoDB",
        "Implemented secure authentication with OAuth and JWT",
        "Integrated Stripe API for payment processing",
        "Collaborated on React.js frontend development",
        "Worked on national-level projects, including a government exam assigning platform in PayloadCMS",
        "Implemented Domain-Centric Architectures",
        "Improved backend architecture to handle more than 100K concurrent users",
      ],
      technologies: ["Express.js", "Next.js", "MongoDB", "OAuth", "JWT", "Stripe API", "React.js", "PayloadCMS"],
    },
    {
      title: "Freelance Web Developer",
      company: "Fiverr, Upwork",
      period: "December 2020 - March 2024",
      description:
        "Offered custom web development services on popular platforms like Fiverr and Upwork, specializing in Node.js-based software solutions.",
      responsibilities: [
        "Completed over 75 tasks (orders) with over 40 unique clients worldwide",
        "Gained 'Level 2' status on Fiverr and 'Top Rated' on Upwork in a short period",
        "Consistently delivered high-quality results exceeding client expectations",
        "Maintained transparency and open communication with clients",
      ],
      technologies: ["Node.js", "JavaScript", "Web Development"],
    },
  ]

  return (
    <section id="experience" className="py-20 w-full">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">Experience</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Professional Journey</h2>
          <div className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            My career path and the companies I've had the privilege to work with
          </div>
        </motion.div>

        <div className="grid gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl md:text-2xl">{exp.title}</CardTitle>
                      <CardDescription className="text-base md:text-lg">
                        {exp.company} • <span className="text-primary">{exp.period}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{exp.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Key Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <Badge key={i} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

