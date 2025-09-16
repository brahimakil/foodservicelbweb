import jsPDF from "jspdf";

const extractStoragePath = (downloadUrl: string): string | null => {
  try {
    const match = downloadUrl.match(/\/o\/(.+?)\?/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return null;
  } catch {
    return null;
  }
};

const loadFirebaseUrlToBase64 = async (downloadUrl: string): Promise<string | null> => {
  try {
    const storagePath = extractStoragePath(downloadUrl);
    if (!storagePath) {
      console.error('Could not extract storage path from:', downloadUrl);
      return null;
    }
    
    // Use the same Cloud Function as admin panel
    const functionUrl = `https://getimagebase64-5ocax2fewa-uc.a.run.app?path=${encodeURIComponent(storagePath)}`;
    
    const response = await fetch(functionUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.base64;
    
  } catch (error) {
    console.error('Failed to load image:', error);
    return null;
  }
};

const addImageToPDF = async (pdf: jsPDF, url: string, x: number, y: number, w: number, h: number) => {
  const base64 = await loadFirebaseUrlToBase64(url);
  if (!base64) return false;
  const format = base64.includes("data:image/png") ? "PNG" : "JPEG";
  pdf.addImage(base64, format, x, y, w, h);
  return true;
};

export const generatePDF = async (
  catalog: any, 
  products: any[], 
  categories: any[]
): Promise<void> => {
  const pdf = new jsPDF();
  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.height;
  const pageWidth = pdf.internal.pageSize.width;

  const drawPlaceholder = (x: number, y: number, width: number, height: number, text: string) => {
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(248, 248, 248);
    pdf.rect(x, y, width, height, 'FD');
    
    pdf.setDrawColor(220, 220, 220);
    pdf.line(x, y, x + width, y + height);
    pdf.line(x + width, y, x, y + height);
    
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(text, x + width/2, y + height/2, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
  };

  const checkNewPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  };

  try {
    console.log('🚀 Starting PDF generation...');
    
    // Cover Page
    if (catalog.coverPage) {
      const coverAdded = await addImageToPDF(pdf, catalog.coverPage, 0, 0, pageWidth, pageHeight);
      
      if (!coverAdded) {
        pdf.setFontSize(24);
        pdf.setFont(undefined, 'bold');
        pdf.text(catalog.name, pageWidth / 2, 50, { align: 'center' });
        
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Version: ${catalog.version}`, pageWidth / 2, 70, { align: 'center' });
        
        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 90, { align: 'center' });
        
        drawPlaceholder(20, 110, pageWidth - 40, 100, 'Cover Image Not Available');
      }
    } else {
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.text(catalog.name, pageWidth / 2, 50, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Version: ${catalog.version}`, pageWidth / 2, 70, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 90, { align: 'center' });
    }
    
    pdf.addPage();
    yPosition = 20;

    // About Us Page
    if (catalog.backPage) {
      const aboutAdded = await addImageToPDF(pdf, catalog.backPage, 0, 0, pageWidth, pageHeight);
      
      if (!aboutAdded) {
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.text('About Us', 20, yPosition);
        yPosition += 20;
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text('Welcome to our product catalog.', 20, yPosition);
        yPosition += 10;
        pdf.text('We provide quality products and excellent service.', 20, yPosition);
        yPosition += 20;
        
        drawPlaceholder(20, yPosition, pageWidth - 40, 100, 'About Us Image Not Available');
      }
    }
    
    pdf.addPage();
    yPosition = 20;

    // Products Section
    const sortedCategories = catalog.categories?.sort((a: any, b: any) => a.order - b.order) || [];
    let categoryNumber = 1;

    for (const categoryOrder of sortedCategories) {
      const category = categories.find(c => c.id === categoryOrder.categoryId);
      if (!category) continue;

      if (categoryOrder.newPageStart && yPosition > 20) {
        pdf.addPage();
        yPosition = 20;
      }

      checkNewPage(40);

      // Category Header
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${categoryNumber}. ${category.name}`, 20, yPosition);
      yPosition += 15;

      if (category.description) {
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        const desc = category.description.length > 100 ? category.description.substring(0, 100) + '...' : category.description;
        pdf.text(desc, 20, yPosition);
        yPosition += 15;
      }

      // Products
      const categoryProducts = categoryOrder.products?.filter((p: any) => p.included).sort((a: any, b: any) => a.order - b.order) || [];
      let productNumber = 1;

      for (const productOrder of categoryProducts) {
        const product = products.find(p => p.id === productOrder.productId);
        if (!product) continue;

        checkNewPage(50);

        // Product title
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${categoryNumber}.${productNumber} ${product.title}`, 20, yPosition);
        yPosition += 10;

        // Product image
        const imageSize = 30;
        if (product.image) {
          const imageAdded = await addImageToPDF(pdf, product.image, 20, yPosition, imageSize, imageSize);
          if (!imageAdded) {
            drawPlaceholder(20, yPosition, imageSize, imageSize, 'Image Failed');
          }
        } else {
          drawPlaceholder(20, yPosition, imageSize, imageSize, 'No Image');
        }

        // Product details
        const textX = 20 + imageSize + 10;
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        
        if (product.description) {
          const lines = pdf.splitTextToSize(product.description, pageWidth - textX - 20);
          pdf.text(lines.slice(0, 2), textX, yPosition + 5);
        }

        if (product.price) {
          pdf.setFont(undefined, 'bold');
          pdf.text(`$${product.price}`, textX, yPosition + 20);
        }

        // Best seller badge
        if (product.isBestSeller) {
          pdf.setFillColor(255, 215, 0);
          pdf.rect(pageWidth - 50, yPosition, 30, 8, 'F');
          pdf.setFontSize(7);
          pdf.setTextColor(0, 0, 0);
          pdf.text('BEST SELLER', pageWidth - 47, yPosition + 5);
          pdf.setTextColor(0, 0, 0);
        }

        yPosition += Math.max(imageSize + 10, 35);
        productNumber++;
      }

      yPosition += 15;
      categoryNumber++;
    }

    // Add page numbers
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 10, { align: 'right' });
    }

    // Save PDF
    const fileName = `${catalog.name.replace(/[^a-zA-Z0-9]/g, '_')}_v${catalog.version}.pdf`;
    pdf.save(fileName);
    
    console.log('✅ PDF generated successfully!');

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
};
