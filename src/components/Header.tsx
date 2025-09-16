import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full">
      {/* Top bar - Hidden on mobile */}
      <div className="bg-primary text-primary-foreground py-2 px-4 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Lebanon, Tyre, Jal El Baher, Sanihat Center</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>info@foodserviceln.com</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>Privacy Policy / Terms of Use / Sales and Refunds</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-background shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/logo_new.png" 
                alt="Food Service Company" 
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/products") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/about") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/contact") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Contact Us
              </Link>
              <Link to="/catalog">
                <Button variant="default" className="bg-primary hover:bg-primary/90 text-xs lg:text-sm">
                  CATALOGUE
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background py-4">
            <div className="flex flex-col space-y-4 px-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/products") ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/about") ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/contact") ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link to="/catalog">
                <Button 
                  variant="default" 
                  className="bg-primary hover:bg-primary/90 w-fit"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  CATALOGUE
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;