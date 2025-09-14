import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Scissors, 
  Home,
  Bell,
  FileText,
  Image,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import quboLogo from '@/assets/QUBO logo.jpg';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof Home;
  roles: UserRole[];
  badge?: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Navigation items with role-based access
  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home, 
      roles: ['barber', 'cashier', 'general_admin', 'primary_admin'] 
    },
    { 
      name: 'Schedule', 
      href: '/dashboard/schedule', 
      icon: Calendar, 
      roles: ['barber', 'general_admin', 'primary_admin'] 
    },
    { 
      name: 'Portfolio', 
      href: '/dashboard/portfolio', 
      icon: Image, 
      roles: ['barber'] 
    },
    { 
      name: 'Requests', 
      href: '/dashboard/requests', 
      icon: Clock, 
      roles: ['barber'],
      badge: '2'
    },
    { 
      name: 'Payments', 
      href: '/dashboard/payments', 
      icon: CreditCard, 
      roles: ['cashier', 'general_admin', 'primary_admin'] 
    },
    { 
      name: 'Reports', 
      href: '/dashboard/reports', 
      icon: BarChart3, 
      roles: ['cashier', 'general_admin', 'primary_admin'] 
    },
    { 
      name: 'Manage Barbers', 
      href: '/dashboard/manage-barbers', 
      icon: Scissors, 
      roles: ['general_admin', 'primary_admin'] 
    },
    { 
      name: 'Announcements', 
      href: '/dashboard/announcements', 
      icon: MessageSquare, 
      roles: ['general_admin', 'primary_admin'] 
    },
    { 
      name: 'Review Requests', 
      href: '/dashboard/review-requests', 
      icon: FileText, 
      roles: ['general_admin', 'primary_admin'],
      badge: '5'
    },
    { 
      name: 'User Management', 
      href: '/dashboard/users', 
      icon: Users, 
      roles: ['primary_admin'] 
    },
    { 
      name: 'System Settings', 
      href: '/dashboard/settings', 
      icon: Settings, 
      roles: ['primary_admin'] 
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-card border-r border-border">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-primary shadow-glow">
                <img 
                  src={quboLogo} 
                  alt="QuboMNL Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-heading font-bold text-lg text-foreground">
                Qubo<span className="text-accent">MNL</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-3 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive(item.href) 
                      ? 'bg-accent/10 text-accent' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                    transition-colors
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile */}
          <div className="flex-shrink-0 p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full text-left">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate capitalize">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div 
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform transform
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Mobile Sidebar Content */}
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-border">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-primary shadow-glow">
                  <img 
                    src={quboLogo} 
                    alt="QuboMNL Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-heading font-bold text-lg text-foreground">
                  Qubo<span className="text-accent">MNL</span>
                </span>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto pt-5 pb-4">
              <nav className="flex-1 px-3 space-y-1">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm font-medium
                      ${isActive(item.href) 
                        ? 'bg-accent/10 text-accent' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                      transition-colors
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Profile */}
            <div className="flex-shrink-0 p-4 border-t border-border">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <Separator className="my-1" />
                <button
                  className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="h-16 px-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Page Title - Mobile */}
            <div className="md:hidden font-heading font-medium">
              {filteredNavItems.find(item => isActive(item.href))?.name || 'Dashboard'}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {/* Notification items would go here */}
                    <div className="p-3 hover:bg-muted rounded-md transition-colors">
                      <p className="text-sm font-medium">New appointment booked</p>
                      <p className="text-xs text-muted-foreground">John Doe booked a haircut at 3:30 PM</p>
                      <p className="text-xs text-accent mt-1">10 minutes ago</p>
                    </div>
                    <div className="p-3 hover:bg-muted rounded-md transition-colors">
                      <p className="text-sm font-medium">PTO Request Approved</p>
                      <p className="text-xs text-muted-foreground">Your time off request for June 15 was approved</p>
                      <p className="text-xs text-accent mt-1">1 hour ago</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2 text-center">
                    <Link to="/notifications" className="text-xs text-accent hover:underline">
                      View all notifications
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu - Mobile Only */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 md:hidden">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
