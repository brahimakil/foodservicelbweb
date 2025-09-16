import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import AboutContent from "@/components/AboutContent";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutHero />
      <AboutContent />
      <Footer />
    </div>
  );
};

export default About;