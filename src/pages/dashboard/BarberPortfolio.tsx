import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Trash2, Upload, Image, X, Check, Loader2, CropIcon } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PortfolioImage {
  id: string;
  url: string;
  isNew?: boolean;
}

const BarberPortfolio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [previewImages, setPreviewImages] = useState<PortfolioImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for initial portfolio images
  useEffect(() => {
    // In a real app, fetch portfolio images from API
    setTimeout(() => {
      setPortfolioImages([
        { id: '1', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c' },
        { id: '2', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70' },
        { id: '3', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1' },
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    // Initialize preview images with current portfolio images
    setPreviewImages([...portfolioImages]);
  }, [portfolioImages]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (previewImages.length + files.length > 5) {
      toast({
        title: "Maximum limit reached",
        description: "You can only have up to 5 portfolio images.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // In a real app, upload files to server
    // For demo, simulate upload delay and create local URLs
    setTimeout(() => {
      const newImages: PortfolioImage[] = [];
      
      Array.from(files).forEach(file => {
        // Create a local URL for preview
        const url = URL.createObjectURL(file);
        newImages.push({
          id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url,
          isNew: true
        });
      });
      
      setPreviewImages(prev => [...prev, ...newImages]);
      setIsUploading(false);
    }, 1500);
  };

  const handleRemoveImage = (id: string) => {
    setPreviewImages(prev => prev.filter(image => image.id !== id));
  };

  const handleSaveChanges = () => {
    if (previewImages.length === 0) {
      toast({
        title: "Portfolio is empty",
        description: "Please add at least one image to your portfolio.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    // In a real app, save changes to server
    // For demo, simulate API call delay
    setTimeout(() => {
      setPortfolioImages([...previewImages]);
      setIsSaving(false);
      
      toast({
        title: "Portfolio updated",
        description: "Your portfolio has been successfully updated.",
        variant: "default"
      });
    }, 1500);
  };

  const handleCancel = () => {
    // Reset preview images to current portfolio images
    setPreviewImages([...portfolioImages]);
    
    // Revoke any object URLs to avoid memory leaks
    previewImages.forEach(image => {
      if (image.isNew && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
    });
  };

  const hasChanges = () => {
    if (portfolioImages.length !== previewImages.length) return true;
    
    const portfolioIds = portfolioImages.map(img => img.id).sort();
    const previewIds = previewImages.map(img => img.id).sort();
    
    return JSON.stringify(portfolioIds) !== JSON.stringify(previewIds);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your portfolio images to showcase your work
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Current Portfolio</h2>
                <p className="text-sm text-muted-foreground">
                  {previewImages.length}/5 images
                </p>
              </div>

              {/* Portfolio Images Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {previewImages.map((image) => (
                  <div 
                    key={image.id} 
                    className="relative aspect-square rounded-md overflow-hidden border border-border group"
                  >
                    <img 
                      src={image.url} 
                      alt="Portfolio" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Upload Placeholder */}
                {previewImages.length < 5 && (
                  <div
                    className={`
                      aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer
                      ${isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50 hover:bg-accent/5'}
                      transition-colors
                    `}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 text-accent animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Upload Image</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Drag & drop or click to browse
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      disabled={isUploading}
                      multiple={previewImages.length < 4} // Allow multiple only if we can add more than 1
                    />
                  </div>
                )}
              </div>

              {/* Empty State */}
              {previewImages.length === 0 && !isUploading && (
                <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
                  <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Portfolio Images</h3>
                  <p className="text-muted-foreground mb-4">
                    Add images to showcase your best work to potential clients
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mx-auto"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              )}

              {/* Image Guidelines */}
              <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm">
                <h3 className="font-medium mb-2">Image Guidelines</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Maximum of 5 portfolio images</li>
                  <li>Recommended size: 1080x1080 pixels (square)</li>
                  <li>Maximum file size: 5MB per image</li>
                  <li>Supported formats: JPG, PNG</li>
                  <li>Ensure you have permission to use all images</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={!hasChanges() || isUploading || isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={!hasChanges() || isUploading || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BarberPortfolio;
