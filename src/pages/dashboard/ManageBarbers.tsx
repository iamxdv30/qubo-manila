import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Star, 
  Scissors, 
  Image, 
  DollarSign,
  Loader2,
  Check,
  X,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Barber, BarberRank } from '@/types';

// Mock data for barbers
const mockBarbers: Barber[] = [
  {
    id: 'b1',
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
    availability: [],
  },
  {
    id: 'b2',
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
    availability: [],
  },
  {
    id: 'b3',
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
    availability: [],
  },
  {
    id: 'b4',
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
    availability: [],
  },
  {
    id: 'b5',
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
    availability: [],
  },
];

const ManageBarbers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState<BarberRank | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddBarberOpen, setIsAddBarberOpen] = useState(false);
  const [isEditBarberOpen, setIsEditBarberOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states for add/edit barber
  const [formData, setFormData] = useState({
    name: '',
    rank: 'junior' as BarberRank,
    bio: '',
    experience: 0,
    startingPrice: 0,
    email: '',
    phone: '',
  });

  useEffect(() => {
    // In a real app, fetch barbers from API
    // Simulate API call
    setTimeout(() => {
      setBarbers(mockBarbers);
      setFilteredBarbers(mockBarbers);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!barbers.length) return;
    
    let result = [...barbers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(barber => 
        barber.name.toLowerCase().includes(term) || 
        barber.bio.toLowerCase().includes(term)
      );
    }
    
    // Apply rank filter
    if (rankFilter !== 'all') {
      result = result.filter(barber => barber.rank === rankFilter);
    }
    
    setFilteredBarbers(result);
  }, [barbers, searchTerm, rankFilter]);

  const handleAddBarber = () => {
    setFormData({
      name: '',
      rank: 'junior',
      bio: '',
      experience: 0,
      startingPrice: 300,
      email: '',
      phone: '',
    });
    setIsAddBarberOpen(true);
  };

  const handleEditBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    setFormData({
      name: barber.name,
      rank: barber.rank,
      bio: barber.bio,
      experience: barber.experience,
      startingPrice: barber.startingPrice,
      email: '', // In a real app, fetch from user profile
      phone: '', // In a real app, fetch from user profile
    });
    setIsEditBarberOpen(true);
  };

  const handleDeleteBarber = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveBarber = () => {
    setIsSaving(true);
    
    // In a real app, save to API
    setTimeout(() => {
      if (isAddBarberOpen) {
        // Add new barber
        const newBarber: Barber = {
          id: `b${barbers.length + 1}`,
          userId: `user${barbers.length + 1}`,
          name: formData.name,
          rank: formData.rank,
          profileImage: 'https://i.pravatar.cc/300?img=8',
          portfolioImages: [],
          bio: formData.bio,
          experience: formData.experience,
          startingPrice: formData.startingPrice,
          rating: 0,
          services: [],
          availability: [],
        };
        
        setBarbers(prev => [...prev, newBarber]);
      } else if (isEditBarberOpen && selectedBarber) {
        // Update existing barber
        setBarbers(prev => 
          prev.map(barber => 
            barber.id === selectedBarber.id 
              ? { 
                  ...barber, 
                  name: formData.name,
                  rank: formData.rank,
                  bio: formData.bio,
                  experience: formData.experience,
                  startingPrice: formData.startingPrice,
                } 
              : barber
          )
        );
      }
      
      setIsSaving(false);
      setIsAddBarberOpen(false);
      setIsEditBarberOpen(false);
    }, 1000);
  };

  const handleConfirmDelete = () => {
    if (!selectedBarber) return;
    
    // In a real app, delete via API
    setBarbers(prev => prev.filter(barber => barber.id !== selectedBarber.id));
    setIsDeleteDialogOpen(false);
    setSelectedBarber(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getRankBadge = (rank: BarberRank) => {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Manage Barbers</h1>
            <p className="text-muted-foreground">
              Add, edit, or remove barbers from your team
            </p>
          </div>
          
          <Button onClick={handleAddBarber}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Barber
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search and Filter */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search barbers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={rankFilter}
            onValueChange={(value) => setRankFilter(value as BarberRank | 'all')}
          >
            <SelectTrigger className="w-[180px]">
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

        {/* Barbers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredBarbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBarbers.map((barber) => (
              <Card key={barber.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={barber.profileImage} 
                    alt={barber.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    {getRankBadge(barber.rank)}
                  </div>
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditBarber(barber)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/manage-barbers/${barber.id}`)}>
                          <Scissors className="h-4 w-4 mr-2" />
                          Manage Services
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/barber/${barber.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteBarber(barber)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{barber.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{barber.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{barber.experience} years</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Starting at</p>
                      <p className="font-medium">₱{barber.startingPrice}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{barber.bio}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditBarber(barber)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/dashboard/manage-barbers/${barber.id}`)}
                      className="flex-1"
                    >
                      <Scissors className="h-4 w-4 mr-2" />
                      Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Barbers Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || rankFilter !== 'all' 
                ? 'Try adjusting your filters or search criteria' 
                : 'Get started by adding your first barber'}
            </p>
            {!searchTerm && rankFilter === 'all' && (
              <Button 
                onClick={handleAddBarber}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Barber
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Barber Sheet */}
      <Sheet open={isAddBarberOpen} onOpenChange={setIsAddBarberOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Barber</SheetTitle>
            <SheetDescription>
              Add a new barber to your team
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter barber's full name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Select
                value={formData.rank}
                onValueChange={(value) => handleSelectChange('rank', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (years)</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min={0}
                  value={formData.experience}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startingPrice">Starting Price (₱)</Label>
                <Input
                  id="startingPrice"
                  name="startingPrice"
                  type="number"
                  min={0}
                  value={formData.startingPrice}
                  onChange={handleNumberInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Enter a short bio"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button 
              onClick={handleSaveBarber}
              disabled={!formData.name || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Barber
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Barber Sheet */}
      <Sheet open={isEditBarberOpen} onOpenChange={setIsEditBarberOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Barber</SheetTitle>
            <SheetDescription>
              Update barber information
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter barber's full name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-rank">Rank</Label>
              <Select
                value={formData.rank}
                onValueChange={(value) => handleSelectChange('rank', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-experience">Experience (years)</Label>
                <Input
                  id="edit-experience"
                  name="experience"
                  type="number"
                  min={0}
                  value={formData.experience}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startingPrice">Starting Price (₱)</Label>
                <Input
                  id="edit-startingPrice"
                  name="startingPrice"
                  type="number"
                  min={0}
                  value={formData.startingPrice}
                  onChange={handleNumberInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Enter a short bio"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button 
              onClick={handleSaveBarber}
              disabled={!formData.name || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Update Barber
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Barber</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this barber? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedBarber && (
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedBarber.profileImage} 
                  alt={selectedBarber.name} 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{selectedBarber.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{selectedBarber.rank} Barber</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete Barber
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageBarbers;
