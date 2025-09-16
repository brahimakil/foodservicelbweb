interface MapEmbedProps {
  location: string;
  className?: string;
}

const MapEmbed = ({ location, className = "" }: MapEmbedProps) => {
  const getMapUrl = (location: string) => {
    switch (location) {
      case "main-office":
        // Sanihat Center, Tyre, Lebanon coordinates
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.7621234567!2d35.1951234567!3d33.2751234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151e7b2345678901%3A0x1234567890abcdef!2sSanihat%20Center%2C%20Tyre%2C%20Lebanon!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s";
      case "office-tyre":
        // Tyre office location
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.7621234567!2d35.1951234567!3d33.2751234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151e7b2345678901%3A0x1234567890abcdef!2sTyre%2C%20Lebanon!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s";
      case "warehouse-beirut":
        // Beirut warehouse location
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.2345678901!2d35.4951234567!3d33.8881234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17b2345678901%3A0x1234567890abcdef!2sBeirut%2C%20Lebanon!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s";
      case "warehouse-tyre":
        // Tyre warehouse location
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.7621234567!2d35.1951234567!3d33.2751234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151e7b2345678901%3A0x1234567890abcdef!2sTyre%20Warehouse%2C%20Lebanon!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s";
      default:
        // Generic Lebanon map
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423283.9362077401!2d35.50462415625!3d33.90413145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17028e17e7c7%3A0xa57bf759be0b7223!2sLebanon!5e0!3m2!1sen!2s!4v1640995123456!5m2!1sen!2s";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <iframe
        src={getMapUrl(location)}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '250px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-lg"
        title={`Map of ${location}`}
      />
    </div>
  );
};

export default MapEmbed;