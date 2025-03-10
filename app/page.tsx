import Hero from "@/components/hero";
import About from "@/components/about";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import Education from "@/components/education";
import BlogPreview from "@/components/blog-preview";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "Shishir Bhurtel - Full Stack Developer & DevOps Engineer",
  description:
    "Portfolio of Shishir Bhurtel, a Full Stack Developer and DevOps Engineer specializing in Node.js, React, and cloud technologies.",
  keywords: [
    "Shishir Bhurtel",
    "Full Stack Developer",
    "Node.js Developer",
    "React Developer",
    "DevOps Engineer",
    "Web Development",
    "Portfolio",
  ],
  authors: [{ name: "Shishir Bhurtel" }],
  creator: "Shishir Bhurtel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.shishirbhurtel.com.np",
    title: "Shishir Bhurtel - Full Stack Developer & DevOps Engineer",
    description:
      "Portfolio of Shishir Bhurtel, a Full Stack Developer and DevOps Engineer specializing in Node.js, React, and cloud technologies.",
    siteName: "Shishir Bhurtel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shishir Bhurtel - Full Stack Developer & DevOps Engineer",
    description:
      "Portfolio of Shishir Bhurtel, a Full Stack Developer and DevOps Engineer specializing in Node.js, React, and cloud technologies.",
    creator: "@shishirbhurtel",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="flex min-h-screen flex-col items-center">
        {/* <Nav /> */}

        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <BlogPreview />
        <Contact />
        <Footer />
      </main>
    </ThemeProvider>
  );
}
