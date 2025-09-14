import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  UserCog, 
  Shield,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRole } from '@/types';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@qubomanl.com',
    role: 'barber',
    branch: 'Makati Branch',
    status: 'active',
    lastLogin: '2025-09-15T09:30:00Z',
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'user2',
    name: 'Mike Smith',
    email: 'mike@qubomanl.com',
    role: 'barber',
    branch: 'BGC Branch',
    status: 'active',
    lastLogin: '2025-09-14T14:20:00Z',
    createdAt: '2025-02-20T09:15:00Z',
  },
  {
    id: 'user3',
    name: 'David Chen',
    email: 'david@qubomanl.com',
    role: 'barber',
    branch: 'Ortigas Branch',
    status: 'active',
    lastLogin: '2025-09-15T11:45:00Z',
    createdAt: '2025-03-10T10:30:00Z',
  },
  {
    id: 'user4',
    name: 'Alex Johnson',
    email: 'alex@qubomanl.com',
    role: 'barber',
    branch: 'Makati Branch',
    status: 'active',
    lastLogin: '2025-09-13T16:15:00Z',
    createdAt: '2025-01-05T08:45:00Z',
  },
  {
    id: 'user5',
    name: 'Maria Garcia',
    email: 'maria@qubomanl.com',
    role: 'cashier',
    branch: 'BGC Branch',
    status: 'active',
    lastLogin: '2025-09-15T08:30:00Z',
    createdAt: '2025-04-12T09:00:00Z',
  },
  {
    id: 'user6',
    name: 'Sarah Johnson',
    email: 'sarah@qubomanl.com',
    role: 'cashier',
    branch: 'Makati Branch',
    status: 'inactive',
    lastLogin: '2025-09-01T10:20:00Z',
    createdAt: '2025-02-28T11:30:00Z',
  },
  {
    id: 'user7',
    name: 'Robert Williams',
    email: 'robert@qubomanl.com',
    role: 'general_admin',
    branch: 'Makati Branch',
    status: 'active',
    lastLogin: '2025-09-15T07:50:00Z',
    createdAt: '2025-01-10T08:15:00Z',
  },
  {
    id: 'user8',
    name: 'Jennifer Lopez',
    email: 'jennifer@qubomanl.com',
    role: 'general_admin',
    branch: 'BGC Branch',
    status: 'active',
    lastLogin: '2025-09-14T17:30:00Z',
    createdAt: '2025-03-15T09:45:00Z',
  },
  {
    id: 'user9',
    name: 'Michael Brown',
    email: 'michael@qubomanl.com',
    role: 'primary_admin',
    branch: 'Makati Branch',
    status: 'active',
    lastLogin: '2025-09-15T08:10:00Z',
    createdAt: '2025-01-02T08:00:00Z',
  },
];

// Branch data
const branches = [
  { id: 'branch1', name: 'Makati Branch' },
  { id: 'branch2', name: 'BGC Branch' },
  { id: 'branch3', name: 'Ortigas Branch' },
];

