import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactHero from "@/components/ContactHero";
import ContactContent from "@/components/ContactContent";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ContactHero />
      <ContactContent />
      <Footer />
    </div>
  );
};

export default Contact;