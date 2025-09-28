import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Loader2, 
  CheckCircle,
  MessageSquare,
  Send,
  X,
  Paperclip,
  Minimize2,
  Maximize2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProducts, useCategories, useBrands } from "@/hooks/useData";
import { useSettings } from "@/hooks/useSettings";

interface AIResponse {
  type: 'product' | 'category' | 'brand' | 'unknown' | 'general';
  found: boolean;
  matchedItem?: any;
  confidence?: number;
  reasoning?: string;
  response?: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [textQuery, setTextQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);

  // Get data for AI context
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  
  // Get settings from database
  const { data: settings } = useSettings();

  // Check if AI is enabled and API key is available
  const isAIAvailable = settings?.aiEnabled && settings?.geminiApiKey;

  // Get API key from admin panel (stored in localStorage by admin)
  useEffect(() => {
    // This useEffect is no longer needed as API key is managed by admin
    // const adminApiKey = localStorage.getItem('gemini-api-key') || '';
    // setGeminiApiKey(adminApiKey);
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const analyzeWithAI = async () => {
    if (!settings?.geminiApiKey) {
      toast({
        title: "AI Assistant Unavailable",
        description: "AI features are currently not configured by the administrator",
        variant: "destructive",
      });
      return;
    }

    if (!textQuery && !selectedImage) {
      toast({
        title: "Input Required",
        description: "Please enter a question or upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Create intelligent context with conceptual matching (EXACT SAME AS ADMIN)
      const systemContext = `
You are an intelligent AI assistant for a food service system. You understand products conceptually and can suggest alternatives when exact matches aren't available.

COMPLETE SYSTEM INVENTORY:

PRODUCTS (with full details):
${products.map(p => {
  const category = categories.find(c => c.id === p.category);
  return `• "${p.title}" 
  - Description: ${p.description || 'No description available'}
  - Category: ${category?.name || 'Uncategorized'}
  - Price: ${p.price ? '$' + p.price : 'Price not listed'}
  - Best Seller: ${p.isBestSeller ? 'Yes' : 'No'}`;
}).join('\n')}

CATEGORIES:
${categories.map(c => `• "${c.name}" - ${c.description || 'No description available'}`).join('\n')}

BRANDS:
${brands.map(b => `• "${b.name}" - ${b.description || 'No description available'}`).join('\n')}

ADVANCED MATCHING INSTRUCTIONS:
1. **EXACT MATCHING FIRST**: Look for exact or close spelling matches
2. **CONCEPTUAL UNDERSTANDING**: If no exact match, understand WHAT the user is asking for:
   - "cocola/coca cola" = carbonated soft drink → find sodas, colas, soft drinks
   - "pizza" = Italian flatbread with toppings → find pizza products or Italian food
   - "burger" = sandwich with meat patty → find burgers, sandwiches, meat products
   - "coffee" = hot beverage → find coffee, hot drinks, beverages
   - "chocolate" = sweet confection → find chocolate products, desserts, sweets
   - "bread" = baked grain product → find bread, bakery items, carbs
   - "milk" = dairy beverage → find milk, dairy products, beverages
   - "chips" = crispy snack → find chips, snacks, crisps
   - "juice" = fruit beverage → find juices, fruit drinks, beverages

3. **CATEGORY-BASED SEARCH**: Understand product categories and types:
   - Beverages: sodas, juices, water, coffee, tea, energy drinks
   - Snacks: chips, crackers, nuts, candy, cookies
   - Dairy: milk, cheese, yogurt, butter
   - Meat: chicken, beef, pork, fish, deli meats
   - Bakery: bread, pastries, cakes, muffins
   - Frozen: ice cream, frozen meals, frozen vegetables
   - Condiments: sauces, dressings, spices

4. **INTELLIGENT SUGGESTIONS**: When exact product not found:
   - Explain what the requested item is
   - Find similar products in our inventory
   - Suggest alternatives that serve the same purpose
   - Be specific about what we DO have

5. **RESPONSE STRATEGY**:
   - If exact match found: "found": true, list the products
   - If no exact match but similar products exist: "found": true, explain the alternatives
   - If no related products: "found": false, but explain what we searched for

${textQuery ? `User Question: ${textQuery}` : ''}
${selectedImage ? 'User has also provided an image for analysis.' : ''}

EXAMPLES OF SMART RESPONSES:

Example 1 - User asks for "cocola":
- First check: Do we have Coca-Cola? If yes, return it
- If no: "Cocola refers to Coca-Cola, which is a carbonated soft drink. While we don't have Coca-Cola specifically, we do have these similar carbonated beverages: [list sodas/soft drinks from inventory]"

Example 2 - User asks for "pizza":
- First check: Do we have pizza products? If yes, return them
- If no: "Pizza is an Italian dish with dough, sauce, and toppings. We don't have pizza specifically, but we have these Italian/similar products: [list pasta, Italian foods, or bread products]"

Example 3 - User asks for "energy drink":
- Search for energy drinks, if none found: "Energy drinks are caffeinated beverages for energy. We don't have energy drinks, but we have these energizing beverages: [list coffee, sodas with caffeine, etc.]"

Respond in JSON format:
{
  "type": "product|category|brand|general",
  "found": true/false,
  "matchedItem": "exact matches or conceptual alternatives",
  "confidence": 0-100,
  "reasoning": "explain your search process and conceptual matching",
  "response": "helpful response explaining what you found or suggesting alternatives"
}
`;

      const parts: any[] = [{ text: systemContext }];

      // Add image if provided
      if (selectedImage) {
        const base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(selectedImage);
        });

        parts.push({
          inline_data: {
            mime_type: selectedImage.type,
            data: base64Image
          }
        });
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': settings.geminiApiKey, // Use API key from database
        },
        body: JSON.stringify({
          contents: [{
            parts: parts
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Request failed'}`);
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiText) {
        throw new Error('No response from AI');
      }

      try {
        const cleanedText = aiText.replace(/```json\s*|\s*```/g, '').trim();
        const parsedResponse = JSON.parse(cleanedText);
        setAiResponse(parsedResponse);
        
        toast({
          title: "Found Results!",
          description: `${parsedResponse.found ? 'Items found!' : 'Search completed'}`,
        });
      } catch (parseError) {
        setAiResponse({
          type: 'general',
          found: false,
          reasoning: 'AI provided unstructured response',
          response: aiText
        });
        
        toast({
          title: "Response Received",
          description: "AI provided a response",
        });
      }

    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetChat = () => {
    setTextQuery('');
    setSelectedImage(null);
    setImagePreview('');
    setAiResponse(null);
  };

  // Only show if AI is available
  if (!isAIAvailable) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
            size="lg"
          >
            <Brain className="h-6 w-6" />
          </Button>
          <div className="absolute -top-2 -left-2">
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              AI Assist
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[480px] max-w-[calc(100vw-2rem)]">
          <Card className="shadow-2xl border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5" />
                  AI Product Assistant
                  <Badge variant="outline" className="text-xs">Gemini 2.0</Badge>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => setIsMinimized(!isMinimized)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      resetChat();
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {/* Chat Input */}
                <div className="border rounded-lg p-4 bg-muted/20">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4 relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded" 
                        className="max-w-32 h-20 object-cover rounded border"
                      />
                      <Button
                        onClick={clearImage}
                        size="sm"
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Text Input - Make it bigger */}
                  <Textarea
                    placeholder={selectedImage 
                      ? "Ask about the uploaded image..." 
                      : "Ask about products... e.g., 'Do you have cocola?' or 'What beverages do you have?'"
                    }
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    rows={3}
                    className="border-0 bg-transparent resize-none focus-visible:ring-0 p-0 text-sm"
                  />
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <label htmlFor="ai-image-upload" className="cursor-pointer">
                        <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">
                            {selectedImage ? 'Change' : 'Add Image'}
                          </span>
                        </div>
                        <input
                          id="ai-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                      
                      {selectedImage && (
                        <Badge variant="outline" className="text-xs">
                          Image
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      onClick={analyzeWithAI} 
                      disabled={isAnalyzing || (!textQuery && !selectedImage)}
                      size="sm"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* AI Response - Make it bigger */}
                {aiResponse && (
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                      <div className="flex items-center gap-2 mb-3">
                        {aiResponse.found ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        )}
                        <span className="font-medium">
                          {aiResponse.found ? 'Found Products!' : 'AI Response'}
                        </span>
                        <Badge variant={aiResponse.found ? "default" : "secondary"} className="text-xs">
                          {aiResponse.type}
                        </Badge>
                      </div>

                      {aiResponse.response && (
                        <div className="bg-white/70 rounded-lg p-4 border text-sm leading-relaxed mb-3">
                          {aiResponse.response}
                        </div>
                      )}

                      {(aiResponse.matchedItem || aiResponse.confidence) && (
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          {aiResponse.matchedItem && (
                            <div>
                              <span className="font-medium text-muted-foreground">Found:</span>
                              <p className="font-medium mt-1">{aiResponse.matchedItem}</p>
                            </div>
                          )}
                          {aiResponse.confidence && (
                            <div>
                              <span className="font-medium text-muted-foreground">Confidence:</span>
                              <span className="font-medium"> {aiResponse.confidence}%</span>
                            </div>
                          )}
                        </div>
                      )}

                      {aiResponse.reasoning && (
                        <div className="text-sm mt-3 pt-3 border-t">
                          <span className="font-medium text-muted-foreground">Analysis:</span>
                          <p className="text-muted-foreground mt-1 leading-relaxed">
                            {aiResponse.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <Button onClick={resetChat} variant="outline" size="sm">
                    New Search
                  </Button>
                  <Button 
                    onClick={() => setTextQuery("What products do you have?")} 
                    variant="ghost" 
                    size="sm"
                  >
                    Browse All
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
