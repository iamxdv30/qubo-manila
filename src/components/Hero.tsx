import { Button } from "@/components/ui/button";
import { Calendar, Star, Scissors, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Scissors className="w-16 h-16 text-accent animate-float" />
      </div>
      <div className="absolute top-40 right-16 opacity-20">
        <Crown className="w-12 h-12 text-accent animate-float" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute bottom-32 left-20 opacity-20">
        <Star className="w-10 h-10 text-accent animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 border border-accent/20">
            <Crown className="w-4 h-4 mr-2" />
            Premium Grooming Experience
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight">
            Where Style Meets
            <span className="text-accent block mt-2">Sophistication</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Experience the finest in professional grooming at QuboMNL. 
            Book your appointment with our expert barbers and discover your best look.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg shadow-glow transition-spring hover:scale-105"
              asChild
            >
              <Link to="/book">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg transition-spring hover:scale-105"
              asChild
            >
              <Link to="/barbers">
                View Our Barbers
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "500+", label: "Happy Clients" },
              { number: "10+", label: "Expert Barbers" },
              { number: "5★", label: "Average Rating" },
              { number: "3", label: "Premium Locations" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-2xl md:text-3xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;