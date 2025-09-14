import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Loader2,
  Check,
  X,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Announcement } from '@/types';

// Mock announcements data
const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Holiday Schedule',
    content: 'QuboMNL will be closed on December 25th and January 1st for the holidays. Please book your appointments accordingly.',
    createdAt: '2025-09-10T10:00:00Z',
    publishedAt: '2025-09-10T10:00:00Z',
    expiresAt: '2025-12-26T23:59:59Z',
    isActive: true,
  },
  {
    id: 'ann2',
    title: 'New Master Barber Joining Our Team',
    content: 'We\'re excited to welcome Alex Johnson, a master barber with 12 years of experience, to our team starting next week. Book your appointments now!',
    createdAt: '2025-09-08T14:30:00Z',
    publishedAt: '2025-09-09T08:00:00Z',
    expiresAt: undefined,
    isActive: true,
  },
  {
    id: 'ann3',
    title: 'Special Discount for Students',
    content: 'Show your valid student ID and get 15% off on all services every Monday and Tuesday.',
    createdAt: '2025-09-05T11:20:00Z',
    publishedAt: '2025-09-05T12:00:00Z',
    expiresAt: '2025-10-31T23:59:59Z',
    isActive: true,
  },
  {
    id: 'ann4',
    title: 'Maintenance Notice',
    content: 'Our booking system will be undergoing maintenance on September 20th from 2 AM to 5 AM. During this time, online booking will be unavailable.',
    createdAt: '2025-09-15T09:00:00Z',
    publishedAt: '2025-09-16T08:00:00Z',
    expiresAt: '2025-09-21T00:00:00Z',
    isActive: false,
  },
  {
    id: 'ann5',
    title: 'New Hair Products Available',
    content: 'We now offer premium hair styling products from Brand X. Ask your barber about these products during your next visit!',
    createdAt: '2025-09-01T15:45:00Z',
    publishedAt: '2025-09-02T08:00:00Z',
    expiresAt: undefined,
    isActive: true,
  },
];

