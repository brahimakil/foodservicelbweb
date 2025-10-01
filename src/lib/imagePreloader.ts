


// Global preloader to aggressively load all product images
class ImagePreloader {
    private loadedImages = new Set<string>();
    private loadingImages = new Map<string, Promise<void>>();
    private queue: string[] = [];
    private isProcessing = false;
    private readonly MAX_CONCURRENT = 6; // Load 6 images at once
    private currentLoading = 0;
  
    /**
     * Preload a single image
     */
    private loadImage(url: string): Promise<void> {
      // If already loaded or loading, return existing promise
      if (this.loadedImages.has(url)) {
        return Promise.resolve();
      }
      
      if (this.loadingImages.has(url)) {
        return this.loadingImages.get(url)!;
      }
  
      const promise = new Promise<void>((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          this.loadedImages.add(url);
          this.loadingImages.delete(url);
          this.currentLoading--;
          console.log(`✅ Preloaded: ${url.substring(0, 80)}...`);
          resolve();
          this.processQueue(); // Load next image
        };
        
        img.onerror = () => {
          console.error(`❌ Failed to preload: ${url.substring(0, 80)}...`);
          this.loadingImages.delete(url);
          this.currentLoading--;
          reject();
          this.processQueue(); // Load next image even on error
        };
        
        img.src = url;
      });
  
      this.loadingImages.set(url, promise);
      return promise;
    }
  
    /**
     * Process the queue with concurrency limit
     */
    private processQueue() {
      while (this.currentLoading < this.MAX_CONCURRENT && this.queue.length > 0) {
        const url = this.queue.shift();
        if (url && !this.loadedImages.has(url)) {
          this.currentLoading++;
          this.loadImage(url).catch(() => {
            // Ignore errors, just keep loading
          });
        }
      }
  
      // If queue is empty and nothing is loading, we're done
      if (this.queue.length === 0 && this.currentLoading === 0) {
        this.isProcessing = false;
        console.log(`🎉 All images preloaded! Total: ${this.loadedImages.size}`);
      }
    }
  
    /**
     * Add images to the preload queue
     */
    public preloadImages(urls: string[]) {
      const newUrls = urls.filter(url => 
        url && !this.loadedImages.has(url) && !this.queue.includes(url)
      );
  
      if (newUrls.length === 0) return;
  
      console.log(`📥 Adding ${newUrls.length} images to preload queue`);
      this.queue.push(...newUrls);
  
      if (!this.isProcessing) {
        this.isProcessing = true;
        this.processQueue();
      }
    }
  
    /**
     * Check if an image is loaded
     */
    public isLoaded(url: string): boolean {
      return this.loadedImages.has(url);
    }
  
    /**
     * Get preload stats
     */
    public getStats() {
      return {
        loaded: this.loadedImages.size,
        loading: this.currentLoading,
        queued: this.queue.length,
        total: this.loadedImages.size + this.currentLoading + this.queue.length
      };
    }
  }
  
  // Export singleton instance
  export const imagePreloader = new ImagePreloader();