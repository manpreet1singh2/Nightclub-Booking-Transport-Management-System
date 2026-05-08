// Shared mock data for Vercel serverless demo

const CLUBS = [
  {
    id: "club-001",
    name: "Zodiac The Club",
    description: "Delhi's most iconic nightclub. Premium sound, celebrity DJs, and an unmatched vibe every weekend. Experience luxury nightlife like never before.",
    address: "Level 3, DLF Cyber Hub, Sector 24",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    phone: "9876543210",
    email: "info@zodiacclub.in",
    ownerWhatsapp: "9876543210",
    capacity: 350,
    openTime: "21:00:00",
    closeTime: "04:00:00",
    rating: 4.8,
    totalReviews: 1247,
    isActive: true,
    amenities: ["Live DJ", "Premium Bar", "Dance Floor", "VIP Lounge", "Valet Parking", "Hookah Lounge"],
    images: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80",
      "https://images.unsplash.com/photo-1571204829887-3b8d69e4094d?w=800&q=80"
    ],
    packages: [
      { id: "pkg-001-a", clubId: "club-001", name: "Entry Only", description: "Basic club entry", type: "entry_only", pricePerPerson: 800, priceCouple: 1400, priceGroup: 700, includesTransport: false, includesDrinks: false, features: ["Club Entry", "Dance Floor Access", "Coat Check"], isActive: true },
      { id: "pkg-001-b", clubId: "club-001", name: "Entry + Drinks", description: "Entry with 2 premium drinks", type: "entry_drinks", pricePerPerson: 1500, priceCouple: 2600, priceGroup: 1300, includesTransport: false, includesDrinks: true, drinksAllowance: 2, features: ["Club Entry", "2 Premium Drinks", "Priority Queue", "Dance Floor"], isActive: true },
      { id: "pkg-001-c", clubId: "club-001", name: "Entry + Cab", description: "Entry with safe cab service", type: "entry_cab", pricePerPerson: 1800, priceCouple: 3200, priceGroup: 1600, includesTransport: true, includesDrinks: false, features: ["Club Entry", "Cab Pickup & Drop", "Safe Night Ride", "Dance Floor"], isActive: true },
      { id: "pkg-001-d", clubId: "club-001", name: "⭐ Full Combo", description: "Everything included — drinks + transport", type: "full_combo", pricePerPerson: 2500, priceCouple: 4500, priceGroup: 2200, includesTransport: true, includesDrinks: true, drinksAllowance: 3, features: ["Club Entry", "3 Premium Drinks", "Cab Pickup & Drop", "VIP Queue", "Priority Table", "Coat Check"], isActive: true }
    ]
  },
  {
    id: "club-002",
    name: "Privee — The Social",
    description: "Mumbai's most exclusive members-only luxury club. International DJs, world-class bottle service, and an atmosphere that defines premium nightlife.",
    address: "Hotel Shangri-La, 19 Ashoka Road, Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    phone: "9811223344",
    email: "reservations@privee.in",
    ownerWhatsapp: "9811223344",
    capacity: 220,
    openTime: "22:00:00",
    closeTime: "05:00:00",
    rating: 4.9,
    totalReviews: 892,
    isActive: true,
    amenities: ["Celebrity DJs", "Premium Bar", "VIP Tables", "Rooftop Deck", "Skyline View", "Private Cabins"],
    images: [
      "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80",
      "https://images.unsplash.com/photo-1598387993441-a364f854cfb?w=800&q=80"
    ],
    packages: [
      { id: "pkg-002-a", clubId: "club-002", name: "Entry Only", description: "Basic entry to Privee", type: "entry_only", pricePerPerson: 1200, priceCouple: 2000, priceGroup: 1000, includesTransport: false, includesDrinks: false, features: ["Club Entry", "Rooftop Access", "Coat Check"], isActive: true },
      { id: "pkg-002-b", clubId: "club-002", name: "Entry + Drinks", description: "Entry with premium drinks package", type: "entry_drinks", pricePerPerson: 2200, priceCouple: 4000, priceGroup: 1900, includesTransport: false, includesDrinks: true, drinksAllowance: 2, features: ["Club Entry", "2 Signature Cocktails", "Priority Entry", "Rooftop Access"], isActive: true },
      { id: "pkg-002-c", clubId: "club-002", name: "Entry + Bike", description: "Entry with bike pickup", type: "entry_bike", pricePerPerson: 1600, priceCouple: 2600, priceGroup: 1400, includesTransport: true, includesDrinks: false, features: ["Club Entry", "Bike Pickup & Drop", "Quick Ride", "Rooftop Access"], isActive: true },
      { id: "pkg-002-d", clubId: "club-002", name: "⭐ Full Combo", description: "Ultimate premium experience", type: "full_combo", pricePerPerson: 3500, priceCouple: 6500, priceGroup: 3000, includesTransport: true, includesDrinks: true, drinksAllowance: 4, features: ["Club Entry", "4 Premium Drinks", "Cab Pickup & Drop", "VIP Priority Queue", "Private Cabin", "Dedicated Waiter"], isActive: true }
    ]
  },
  {
    id: "club-003",
    name: "F Bar & Lounge",
    description: "Mumbai's hottest nightlife destination with breathtaking skyline views, craft cocktails, and live music acts. A landmark of the Kamala Mills nightlife scene.",
    address: "High Street Phoenix, Kamala Mills, Lower Parel",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400013",
    phone: "9920123456",
    email: "hello@fbar.in",
    ownerWhatsapp: "9920123456",
    capacity: 280,
    openTime: "20:00:00",
    closeTime: "03:00:00",
    rating: 4.7,
    totalReviews: 2156,
    isActive: true,
    amenities: ["Skyline View", "Live Music", "Craft Cocktails", "Food Menu", "Private Cabins", "DJ Nights"],
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80",
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80"
    ],
    packages: [
      { id: "pkg-003-a", clubId: "club-003", name: "Entry Only", description: "Entry to F Bar", type: "entry_only", pricePerPerson: 1000, priceCouple: 1800, priceGroup: 900, includesTransport: false, includesDrinks: false, features: ["Club Entry", "Skyline View Access", "Dance Floor"], isActive: true },
      { id: "pkg-003-b", clubId: "club-003", name: "Entry + Drinks", description: "Entry with signature cocktails", type: "entry_drinks", pricePerPerson: 1800, priceCouple: 3200, priceGroup: 1600, includesTransport: false, includesDrinks: true, drinksAllowance: 2, features: ["Club Entry", "2 Craft Cocktails", "Priority Queue", "Skyline View"], isActive: true },
      { id: "pkg-003-c", clubId: "club-003", name: "Entry + Cab", description: "Entry with cab service", type: "entry_cab", pricePerPerson: 2000, priceCouple: 3500, priceGroup: 1800, includesTransport: true, includesDrinks: false, features: ["Club Entry", "Cab Pickup & Drop", "Safe Night Return", "Dance Floor"], isActive: true },
      { id: "pkg-003-d", clubId: "club-003", name: "⭐ Full Combo", description: "Complete F Bar experience", type: "full_combo", pricePerPerson: 3000, priceCouple: 5500, priceGroup: 2700, includesTransport: true, includesDrinks: true, drinksAllowance: 3, features: ["Club Entry", "3 Craft Cocktails", "Cab Pickup & Drop", "VIP Entry", "Private Cabin", "Skyline View Table"], isActive: true }
    ]
  },
  {
    id: "club-004",
    name: "Tito's Club",
    description: "Goa's legendary beach club since 1971. The oldest and most iconic nightclub in India with live bands, international DJs, and the best beach vibes.",
    address: "Tito's Lane, Baga Beach, Calangute",
    city: "Goa",
    state: "Goa",
    pincode: "403516",
    phone: "9823456789",
    email: "titos@goa.com",
    ownerWhatsapp: "9823456789",
    capacity: 500,
    openTime: "21:00:00",
    closeTime: "04:00:00",
    rating: 4.6,
    totalReviews: 5432,
    isActive: true,
    amenities: ["Beach Access", "Live Bands", "DJ Nights", "Bar", "Dance Floor", "Outdoor Area"],
    images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80"
    ],
    packages: [
      { id: "pkg-004-a", clubId: "club-004", name: "Entry Only", description: "Entry to Tito's", type: "entry_only", pricePerPerson: 600, priceCouple: 1000, priceGroup: 500, includesTransport: false, includesDrinks: false, features: ["Club Entry", "Beach Access", "Live Music"], isActive: true },
      { id: "pkg-004-b", clubId: "club-004", name: "Entry + Drinks", description: "Entry with drinks", type: "entry_drinks", pricePerPerson: 1200, priceCouple: 2000, priceGroup: 1000, includesTransport: false, includesDrinks: true, drinksAllowance: 2, features: ["Club Entry", "2 Drinks", "Beach Access", "Priority Queue"], isActive: true },
      { id: "pkg-004-c", clubId: "club-004", name: "Entry + Bike", description: "Entry with bike taxi", type: "entry_bike", pricePerPerson: 900, priceCouple: 1500, priceGroup: 800, includesTransport: true, includesDrinks: false, features: ["Club Entry", "Bike Pickup", "Beach Access", "Dance Floor"], isActive: true },
      { id: "pkg-004-d", clubId: "club-004", name: "⭐ Full Combo", description: "Full Goa beach experience", type: "full_combo", pricePerPerson: 2000, priceCouple: 3500, priceGroup: 1800, includesTransport: true, includesDrinks: true, drinksAllowance: 3, features: ["Club Entry", "3 Drinks", "Cab Pickup & Drop", "VIP Entry", "Beach Table", "Live Band Access"], isActive: true }
    ]
  },
  {
    id: "club-005",
    name: "The Humming Tree",
    description: "Bangalore's premier live music venue and nightclub. Known for hosting India's best indie artists, the finest craft beers, and an electric crowd.",
    address: "Wood Street, Ashok Nagar",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560025",
    phone: "9900112233",
    email: "hello@hummingtree.in",
    ownerWhatsapp: "9900112233",
    capacity: 300,
    openTime: "19:00:00",
    closeTime: "02:00:00",
    rating: 4.7,
    totalReviews: 3201,
    isActive: true,
    amenities: ["Live Music", "Craft Beer", "Food Menu", "Indie Artists", "Outdoor Patio", "VIP Area"],
    images: [
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80"
    ],
    packages: [
      { id: "pkg-005-a", clubId: "club-005", name: "Entry Only", description: "Venue entry", type: "entry_only", pricePerPerson: 700, priceCouple: 1200, priceGroup: 600, includesTransport: false, includesDrinks: false, features: ["Venue Entry", "Live Music Access", "Outdoor Patio"], isActive: true },
      { id: "pkg-005-b", clubId: "club-005", name: "Entry + Drinks", description: "Entry with craft beers", type: "entry_drinks", pricePerPerson: 1400, priceCouple: 2400, priceGroup: 1200, includesTransport: false, includesDrinks: true, drinksAllowance: 2, features: ["Venue Entry", "2 Craft Beers/Cocktails", "Live Music", "Priority Seating"], isActive: true },
      { id: "pkg-005-c", clubId: "club-005", name: "Entry + Cab", description: "Entry with cab pickup", type: "entry_cab", pricePerPerson: 1700, priceCouple: 2900, priceGroup: 1500, includesTransport: true, includesDrinks: false, features: ["Venue Entry", "Cab Pickup & Drop", "Live Music", "Outdoor Patio"], isActive: true },
      { id: "pkg-005-d", clubId: "club-005", name: "⭐ Full Combo", description: "Full Humming Tree experience", type: "full_combo", pricePerPerson: 2800, priceCouple: 5000, priceGroup: 2500, includesTransport: true, includesDrinks: true, drinksAllowance: 3, features: ["Venue Entry", "3 Craft Drinks", "Cab Pickup & Drop", "VIP Seating", "Artist Meet & Greet", "Priority Entry"], isActive: true }
    ]
  },
  {
    id: "club-006",
    name: "Aer Lounge Bar",
    description: "A rooftop bar experience like no other — 34 floors above Mumbai with panoramic city views. Premium drinks, sunset cocktails, and the Mumbai skyline as your backdrop.",
    address: "Four Seasons Hotel, 34F, Worli",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400018",
    phone: "9833445566",
    email: "aer@fourseasons.com",
    ownerWhatsapp: "9833445566",
    capacity: 180,
    openTime: "17:00:00",
    closeTime: "01:00:00",
    rating: 4.9,
    totalReviews: 1876,
    isActive: true,
    amenities: ["Rooftop", "Panoramic View", "Premium Cocktails", "Sunset Views", "VIP Service", "Fine Dining"],
    images: [
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80",
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80"
    ],
    packages: [
      { id: "pkg-006-a", clubId: "club-006", name: "Entry Only", description: "Rooftop entry", type: "entry_only", pricePerPerson: 1500, priceCouple: 2500, priceGroup: 1300, includesTransport: false, includesDrinks: false, features: ["Rooftop Access", "Panoramic View", "Sunset Experience"], isActive: true },
      { id: "pkg-006-b", clubId: "club-006", name: "Entry + Drinks", description: "Entry with premium cocktails", type: "entry_drinks", pricePerPerson: 3000, priceCouple: 5500, priceGroup: 2700, includesTransport: false, includesDrinks: true, drinksAllowance: 2, features: ["Rooftop Access", "2 Premium Cocktails", "Sunset View", "Priority Seating"], isActive: true },
      { id: "pkg-006-c", clubId: "club-006", name: "Entry + Cab", description: "Entry with cab service", type: "entry_cab", pricePerPerson: 2500, priceCouple: 4000, priceGroup: 2200, includesTransport: true, includesDrinks: false, features: ["Rooftop Access", "Cab Pickup & Drop", "Panoramic Views", "VIP Entry"], isActive: true },
      { id: "pkg-006-d", clubId: "club-006", name: "⭐ Full Combo", description: "Ultimate sky-high experience", type: "full_combo", pricePerPerson: 5000, priceCouple: 9000, priceGroup: 4500, includesTransport: true, includesDrinks: true, drinksAllowance: 3, features: ["Rooftop Access", "3 Premium Cocktails", "Cab Pickup & Drop", "VIP Priority", "Dedicated Server", "Sunset Table Reservation"], isActive: true }
    ]
  }
];

module.exports = { CLUBS };
