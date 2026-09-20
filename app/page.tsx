import Nav from "@/components/nav";
import Hero from "@/components/hero";
import About from "@/components/about";
import Work from "@/components/work";
import Toolkit from "@/components/toolkit";
import Experience from "@/components/experience";
import Writing from "@/components/writing";
import Faq from "@/components/faq";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { structuredData } from "@/lib/structured-data";

export default function Home() {
  return (
    <div className="min-h-screen rail:pl-[86px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Toolkit />
        <Experience />
        <Writing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
