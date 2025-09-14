import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scissors, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Form schema with validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.rememberMe);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to QuboMNL!',
      });

      // Redirect based on user role
      const userJson = localStorage.getItem('qubo_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        
        switch (user.role) {
          case 'barber':
            navigate('/dashboard/barber');
            break;
          case 'cashier':
            navigate('/dashboard/cashier');
            break;
          case 'general_admin':
            navigate('/dashboard/admin');
            break;
          case 'primary_admin':
            navigate('/dashboard/primary-admin');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      // Error is handled by the auth context
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-glow">
            <Scissors className="w-8 h-8 text-accent-foreground" />
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-heading font-bold text-foreground">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Welcome back to QuboMNL
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-elegant sm:rounded-lg sm:px-10 border border-border">
          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email field */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={errors.email ? 'border-destructive' : ''}
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium">
                  Password
                </Label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={errors.password ? 'border-destructive' : ''}
                  disabled={isLoading}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  disabled={isLoading}
                  {...register('rememberMe')}
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Demo Credentials</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Primary Admin: admin@qubomanl.com / password123</p>
              <p>General Admin: manager@qubomanl.com / password123</p>
              <p>Barber: barber1@qubomanl.com / password123</p>
              <p>Cashier: cashier@qubomanl.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