const ManageAnnouncements = () => {
  const { user } = useAuth();
  
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states for add/edit announcement
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    publishDate: new Date(),
    publishTime: '08:00',
    expiryDate: undefined as Date | undefined,
    expiryTime: '23:59',
    isActive: true,
  });

  useEffect(() => {
    // In a real app, fetch announcements from API
    // Simulate API call
    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setFilteredAnnouncements(mockAnnouncements);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!announcements.length) return;
    
    let result = [...announcements];
    const now = new Date();
    
    // Apply tab filter
    if (activeTab === 'active') {
      result = result.filter(ann => ann.isActive);
    } else if (activeTab === 'scheduled') {
      result = result.filter(ann => {
        const publishDate = parseISO(ann.publishedAt);
        return isAfter(publishDate, now);
      });
    } else if (activeTab === 'expired') {
      result = result.filter(ann => {
        if (!ann.expiresAt) return false;
        const expiryDate = parseISO(ann.expiresAt);
        return isBefore(expiryDate, now);
      });
    }
    
    // Sort by creation date (newest first)
    result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setFilteredAnnouncements(result);
  }, [announcements, activeTab]);

  const handleAddAnnouncement = () => {
    setFormData({
      title: '',
      content: '',
      publishDate: new Date(),
      publishTime: '08:00',
      expiryDate: undefined,
      expiryTime: '23:59',
      isActive: true,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    const publishDate = parseISO(announcement.publishedAt);
    const publishTime = format(publishDate, 'HH:mm');
    
    let expiryDate: Date | undefined;
    let expiryTime = '23:59';
    
    if (announcement.expiresAt) {
      expiryDate = parseISO(announcement.expiresAt);
      expiryTime = format(expiryDate, 'HH:mm');
    }
    
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      publishDate,
      publishTime,
      expiryDate,
      expiryTime,
      isActive: announcement.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  const handlePreviewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsPreviewDialogOpen(true);
  };

  const handleToggleActive = (announcement: Announcement) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === announcement.id 
          ? { ...ann, isActive: !ann.isActive } 
          : ann
      )
    );
  };

  const handleSaveAnnouncement = () => {
    setIsSaving(true);
    
    // Combine date and time for publish and expiry
    const publishDateTime = new Date(formData.publishDate);
    const [publishHours, publishMinutes] = formData.publishTime.split(':').map(Number);
    publishDateTime.setHours(publishHours, publishMinutes);
    
    let expiryDateTime: string | undefined;
    if (formData.expiryDate) {
      const expiry = new Date(formData.expiryDate);
      const [expiryHours, expiryMinutes] = formData.expiryTime.split(':').map(Number);
      expiry.setHours(expiryHours, expiryMinutes);
      expiryDateTime = expiry.toISOString();
    }
    
    // In a real app, save to API
    setTimeout(() => {
      if (isAddDialogOpen) {
        // Add new announcement
        const newAnnouncement: Announcement = {
          id: `ann${announcements.length + 1}`,
          title: formData.title,
          content: formData.content,
          createdAt: new Date().toISOString(),
          publishedAt: publishDateTime.toISOString(),
          expiresAt: expiryDateTime,
          isActive: formData.isActive,
        };
        
        setAnnouncements(prev => [newAnnouncement, ...prev]);
      } else if (isEditDialogOpen && selectedAnnouncement) {
        // Update existing announcement
        setAnnouncements(prev => 
          prev.map(ann => 
            ann.id === selectedAnnouncement.id 
              ? { 
                  ...ann, 
                  title: formData.title,
                  content: formData.content,
                  publishedAt: publishDateTime.toISOString(),
                  expiresAt: expiryDateTime,
                  isActive: formData.isActive,
                } 
              : ann
          )
        );
      }
      
      setIsSaving(false);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    }, 1000);
  };

  const handleConfirmDelete = () => {
    if (!selectedAnnouncement) return;
    
    // In a real app, delete via API
    setAnnouncements(prev => prev.filter(ann => ann.id !== selectedAnnouncement.id));
    setIsDeleteDialogOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (announcement: Announcement) => {
    const now = new Date();
    const publishDate = parseISO(announcement.publishedAt);
    
    if (!announcement.isActive) {
      return <Badge variant="outline" className="bg-gray-500/20 text-gray-500 border-gray-500/50">Inactive</Badge>;
    }
    
    if (isAfter(publishDate, now)) {
      return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">Scheduled</Badge>;
    }
    
    if (announcement.expiresAt) {
      const expiryDate = parseISO(announcement.expiresAt);
      if (isBefore(expiryDate, now)) {
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">Expired</Badge>;
      }
    }
    
    return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Active</Badge>;
  };

  const getAnnouncementPreview = () => {
    if (!selectedAnnouncement) return null;
    
    return (
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg">{selectedAnnouncement.title}</h3>
            {getStatusBadge(selectedAnnouncement)}
          </div>
          
          <div className="prose prose-sm dark:prose-invert">
            <p>{selectedAnnouncement.content}</p>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Published: {format(parseISO(selectedAnnouncement.publishedAt), 'MMM d, yyyy')}
            </p>
            {selectedAnnouncement.expiresAt && (
              <p className="text-xs text-muted-foreground">
                Expires: {format(parseISO(selectedAnnouncement.expiresAt), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h4 className="font-medium mb-2">How it appears on the website:</h4>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{selectedAnnouncement.title}</h3>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(selectedAnnouncement.publishedAt), 'MMM d, yyyy')}
              </p>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{selectedAnnouncement.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Manage Announcements</h1>
            <p className="text-muted-foreground">
              Create and manage announcements for your customers
            </p>
          </div>
          
          <Button onClick={handleAddAnnouncement}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Announcements List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold">{announcement.title}</h3>
                        {getStatusBadge(announcement)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Published: {format(parseISO(announcement.publishedAt), 'MMM d, yyyy')}</span>
                        {announcement.expiresAt && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Expires: {format(parseISO(announcement.expiresAt), 'MMM d, yyyy')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleToggleActive(announcement)}
                        title={announcement.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {announcement.isActive ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePreviewAnnouncement(announcement)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteAnnouncement(announcement)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Announcements Found</h3>
            <p className="text-muted-foreground">
              {activeTab !== 'all' 
                ? `There are no ${activeTab} announcements` 
                : 'Get started by creating your first announcement'}
            </p>
            {activeTab === 'all' && (
              <Button 
                onClick={handleAddAnnouncement}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Announcement Dialog */}
      <Dialog 
        open={isAddDialogOpen || isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? 'Create New Announcement' : 'Edit Announcement'}
            </DialogTitle>
            <DialogDescription>
              {isAddDialogOpen 
                ? 'Create a new announcement to display on the website' 
                : 'Update the announcement details'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter announcement title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter announcement content"
                className="min-h-[150px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.publishDate ? format(formData.publishDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.publishDate}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, publishDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publishTime">Publish Time</Label>
                <Input
                  id="publishTime"
                  name="publishTime"
                  type="time"
                  value={formData.publishTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Expiry Date</Label>
                  <Label className="text-xs text-muted-foreground">(Optional)</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? format(formData.expiryDate, 'PPP') : <span>No expiry date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, expiryDate: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, expiryDate: undefined }))}
                        className="w-full"
                      >
                        Clear
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryTime">Expiry Time</Label>
                <Input
                  id="expiryTime"
                  name="expiryTime"
                  type="time"
                  value={formData.expiryTime}
                  onChange={handleInputChange}
                  disabled={!formData.expiryDate}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAnnouncement}
              disabled={!formData.title || !formData.content || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {isAddDialogOpen ? 'Create Announcement' : 'Update Announcement'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedAnnouncement && (
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <h3 className="font-medium">{selectedAnnouncement.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {selectedAnnouncement.content}
                </p>
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
              Delete Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Announcement Preview</DialogTitle>
            <DialogDescription>
              This is how the announcement will appear on the website
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {getAnnouncementPreview()}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageAnnouncements;
