import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ChevronDown, Check, X } from 'lucide-react';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Barber, BarberRank } from '@/types';
import { useBooking } from '@/hooks/useBooking';

// Mock data for barbers
const mockBarbers: Barber[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'John Doe',
    rank: 'master',
    profileImage: 'https://i.pravatar.cc/300?img=1',
    portfolioImages: [
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
    ],
    bio: 'Master barber with over 10 years of experience specializing in classic cuts and beard styling.',
    experience: 10,
    startingPrice: 500,
    rating: 4.9,
    services: [
      { id: 's1', name: 'Classic Haircut', description: 'Traditional haircut with scissors', price: 500, duration: 45, category: 'haircut' },
      { id: 's2', name: 'Beard Trim', description: 'Precise beard trimming and styling', price: 300, duration: 30, category: 'beard' },
    ],
    availability: [
      {
        id: 'a1',
        barberId: '1',
        date: format(new Date(), 'yyyy-MM-dd'),
        slots: [
          { id: 'ts1', startTime: '09:00', endTime: '09:30', isBooked: false, isPTO: false },
          { id: 'ts2', startTime: '09:30', endTime: '10:00', isBooked: true, isPTO: false },
        ],
      },
    ],
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Mike Smith',
    rank: 'senior',
    profileImage: 'https://i.pravatar.cc/300?img=2',
    portfolioImages: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
      'https://images.unsplash.com/photo-1521038199265-bc482db0f923',
    ],
    bio: 'Senior barber with a passion for modern styles and fades.',
    experience: 7,
    startingPrice: 400,
    rating: 4.7,
    services: [
      { id: 's3', name: 'Fade Haircut', description: 'Modern fade with clippers', price: 400, duration: 40, category: 'haircut' },
      { id: 's4', name: 'Hair & Beard Combo', description: 'Complete styling package', price: 600, duration: 60, category: 'combo' },
    ],
    availability: [
      {
        id: 'a2',
        barberId: '2',
        date: format(new Date(), 'yyyy-MM-dd'),
        slots: [
          { id: 'ts3', startTime: '10:00', endTime: '10:30', isBooked: false, isPTO: false },
          { id: 'ts4', startTime: '10:30', endTime: '11:00', isBooked: false, isPTO: false },
        ],
      },
    ],
  },
  {
    id: '3',
    userId: 'user3',
    name: 'David Chen',
    rank: 'junior',
    profileImage: 'https://i.pravatar.cc/300?img=3',
    portfolioImages: [
      'https://images.unsplash.com/photo-1517832606299-7ae9b720a186',
    ],
    bio: 'Junior barber specializing in trendy cuts for young professionals.',
    experience: 3,
    startingPrice: 300,
    rating: 4.5,
    services: [
      { id: 's5', name: 'Modern Haircut', description: 'Contemporary styling', price: 300, duration: 35, category: 'haircut' },
      { id: 's6', name: 'Beard Grooming', description: 'Beard shaping and care', price: 250, duration: 25, category: 'beard' },
    ],
    availability: [
      {
        id: 'a3',
        barberId: '3',
        date: format(new Date(), 'yyyy-MM-dd'),
        slots: [
          { id: 'ts5', startTime: '11:00', endTime: '11:30', isBooked: true, isPTO: false },
          { id: 'ts6', startTime: '11:30', endTime: '12:00', isBooked: false, isPTO: false },
        ],
      },
    ],
  },
  {
    id: '4',
    userId: 'user4',
    name: 'Alex Johnson',
    rank: 'master',
    profileImage: 'https://i.pravatar.cc/300?img=4',
    portfolioImages: [
      'https://images.unsplash.com/photo-1521499892833-773a6c6fd0b8',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef',
    ],
    bio: 'Master barber with expertise in classic and vintage styles.',
    experience: 12,
    startingPrice: 550,
    rating: 4.8,
    services: [
      { id: 's7', name: 'Executive Cut', description: 'Premium haircut with hot towel', price: 550, duration: 50, category: 'haircut' },
      { id: 's8', name: 'Royal Shave', description: 'Traditional straight razor shave', price: 450, duration: 40, category: 'shave' },
    ],
    availability: [
      {
        id: 'a4',
        barberId: '4',
        date: format(new Date(), 'yyyy-MM-dd'),
        slots: [
          { id: 'ts7', startTime: '13:00', endTime: '13:30', isBooked: false, isPTO: false },
          { id: 'ts8', startTime: '13:30', endTime: '14:00', isBooked: false, isPTO: false },
        ],
      },
    ],
  },
  {
    id: '5',
    userId: 'user5',
    name: 'Carlos Rodriguez',
    rank: 'senior',
    profileImage: 'https://i.pravatar.cc/300?img=5',
    portfolioImages: [
      'https://images.unsplash.com/photo-1567894340315-735d7c361db0',
    ],
    bio: 'Senior barber specializing in creative designs and patterns.',
    experience: 8,
    startingPrice: 450,
    rating: 4.6,
    services: [
      { id: 's9', name: 'Designer Cut', description: 'Custom patterns and designs', price: 450, duration: 45, category: 'haircut' },
      { id: 's10', name: 'Color Treatment', description: 'Professional hair coloring', price: 700, duration: 90, category: 'color' },
    ],
    availability: [
      {
        id: 'a5',
        barberId: '5',
        date: format(new Date(), 'yyyy-MM-dd'),
        slots: [
          { id: 'ts9', startTime: '14:00', endTime: '14:30', isBooked: true, isPTO: false },
          { id: 'ts10', startTime: '14:30', endTime: '15:00', isBooked: true, isPTO: false },
        ],
      },
    ],
  },
  {
    id: '6',
    userId: 'user6',
    name: 'James Wilson',
    rank: 'junior',
    profileImage: 'https://i.pravatar.cc/300?img=6',
    portfolioImages: [
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486',
    ],
    bio: 'Junior barber with a modern approach to traditional styles.',
    experience: 2,
    startingPrice: 280,
    rating: 4.3,
    services: [
      { id: 's11', name: 'Student Cut', description: 'Affordable haircut for students', price: 280, duration: 30, category: 'haircut' },
      { id: 's12', name: 'Quick Trim', description: 'Fast touch-up service', price: 200, duration: 20, category: 'haircut' },
    ],
    availability: [
      {
        id: 'a6',
        barberId: '6',
        date: format(new Date(), 'yyyy-MM-dd'),
        slots: [
          { id: 'ts11', startTime: '15:00', endTime: '15:30', isBooked: false, isPTO: false },
          { id: 'ts12', startTime: '15:30', endTime: '16:00', isBooked: false, isPTO: false },
        ],
      },
    ],
  },
];

