import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedBarbers from "@/components/FeaturedBarbers";
import ServicesOverview from "@/components/ServicesOverview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <FeaturedBarbers />
        <ServicesOverview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
