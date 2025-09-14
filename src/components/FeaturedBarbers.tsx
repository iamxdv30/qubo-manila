import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Crown, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

// Mock barber data
const featuredBarbers = [
  {
    id: 1,
    name: "Marcus Rodriguez",
    rank: "Senior Master Stylist",
    image: "/api/placeholder/300/400",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Classic Cuts", "Beard Styling", "Hair Design"],
    experience: "8 years",
    isOwner: false,
  },
  {
    id: 2,
    name: "James Chen",
    rank: "Master Barber & Owner",
    image: "/api/placeholder/300/400",
    rating: 5.0,
    reviewCount: 203,
    specialties: ["Precision Cuts", "Fades", "Styling"],
    experience: "12 years",
    isOwner: true,
  },
  {
    id: 3,
    name: "David Santos",
    rank: "Senior Stylist",
    image: "/api/placeholder/300/400",
    rating: 4.8,
    reviewCount: 89,
    specialties: ["Modern Cuts", "Color", "Treatments"],
    experience: "6 years",
    isOwner: false,
  },
];

const FeaturedBarbers = () => {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 border border-accent/20">
            <Crown className="w-4 h-4 mr-2" />
            Meet Our Masters
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Featured Barbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our team of expert barbers brings years of experience and passion for their craft. 
            Each specialist is dedicated to delivering exceptional results.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredBarbers.map((barber, index) => (
            <Card 
              key={barber.id} 
              className="group overflow-hidden hover:shadow-glow transition-all duration-500 hover:scale-105 bg-card border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="secondary" 
                      className={`${barber.isOwner ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'} font-medium`}
                    >
                      {barber.isOwner && <Crown className="w-3 h-3 mr-1" />}
                      {barber.rank}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="text-white text-sm font-medium">{barber.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    {barber.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Scissors className="w-4 h-4 mr-1" />
                    {barber.experience} experience • {barber.reviewCount} reviews
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {barber.specialties.map((specialty) => (
                      <Badge 
                        key={specialty} 
                        variant="outline" 
                        className="text-xs border-accent/30 text-accent hover:bg-accent/10"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      asChild
                    >
                      <Link to={`/book?barber=${barber.id}`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Now
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      asChild
                    >
                      <Link to={`/barbers/${barber.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center animate-fade-in">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-4"
            asChild
          >
            <Link to="/barbers">
              View All Barbers
              <Crown className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBarbers;