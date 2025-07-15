// Image URLs for the driving school website
export const images = {
    // Hero section images
    hero: {
      home: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80',
      appointments: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80',
    },
    
    // Feature section images
    features: {
      modernFleet: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80",
      expertInstructors: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
      flexibleScheduling: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&auto=format&fit=crop&q=80",
      safetyFirst: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80"
    },
    
    // Instructor profile images
    instructors: {
      default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80',
      female: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    },
    
    // CTA section images
    cta: {
      booking: 'https://images.unsplash.com/photo-1486818091845-c6d0f4b0e34d?auto=format&fit=crop&q=80',
      contact: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1200&auto=format&fit=crop&q=80"
    },
    
    // Logo and icons
    branding: {
      logo: "https://img.icons8.com/color/96/000000/steering-wheel--v1.png",
      favicon: "https://img.icons8.com/color/32/000000/steering-wheel--v1.png"
    }
  };
  
  // Image loading utility
  export const preloadImages = () => {
    Object.values(images).forEach(category => {
      Object.values(category).forEach(url => {
        const img = new Image();
        img.src = url;
      });
    });
  };