"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"

export default function Education() {
  const educationData = [
    {
      institution: "Patan Multiple Campus",
      degree: "Bachelors in Computer Science and Information Technology",
      period: "2022 to 2026 (expected)",
      description: "Currently pursuing a degree in Computer Science and Information Technology.",
    },
    {
      institution: "Trinity International College",
      degree: "High School",
      period: "2019 to 2020",
      description: "Completed high school education with a GPA of 3.64.",
    },
  ]

  return (
    <section id="education" className="py-20 w-full">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">Education</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Academic Background</h2>
          <div className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            My educational journey and qualifications
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-6 w-6 text-primary" />
                    {edu.institution}
                  </CardTitle>
                  <CardDescription>{edu.degree}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{edu.period}</p>
                  <p>{edu.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

