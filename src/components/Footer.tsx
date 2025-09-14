import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Scissors 
} from "lucide-react";
import quboLogo from "@/assets/QUBO logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Barbers", href: "/barbers" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Classic Haircuts", href: "/services/haircuts" },
    { name: "Premium Styling", href: "/services/styling" },
    { name: "Beard Grooming", href: "/services/beard" },
    { name: "Hair Treatments", href: "/services/treatments" },
  ];

  const locations = [
    {
      name: "Makati Branch",
      address: "123 Ayala Ave, Makati City",
      phone: "+63 917 123 4567",
    },
    {
      name: "BGC Branch", 
      address: "456 McKinley Hill, Taguig City",
      phone: "+63 917 234 5678",
    },
    {
      name: "Ortigas Branch",
      address: "789 EDSA, Pasig City", 
      phone: "+63 917 345 6789",
    },
  ];

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-primary shadow-glow">
                <img 
                  src={quboLogo} 
                  alt="QuboMNL Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                Qubo<span className="text-accent">MNL</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Where style meets sophistication. Experience premium grooming services 
              with our expert barbers in the heart of Manila.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-6">Contact Info</h3>
            <div className="space-y-4">
              {/* Business Hours */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">Mon - Sat:</span> 9:00 AM - 8:00 PM
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">Sunday:</span> 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a 
                  href="mailto:info@qubomnl.com"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  info@qubomnl.com
                </a>
              </div>

              {/* Main Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a 
                  href="tel:+639171234567"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  +63 917 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className="py-8 border-t border-border">
          <h3 className="font-heading font-semibold text-foreground mb-6 text-center">Our Locations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <div 
                key={location.name} 
                className="text-center p-4 rounded-lg bg-card border border-border hover:border-accent transition-colors"
              >
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-accent mr-2" />
                  <h4 className="font-medium text-foreground">{location.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{location.address}</p>
                <a 
                  href={`tel:${location.phone.replace(/\s/g, '')}`}
                  className="text-sm text-accent hover:underline"
                >
                  {location.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} QuboMNL. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center">
                <Scissors className="w-4 h-4 mr-1 text-accent" />
                <span>Made with ♥ for style</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;