// Filter options
type SortOption = 'price_low' | 'price_high' | 'rating' | 'experience';
type FilterState = {
  ranks: BarberRank[];
  services: string[];
  priceRange: [number, number];
  availableToday: boolean;
  searchTerm: string;
  sortBy: SortOption;
};

const BarbersListing = () => {
  const navigate = useNavigate();
  const { setSelectedBarber } = useBooking();
  
  const [barbers, setBarbers] = useState<Barber[]>(mockBarbers);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>(mockBarbers);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    ranks: [],
    services: [],
    priceRange: [200, 700],
    availableToday: false,
    searchTerm: '',
    sortBy: 'rating',
  });

  // Service categories for filtering
  const serviceCategories = [
    { id: 'haircut', name: 'Haircuts' },
    { id: 'beard', name: 'Beard Grooming' },
    { id: 'shave', name: 'Shaves' },
    { id: 'color', name: 'Color Treatments' },
    { id: 'combo', name: 'Combo Services' },
  ];

  // Apply filters and sorting
  useEffect(() => {
    let result = [...mockBarbers];
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(barber => 
        barber.name.toLowerCase().includes(term)
      );
    }
    
    // Filter by rank
    if (filters.ranks.length > 0) {
      result = result.filter(barber => 
        filters.ranks.includes(barber.rank)
      );
    }
    
    // Filter by service category
    if (filters.services.length > 0) {
      result = result.filter(barber => 
        barber.services.some(service => 
          filters.services.includes(service.category)
        )
      );
    }
    
    // Filter by price range
    result = result.filter(barber => 
      barber.startingPrice >= filters.priceRange[0] && 
      barber.startingPrice <= filters.priceRange[1]
    );
    
    // Filter by availability today
    if (filters.availableToday) {
      result = result.filter(barber => {
        const todayAvailability = barber.availability.find(
          a => a.date === format(new Date(), 'yyyy-MM-dd')
        );
        return todayAvailability && todayAvailability.slots.some(slot => !slot.isBooked && !slot.isPTO);
      });
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price_low':
        result.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price_high':
        result.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        result.sort((a, b) => b.experience - a.experience);
        break;
    }
    
    setFilteredBarbers(result);
  }, [filters]);

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    navigate(`/barber/${barber.id}`);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleRankFilter = (rank: BarberRank) => {
    setFilters(prev => {
      const ranks = prev.ranks.includes(rank)
        ? prev.ranks.filter(r => r !== rank)
        : [...prev.ranks, rank];
      return { ...prev, ranks };
    });
  };

  const toggleServiceFilter = (service: string) => {
    setFilters(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const isAvailableToday = (barber: Barber) => {
    const todayAvailability = barber.availability.find(
      a => a.date === format(new Date(), 'yyyy-MM-dd')
    );
    return todayAvailability && todayAvailability.slots.some(slot => !slot.isBooked && !slot.isPTO);
  };

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Rank Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Barber Rank</h3>
        <div className="space-y-2">
          {(['master', 'senior', 'junior'] as BarberRank[]).map(rank => (
            <div key={rank} className="flex items-center">
              <Checkbox
                id={`rank-${rank}`}
                checked={filters.ranks.includes(rank)}
                onCheckedChange={() => toggleRankFilter(rank)}
              />
              <Label
                htmlFor={`rank-${rank}`}
                className="ml-2 text-sm font-medium capitalize"
              >
                {rank}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Services Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Services</h3>
        <div className="space-y-2">
          {serviceCategories.map(category => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={`service-${category.id}`}
                checked={filters.services.includes(category.id)}
                onCheckedChange={() => toggleServiceFilter(category.id)}
              />
              <Label
                htmlFor={`service-${category.id}`}
                className="ml-2 text-sm font-medium"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Price Range</h3>
          <span className="text-xs text-muted-foreground">
            ₱{filters.priceRange[0]} - ₱{filters.priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[200, 700]}
          min={200}
          max={700}
          step={50}
          value={filters.priceRange}
          onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          className="my-4"
        />
      </div>

      {/* Availability Filter */}
      <div className="flex items-center">
        <Checkbox
          id="available-today"
          checked={filters.availableToday}
          onCheckedChange={(checked) => 
            updateFilter('availableToday', checked === true)
          }
        />
        <Label
          htmlFor="available-today"
          className="ml-2 text-sm font-medium"
        >
          Available Today
        </Label>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Our Barbers</h1>
          <p className="mt-2 text-muted-foreground">
            Choose from our skilled professionals for your next grooming session
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search barbers by name..."
              className="pl-10"
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter('sortBy', value as SortOption)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Mobile filter button */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{renderFilters()}</div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card shadow-elegant rounded-lg border border-border p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">Filters</h2>
              {renderFilters()}
            </div>
          </div>

          {/* Barbers Grid */}
          <div className="flex-1">
            {filteredBarbers.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <X className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No barbers found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBarbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="bg-card border border-border rounded-lg overflow-hidden shadow-elegant hover:border-accent transition-colors cursor-pointer"
                    onClick={() => handleBarberSelect(barber)}
                  >
                    {/* Barber Image */}
                    <div className="relative h-64 w-full">
                      <img
                        src={barber.profileImage}
                        alt={barber.name}
                        className="h-full w-full object-cover"
                      />
                      {/* Rank Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant="secondary"
                          className={`
                            ${barber.rank === 'master' ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' : 
                              barber.rank === 'senior' ? 'bg-blue-500/20 text-blue-500 border-blue-500/50' : 
                              'bg-green-500/20 text-green-500 border-green-500/50'}
                            font-medium capitalize
                          `}
                        >
                          {barber.rank}
                        </Badge>
                      </div>
                      
                      {/* Available Today Badge */}
                      {isAvailableToday(barber) && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
                            Available Today
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Barber Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-heading font-semibold text-lg">{barber.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{barber.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Starting from</p>
                          <p className="font-medium">₱{barber.startingPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Experience</p>
                          <p className="font-medium">{barber.experience} years</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarbersListing;
