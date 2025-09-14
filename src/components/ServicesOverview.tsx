import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Crown, Palette, Sparkles, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Scissors,
    name: "Classic Haircuts",
    description: "Traditional and modern cuts tailored to your style and face shape.",
    duration: "45 min",
    priceRange: "₱400 - ₱800",
    popular: true,
  },
  {
    icon: Crown,
    name: "Premium Styling",
    description: "Complete styling service with wash, cut, and finishing touches.",
    duration: "60 min",
    priceRange: "₱600 - ₱1,200",
    popular: false,
  },
  {
    icon: Palette,
    name: "Beard Grooming",
    description: "Expert beard trimming, shaping, and maintenance services.",
    duration: "30 min",
    priceRange: "₱300 - ₱600",
    popular: true,
  },
  {
    icon: Sparkles,
    name: "Hair Treatments",
    description: "Nourishing treatments to keep your hair healthy and strong.",
    duration: "45 min",
    priceRange: "₱500 - ₱1,000",
    popular: false,
  },
];

const ServicesOverview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 border border-accent/20">
            <Scissors className="w-4 h-4 mr-2" />
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Professional Grooming Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From classic cuts to modern styling, our comprehensive range of services 
            ensures you look and feel your absolute best.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.name}
                className="group relative overflow-hidden hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card border-border animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </div>
                  </div>
                )}

                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-accent-foreground" />
                    </div>
                  </div>

                  {/* Service Name */}
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 text-accent" />
                      {service.duration}
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium text-accent">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {service.priceRange}
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                    asChild
                  >
                    <Link to={`/book?service=${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      Book This Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-primary rounded-2xl p-8 md:p-12 animate-fade-in">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
            Ready for Your Next Appointment?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the QuboMNL difference. Book your appointment today and discover 
            why we're the trusted choice for discerning gentlemen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4"
              asChild
            >
              <Link to="/book">
                Book Appointment
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4"
              asChild
            >
              <Link to="/services">
                View All Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;