const UserManagement = () => {
  const { user } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Dialog states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states for add/edit user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'barber' as UserRole,
    branch: '',
    sendInvite: true,
  });

  useEffect(() => {
    // In a real app, fetch users from API
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!users.length) return;
    
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply branch filter
    if (branchFilter !== 'all') {
      result = result.filter(user => user.branch === branchFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter, branchFilter]);

  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      role: 'barber',
      branch: branches[0].name,
      sendInvite: true,
    });
    setIsAddUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      sendInvite: false,
    });
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    // In a real app, update via API
    setUsers(prev => 
      prev.map(u => 
        u.id === user.id 
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } 
          : u
      )
    );
  };

  const handleSaveUser = () => {
    setIsSaving(true);
    
    // In a real app, save to API
    setTimeout(() => {
      if (isAddUserOpen) {
        // Add new user
        const newUser: User = {
          id: `user${users.length + 1}`,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          branch: formData.branch,
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        
        setUsers(prev => [...prev, newUser]);
      } else if (isEditUserOpen && selectedUser) {
        // Update existing user
        setUsers(prev => 
          prev.map(u => 
            u.id === selectedUser.id 
              ? { 
                  ...u, 
                  name: formData.name,
                  email: formData.email,
                  role: formData.role,
                  branch: formData.branch,
                } 
              : u
          )
        );
      }
      
      setIsSaving(false);
      setIsAddUserOpen(false);
      setIsEditUserOpen(false);
    }, 1000);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    
    // In a real app, delete via API
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmResetPassword = () => {
    if (!selectedUser) return;
    
    // In a real app, reset password via API
    setIsResetPasswordOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'primary_admin':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500 border-purple-500/50">Primary Admin</Badge>;
      case 'general_admin':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/50">General Admin</Badge>;
      case 'cashier':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Cashier</Badge>;
      case 'barber':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500 border-blue-500/50">Barber</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">Active</Badge>
      : <Badge variant="outline" className="bg-gray-500/20 text-gray-500 border-gray-500/50">Inactive</Badge>;
  };

  const renderFilters = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Role</h3>
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="primary_admin">Primary Admin</SelectItem>
            <SelectItem value="general_admin">General Admin</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="barber">Barber</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Status</h3>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Branch</h3>
        <Select
          value={branchFilter}
          onValueChange={(value) => setBranchFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map(branch => (
              <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-heading font-semibold text-lg mb-4">Filters</h2>
                {renderFilters()}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-4">
              {/* Search and Mobile Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users by name or email..."
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
                        Filter users by role, status, and branch
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                      {renderFilters()}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Users Table */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : filteredUsers.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium">Name</th>
                            <th className="text-left p-4 font-medium">Email</th>
                            <th className="text-left p-4 font-medium">Role</th>
                            <th className="text-left p-4 font-medium">Branch</th>
                            <th className="text-left p-4 font-medium">Status</th>
                            <th className="text-left p-4 font-medium">Last Login</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                              <td className="p-4 font-medium">{user.name}</td>
                              <td className="p-4">{user.email}</td>
                              <td className="p-4">{getRoleBadge(user.role)}</td>
                              <td className="p-4">{user.branch}</td>
                              <td className="p-4">{getStatusBadge(user.status)}</td>
                              <td className="p-4 text-muted-foreground">
                                {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, yyyy') : 'Never'}
                              </td>
                              <td className="p-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                      <Lock className="h-4 w-4 mr-2" />
                                      Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                      {user.status === 'active' ? (
                                        <>
                                          <EyeOff className="h-4 w-4 mr-2" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="h-4 w-4 mr-2" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteUser(user)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Users Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit User Sheet */}
      <Sheet 
        open={isAddUserOpen || isEditUserOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddUserOpen(false);
            setIsEditUserOpen(false);
          }
        }}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {isAddUserOpen ? 'Add New User' : 'Edit User'}
            </SheetTitle>
            <SheetDescription>
              {isAddUserOpen 
                ? 'Create a new user account' 
                : 'Update user information'}
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
                placeholder="Enter full name"
              />
            </div>
            
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
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="barber">Barber</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="general_admin">General Admin</SelectItem>
                  <SelectItem value="primary_admin">Primary Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={formData.branch}
                onValueChange={(value) => handleSelectChange('branch', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isAddUserOpen && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendInvite" 
                  checked={formData.sendInvite}
                  onCheckedChange={(checked) => handleCheckboxChange('sendInvite', checked as boolean)}
                />
                <Label htmlFor="sendInvite">Send invitation email</Label>
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button 
              onClick={handleSaveUser}
              disabled={!formData.name || !formData.email || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {isAddUserOpen ? 'Create User' : 'Update User'}
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedUser && (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
                <p><span className="font-medium">Branch:</span> {selectedUser.branch}</p>
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
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              This will send a password reset link to the user's email address.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedUser && (
              <div className="bg-muted/30 p-4 rounded-md">
                <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResetPasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmResetPassword}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
