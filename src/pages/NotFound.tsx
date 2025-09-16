import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
              <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Link to="/">
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Home Page
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Quick Links:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link to="/products">
                  <Button variant="ghost" size="sm">Products</Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" size="sm">About</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" size="sm">Contact</Button>
                </Link>
                <Link to="/catalog">
                  <Button variant="ghost" size="sm">Catalog</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
