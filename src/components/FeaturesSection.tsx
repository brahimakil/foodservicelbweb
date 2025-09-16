import { Users, ShoppingCart, Award, Headphones } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Clients",
      description: "Serving businesses with excellence",
      bgColor: "bg-orange-100",
      iconColor: "text-secondary"
    },
    {
      icon: ShoppingCart,
      title: "Products",
      description: "Wide range of quality food products",
      bgColor: "bg-orange-100", 
      iconColor: "text-secondary"
    },
    {
      icon: Award,
      title: "Years Of Experience",
      description: "Trusted expertise in food service",
      bgColor: "bg-orange-100",
      iconColor: "text-secondary"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always available for your needs",
      bgColor: "bg-orange-100",
      iconColor: "text-secondary"
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform">
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full ${feature.bgColor} flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:shadow-lg transition-shadow`}>
                <feature.icon className={`h-6 w-6 lg:h-8 lg:w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground px-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;