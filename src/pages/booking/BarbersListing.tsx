import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Clock, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface Barber {
  id: string;
  name: string;
  rank: 'master' | 'senior' | 'junior';
  profileImage: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  branch: string;
  specialties: string[];
  availability: string[];
}

const BarbersListing = () => {
  const navigate = useNavigate();
  
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // In a real app, fetch barbers from API
    // Simulate API call
    setTimeout(() => {
      const mockBarbers: Barber[] = [
        {
          id: 'b1',
          name: 'John Doe',
          rank: 'master',
          profileImage: 'https://i.pravatar.cc/300?img=1',
          rating: 4.9,
          reviewCount: 128,
          startingPrice: 500,
          branch: 'Makati Branch',
          specialties: ['Classic Cuts', 'Beard Styling', 'Hot Towel Shave'],
          availability: ['Today', 'Tomorrow'],
        },
        {
          id: 'b2',
          name: 'Mike Smith',
          rank: 'senior',
          profileImage: 'https://i.pravatar.cc/300?img=2',
          rating: 4.7,
          reviewCount: 95,
          startingPrice: 450,
          branch: 'BGC Branch',
          specialties: ['Fades', 'Modern Styles', 'Hair Coloring'],
          availability: ['Tomorrow'],
        },
        {
          id: 'b3',
          name: 'David Chen',
          rank: 'junior',
          profileImage: 'https://i.pravatar.cc/300?img=3',
          rating: 4.5,
          reviewCount: 42,
          startingPrice: 350,
          branch: 'Ortigas Branch',
          specialties: ['Trendy Cuts', 'Beard Grooming'],
          availability: ['Today', 'Tomorrow'],
        },
        {
          id: 'b4',
          name: 'Alex Johnson',
          rank: 'master',
          profileImage: 'https://i.pravatar.cc/300?img=4',
          rating: 4.8,
          reviewCount: 156,
          startingPrice: 550,
          branch: 'Makati Branch',
          specialties: ['Executive Cuts', 'Royal Shave', 'Hair Treatment'],
          availability: ['Tomorrow'],
        },
        {
          id: 'b5',
          name: 'Carlos Rodriguez',
          rank: 'senior',
          profileImage: 'https://i.pravatar.cc/300?img=5',
          rating: 4.6,
          reviewCount: 78,
          startingPrice: 450,
          branch: 'BGC Branch',
          specialties: ['Designer Cuts', 'Hair Coloring', 'Styling'],
          availability: ['Today'],
        },
      ];
      
      setBarbers(mockBarbers);
      setFilteredBarbers(mockBarbers);
      setIsLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!barbers.length) return;
    
    let result = [...barbers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(barber => 
        barber.name.toLowerCase().includes(term) || 
        barber.specialties.some(specialty => specialty.toLowerCase().includes(term))
      );
    }
    
    // Apply rank filter
    if (rankFilter !== 'all') {
      result = result.filter(barber => barber.rank === rankFilter);
    }
    
    // Apply branch filter
    if (branchFilter !== 'all') {
      result = result.filter(barber => barber.branch === branchFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'price_low') {
        return a.startingPrice - b.startingPrice;
      } else if (sortBy === 'price_high') {
        return b.startingPrice - a.startingPrice;
      }
      return 0;
    });
    
    setFilteredBarbers(result);
  }, [barbers, searchTerm, rankFilter, branchFilter, sortBy]);

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

  const renderFilters = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Barber Rank</h3>
        <Select
          value={rankFilter}
          onValueChange={setRankFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by rank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ranks</SelectItem>
            <SelectItem value="master">Master</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
            <SelectItem value="junior">Junior</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Branch</h3>
        <Select
          value={branchFilter}
          onValueChange={setBranchFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="Makati Branch">Makati Branch</SelectItem>
            <SelectItem value="BGC Branch">BGC Branch</SelectItem>
            <SelectItem value="Ortigas Branch">Ortigas Branch</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Sort By</h3>
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderBarberSkeletons = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="relative h-48">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Barbers</h1>
        <p className="text-muted-foreground">
          Choose a skilled barber for your next appointment
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Filters</h2>
                {renderFilters()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Search and Mobile Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search barbers by name or specialty..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Filter and sort barbers
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6">
                    {renderFilters()}
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="hidden md:block">
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Barbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                renderBarberSkeletons()
              ) : filteredBarbers.length > 0 ? (
                filteredBarbers.map((barber) => (
                  <Card key={barber.id} className="overflow-hidden hover:border-accent/50 transition-colors cursor-pointer" onClick={() => navigate(`/barber/${barber.id}`)}>
                    <div className="relative h-48">
                      <img 
                        src={barber.profileImage} 
                        alt={barber.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        {getRankBadge(barber.rank)}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading font-semibold text-lg">{barber.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">{barber.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">({barber.reviewCount})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{barber.branch}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {barber.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Starting at</p>
                          <p className="font-medium">₱{barber.startingPrice}</p>
                        </div>
                        
                        <div>
                          {barber.availability.includes('Today') ? (
                            <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                              <Clock className="h-3 w-3 mr-1" />
                              Available Today
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">
                              <Calendar className="h-3 w-3 mr-1" />
                              Next Available: Tomorrow
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-card border border-border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">No Barbers Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarbersListing;
