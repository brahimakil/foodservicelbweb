import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts, useCategories, useActivePDFCatalog } from "@/hooks/useData";
import { PDFCatalog } from "@/types";

const Catalog = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: selectedCatalog, isLoading } = useActivePDFCatalog();
  
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!selectedCatalog) return;
    
    setIsDownloading(true);
    try {
      // Import the PDF generator dynamically for better performance
      const { generatePDF } = await import("@/services/pdfGenerator");
      await generatePDF(selectedCatalog, products, categories);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getSelectedProducts = () => {
    if (!selectedCatalog?.categories) return [];
    
    const selectedProducts: { category: any; products: any[] }[] = [];
    
    selectedCatalog.categories.forEach((catOrder: any) => {
      const category = categories.find(c => c.id === catOrder.categoryId);
      if (!category) return;
      
      const categoryProducts = catOrder.products
        ?.filter((p: any) => p.included)
        .map((prodOrder: any) => products.find(p => p.id === prodOrder.productId))
        .filter(Boolean) || [];
      
      if (categoryProducts.length > 0) {
        selectedProducts.push({ category, products: categoryProducts });
      }
    });
    
    return selectedProducts;
  };

  const selectedData = getSelectedProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Loading Catalog...</h1>
          <p className="text-muted-foreground">Please wait while we prepare your catalog.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedCatalog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">No Catalog Available</h1>
          <p className="text-muted-foreground mb-6">
            Our product catalog is currently being updated. Please check back soon.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {selectedCatalog.name}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>Version {selectedCatalog.version}</span>
              <span>•</span>
              <span>{selectedData.length} categories</span>
              <span>•</span>
              <span>
                {selectedData.reduce((total, cat) => total + cat.products.length, 0)} products
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="bg-primary hover:bg-primary/90"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>
          </div>
        </div>

        {/* Catalog Preview */}
        <div className="space-y-8">
          {selectedData.length > 0 ? (
            <>
              {/* Cover Section */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-12 text-center">
                    {selectedCatalog.coverPage ? (
                      <div className="mb-6">
                        <img 
                          src={selectedCatalog.coverPage} 
                          alt="Catalog Cover" 
                          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                          style={{ maxHeight: '300px', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className="mb-6">
                        <FileText className="h-24 w-24 text-primary mx-auto mb-4" />
                      </div>
                    )}
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                      {selectedCatalog.name}
                    </h2>
                    <p className="text-xl text-muted-foreground mb-2">
                      Version {selectedCatalog.version}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      Generated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Categories and Products */}
              {selectedData.map((categoryData, catIndex) => (
                <Card key={categoryData.category.id} className="overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    {/* Category Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        {catIndex + 1}. {categoryData.category.name}
                      </h3>
                      {categoryData.category.description && (
                        <p className="text-muted-foreground mb-4 text-lg">
                          {categoryData.category.description}
                        </p>
                      )}
                      <div className="w-full h-px bg-border"></div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid gap-6 md:gap-8">
                      {categoryData.products.map((product: any, prodIndex: number) => (
                        <div key={product.id} className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 border border-border rounded-lg hover:shadow-md transition-shadow">
                          {/* Product Image */}
                          <div className="flex-shrink-0 mx-auto md:mx-0">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-24 h-24 md:w-32 md:h-32 bg-muted border border-border rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow text-center md:text-left">
                            <h4 className="font-bold text-xl md:text-2xl text-foreground mb-3">
                              {catIndex + 1}.{prodIndex + 1} {product.title}
                            </h4>
                            {product.description && (
                              <p className="text-muted-foreground mb-4 leading-relaxed">
                                {product.description}
                              </p>
                            )}
                            <div className="flex flex-col md:flex-row items-center md:justify-between gap-3">
                            
                              {product.isBestSeller && (
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                  ⭐ BEST SELLER
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* About Us Section */}
              {selectedCatalog.backPage && (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-muted/50 to-muted/20 p-8 md:p-12 text-center">
                      <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                        About Us
                      </h3>
                      <img 
                        src={selectedCatalog.backPage} 
                        alt="About Us" 
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Catalog Coming Soon
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We're currently updating our product catalog. Please check back soon for our latest offerings.
                </p>
                <Link to="/products">
                  <Button variant="outline">
                    View Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Catalog;
