import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, Scissors, DollarSign, ChevronRight, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface Barber {
  id: string;
  name: string;
  rank: 'master' | 'senior' | 'junior';
  profileImage: string;
  portfolioImages: string[];
  bio: string;
  experience: number;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  branch: string;
  specialties: string[];
  availability: string[];
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

interface Review {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

const BarberProfile = () => {
  const { barberId } = useParams<{ barberId: string }>();
  const navigate = useNavigate();
  
  const [barber, setBarber] = useState<Barber | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    // In a real app, fetch barber from API
    // Simulate API call
    setTimeout(() => {
      // Mock barber data
      const mockBarber: Barber = {
        id: barberId || 'b1',
        name: 'John Doe',
        rank: 'master',
        profileImage: 'https://i.pravatar.cc/300?img=1',
        portfolioImages: [
          'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
          'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
          'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
          'https://images.unsplash.com/photo-1521038199265-bc482db0f923',
        ],
        bio: 'Master barber with over 10 years of experience specializing in classic cuts and beard styling. Passionate about providing exceptional grooming experiences with attention to detail and personalized service.',
        experience: 10,
        rating: 4.9,
        reviewCount: 128,
        startingPrice: 500,
        branch: 'Makati Branch',
        specialties: ['Classic Cuts', 'Beard Styling', 'Hot Towel Shave', 'Hair Treatment'],
        availability: ['Today', 'Tomorrow'],
        services: [
          {
            id: 's1',
            name: 'Classic Haircut',
            description: 'Traditional haircut with scissors, includes wash and styling',
            price: 500,
            duration: 45,
            category: 'haircut',
          },
          {
            id: 's2',
            name: 'Beard Trim',
            description: 'Precise beard trimming and styling',
            price: 300,
            duration: 30,
            category: 'beard',
          },
          {
            id: 's3',
            name: 'Hair & Beard Combo',
            description: 'Complete styling package with haircut and beard trim',
            price: 700,
            duration: 60,
            category: 'combo',
          },
          {
            id: 's4',
            name: 'Royal Shave',
            description: 'Premium hot towel shave with facial treatment',
            price: 450,
            duration: 45,
            category: 'shave',
          },
          {
            id: 's5',
            name: 'Hair Coloring',
            description: 'Professional hair coloring service',
            price: 1200,
            duration: 90,
            category: 'color',
          },
        ],
      };
      
      // Mock reviews
      const mockReviews: Review[] = [
        {
          id: 'r1',
          customerName: 'Michael Brown',
          customerImage: 'https://i.pravatar.cc/300?img=11',
          rating: 5,
          comment: "John is the best barber I've ever had! His attention to detail is amazing and he really listens to what you want.",
          date: '2025-09-10',
          service: 'Classic Haircut',
        },
        {
          id: 'r2',
          customerName: 'David Garcia',
          customerImage: 'https://i.pravatar.cc/300?img=12',
          rating: 5,
          comment: 'Great experience! The royal shave was so relaxing and my beard has never looked better.',
          date: '2025-09-05',
          service: 'Royal Shave',
        },
        {
          id: 'r3',
          customerName: 'Robert Wilson',
          customerImage: 'https://i.pravatar.cc/300?img=13',
          rating: 4,
          comment: 'Very professional service. The haircut was great, though I had to wait a bit longer than expected.',
          date: '2025-08-28',
          service: 'Hair & Beard Combo',
        },
        {
          id: 'r4',
          customerName: 'James Johnson',
          rating: 5,
          comment: 'Exceptional service! John really knows how to make you feel comfortable and the result was perfect.',
          date: '2025-08-20',
          service: 'Classic Haircut',
        },
      ];
      
      setBarber(mockBarber);
      setReviews(mockReviews);
      setIsLoading(false);
    }, 1500);
  }, [barberId]);

  const getRankBadge = (rank: 'master' | 'senior' | 'junior') => {
    switch (rank) {
      case 'master':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">Master</Badge>;
      case 'senior':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">Senior</Badge>;
      case 'junior':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Junior</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const renderSkeletonProfile = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="h-64 w-64 rounded-lg" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      
      <Skeleton className="h-12 w-full" />
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/barbers')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Barbers
      </Button>
      
      {isLoading ? (
        renderSkeletonProfile()
      ) : barber ? (
        <div className="space-y-8">
          {/* Barber Profile Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <img 
                src={barber.profileImage} 
                alt={barber.name} 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{barber.name}</h1>
                {getRankBadge(barber.rank)}
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span className="font-medium">{barber.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">({barber.reviewCount} reviews)</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{barber.branch}</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center text-muted-foreground">
                  <Scissors className="h-4 w-4 mr-1" />
                  <span>{barber.experience} years</span>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{barber.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {barber.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting at</p>
                  <p className="text-xl font-bold">₱{barber.startingPrice}</p>
                </div>
                
                <Button 
                  className="sm:ml-auto"
                  onClick={() => navigate(`/booking/${barber.id}`)}
                >
                  Book Appointment
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="services" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barber.services.map((service) => (
                  <Card key={service.id} className="overflow-hidden hover:border-accent/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading font-semibold text-lg">{service.name}</h3>
                        <div className="text-right">
                          <p className="font-bold">₱{service.price}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{service.duration} min</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/booking/${barber.id}?service=${service.id}`)}
                      >
                        Book This Service
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {barber.portfolioImages.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={`Portfolio ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Customer Reviews</h2>
                  <p className="text-muted-foreground">{barber.reviewCount} reviews</p>
                </div>
                
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                  <span className="text-xl font-bold">{barber.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">/ 5</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        {review.customerImage ? (
                          <img 
                            src={review.customerImage} 
                            alt={review.customerName} 
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                            <span className="font-medium text-accent">
                              {review.customerName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <p className="text-sm text-muted-foreground">{review.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Book Now CTA */}
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to book with {barber.name}?</h3>
                  <p className="text-muted-foreground">
                    {barber.availability.includes('Today') ? (
                      <>Slots available <span className="font-medium">today</span></>
                    ) : (
                      <>Next available slots: <span className="font-medium">tomorrow</span></>
                    )}
                  </p>
                </div>
                <Button 
                  size="lg"
                  onClick={() => navigate(`/booking/${barber.id}`)}
                >
                  Book Appointment
                  <Calendar className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <h3 className="font-medium text-lg mb-2">Barber Not Found</h3>
          <p className="text-muted-foreground mb-6">
            The barber you're looking for doesn't exist or has been removed
          </p>
          <Button onClick={() => navigate('/barbers')}>
            View All Barbers
          </Button>
        </div>
      )}
    </div>
  );
};

export default BarberProfile;
