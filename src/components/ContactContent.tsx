import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { useBannersByType, useCreateContactMessage } from "@/hooks/useData";
import MapEmbed from "./MapEmbed";

const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const { data: sidebarBanners = [], isLoading } = useBannersByType('sidebar', 'contact');
  const createContactMessage = useCreateContactMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    try {
      await createContactMessage.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        status: 'new',
      });
      
      // Reset form on success
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-12" />

            {/* Office Locations Skeleton */}
            <div className="space-y-8 lg:space-y-12 mb-12 lg:mb-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-6 w-32 mx-auto mb-4" />
                  <Skeleton className="h-48 lg:h-64 w-full rounded-lg" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-4">Food Service</h2>
          <p className="text-center text-muted-foreground mb-12">Contact Us</p>

          {/* Office Locations */}
          <div className="space-y-8 lg:space-y-12 mb-12 lg:mb-16">
            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-primary mb-4 lg:mb-6 text-center">Office Tyre</h3>
              <MapEmbed location="office-tyre" className="h-48 lg:h-64" />
            </div>

            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-primary mb-4 lg:mb-6 text-center">Warehouse Beirut</h3>
              <MapEmbed location="warehouse-beirut" className="h-48 lg:h-64" />
            </div>

            <div>
              <h3 className="text-lg lg:text-xl font-semibold text-primary mb-4 lg:mb-6 text-center">Warehouse Tyre</h3>
              <MapEmbed location="warehouse-tyre" className="h-48 lg:h-64" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                <Input 
                  placeholder="Your Name" 
                  className="h-10 lg:h-12"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Input 
                  placeholder="Enter Your Email" 
                  type="email" 
                  className="h-10 lg:h-12"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Textarea 
                  placeholder="Your Message" 
                  rows={6} 
                  className="resize-none"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 h-10 lg:h-12"
                  disabled={createContactMessage.isPending}
                >
                  {createContactMessage.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary mb-1 text-sm lg:text-base">Address</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Lebanon, Tyre, Jal El Baher, Sanihat Center
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary mb-1 text-sm lg:text-base">Mail Us</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground break-all">
                    info@foodserviceln.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary mb-1 text-sm lg:text-base">Mobile</h4>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    +961 81 404550 / +961 3393971
                  </p>
                </div>
              </div>

              {/* Dynamic content from banners */}
              {sidebarBanners.map((banner) => (
                <div key={banner.id} className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">{banner.title}</h4>
                  {banner.description && (
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {banner.description}
                    </p>
                  )}
                  {banner.link && (
                    <a 
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 text-sm font-medium inline-block mt-2"
                    >
                      Learn More →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactContent;