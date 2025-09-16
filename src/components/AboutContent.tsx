import { MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBannersByType } from "@/hooks/useData";
import MapEmbed from "./MapEmbed";

const AboutContent = () => {
  const { data: sidebarBanners = [], isLoading } = useBannersByType('sidebar', 'about');
  
  // Use sidebar banners for additional content sections
  const aboutBanner = sidebarBanners.find(banner => banner.title.toLowerCase().includes('about'));

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-48 mx-auto mb-12" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
              <Skeleton className="h-64 lg:h-80 rounded-lg" />
              <div className="space-y-4 lg:space-y-6">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Food Service</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
            {/* Map or Banner Image */}
            <div className="order-2 lg:order-1">
              {aboutBanner?.image ? (
                <div className="h-64 lg:h-80 rounded-lg overflow-hidden">
                  <img 
                    src={aboutBanner.image} 
                    alt={aboutBanner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <MapEmbed location="main-office" className="h-64 lg:h-80" />
              )}
            </div>
            
            {/* About Content */}
            <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
              <div className="bg-muted rounded-lg p-1">
                <h3 className="text-lg lg:text-xl font-semibold text-primary p-3 lg:p-4 bg-background rounded-lg">
                  {aboutBanner?.title || "About Us"}
                </h3>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                {aboutBanner?.description || 
                  `Located in Lebanon, Tyre, and driven by pioneering spirit, Food Service is a leading 
                  company in many sectors including: food and Stuff. Our industry-recognized 
                  certifications and partnerships, guided by client innovation is the key to our 
                  success and growth. Our purpose is to ensure excellence in the creation, production 
                  and the timely delivery of goods and services.`
                }
              </p>

              {aboutBanner?.link && (
                <div className="mt-4">
                  <a 
                    href={aboutBanner.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Learn More →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                  <h4 className="font-semibold text-primary text-sm lg:text-base">Address</h4>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Lebanon, Tyre, Jal El Baher, Sanihat Center
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                  <h4 className="font-semibold text-primary text-sm lg:text-base">Mail Us</h4>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground break-all">
                  info@foodserviceln.com
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-primary flex-shrink-0" />
                  <h4 className="font-semibold text-primary text-sm lg:text-base">Mobile</h4>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  +961 81 404550 / +961 3393971
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
