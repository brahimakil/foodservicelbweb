import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBannersByType } from "@/hooks/useData";
import MapEmbed from "./MapEmbed";

const Footer = () => {
  const { data: footerBanners = [], isLoading } = useBannersByType('footer', 'all');

  if (isLoading) {
    return (
      <footer className="bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="md:col-span-2 lg:col-span-2">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-24 lg:h-32 w-full mb-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div>
              <Skeleton className="h-6 w-20 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-24" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-20 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-32" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Dynamic Footer Banners */}
        {footerBanners.length > 0 && footerBanners[0].images && footerBanners[0].images.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {footerBanners[0].images.slice(0, 3).map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={image} 
                  alt={`${footerBanners[0].title} ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Logo and Map */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">FS</span>
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-bold text-accent-foreground">FOOD SERVICE</h3>
                <p className="text-xs text-accent-foreground/80">COMPANY</p>
              </div>
            </div>
            
            {/* Map placeholder */}
            <div className="mb-4">
              <MapEmbed location="main-office" className="h-24 lg:h-32" />
            </div>
            
            <p className="text-xs text-accent-foreground/80">
              © Voleti Pro. All rights reserved.
            </p>
          </div>

          {/* Summary Links */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Summary</h4>
            <ul className="space-y-2 text-xs lg:text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-3 lg:mb-4 text-sm lg:text-base">Contact</h4>
            <div className="space-y-2 text-xs lg:text-sm">
              <p>
                Address: Lebanon, Tyre, Jal El Baher,<br />
                Sanihat Center
              </p>
              <p className="break-all">Email: info@foodserviceln.com</p>
              <p>Phone: +961 81 404550 / +961 3393971</p>
            </div>
          </div>
        </div>

        {/* Social Media and Bottom Bar */}
        <div className="border-t border-accent-foreground/20 mt-6 lg:mt-8 pt-4 lg:pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <Facebook className="h-4 w-4 lg:h-5 lg:w-5 hover:text-primary cursor-pointer transition-colors" />
            <Twitter className="h-4 w-4 lg:h-5 lg:w-5 hover:text-primary cursor-pointer transition-colors" />
            <Instagram className="h-4 w-4 lg:h-5 lg:w-5 hover:text-primary cursor-pointer transition-colors" />
            <Linkedin className="h-4 w-4 lg:h-5 lg:w-5 hover:text-primary cursor-pointer transition-colors" />
          </div>
          <p className="text-xs text-accent-foreground/60">
            Designed by Voleti Pro
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;