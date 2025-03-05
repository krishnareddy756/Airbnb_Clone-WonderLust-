const sampleListings =[
    {
      "title": "Cozy Mountain Cabin",
      "description": "A peaceful retreat in the mountains with stunning views.",
      "image": "https://images.unsplash.com/photo-1615874959474-16f4d277e226",
      "price": 120,
      "location": "Aspen, Colorado",
      "country": "USA"
    },
    {
      "title": "Beachfront Villa",
      "description": "Luxury villa with private beach access and a pool.",
      "image": "https://images.unsplash.com/photo-1618773928121-bb66b5dcea02",
      "price": 350,
      "location": "Malibu, California",
      "country": "USA"
    },
    {
      "title": "Modern Apartment in Tokyo",
      "description": "A stylish and compact apartment in the heart of Tokyo.",
      "image": "",
      "price": 200,
      "location": "Shinjuku, Tokyo",
      "country": "Japan"
    },
    {
      "title": "Historic Paris Loft",
      "description": "Beautiful loft with a view of the Eiffel Tower.",
      "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "price": 280,
      "location": "Paris",
      "country": "France"
    },
    {
      "title": "Countryside Cottage",
      "description": "Charming cottage surrounded by nature, perfect for a weekend getaway.",
      "image": "",
      "price": 90,
      "location": "Cotswolds",
      "country": "UK"
    },
    {
      "title": "Urban Studio Apartment",
      "description": "A minimalist studio in the heart of the city.",
      "image": "",
      "price": 150,
      "location": "New York City",
      "country": "USA"
    },
    {
      "title": "Luxury Penthouse",
      "description": "A stunning penthouse with skyline views.",
      "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "price": 500,
      "location": "Dubai",
      "country": "UAE"
    },
    {
      "title": "Desert Getaway",
      "description": "A serene escape in the middle of the desert.",
      "image": "",
      "price": 180,
      "location": "Marrakech",
      "country": "Morocco"
    },
    {
      "title": "Treehouse Retreat",
      "description": "A cozy treehouse with breathtaking forest views.",
      "image": "https://images.unsplash.com/photo-1521747116042-5a810fda9664",
      "price": 140,
      "location": "Vancouver",
      "country": "Canada"
    },
    {
      "title": "Ski Chalet",
      "description": "A winter wonderland chalet near the slopes.",
      "image": "",
      "price": 260,
      "location": "Zermatt",
      "country": "Switzerland"
    },
    {
      "title": "Mediterranean Villa",
      "description": "A stunning villa with ocean views.",
      "image": "https://images.unsplash.com/photo-1558449028-9a42c1619925",
      "price": 400,
      "location": "Santorini",
      "country": "Greece"
    },
    {
      "title": "Coastal Bungalow",
      "description": "A charming bungalow just steps from the beach.",
      "image": "",
      "price": 175,
      "location": "Bali",
      "country": "Indonesia"
    },
    {
      "title": "Farmhouse Escape",
      "description": "A rustic farmhouse surrounded by greenery.",
      "image": "https://images.unsplash.com/photo-1618220179428-bcf9bcaa54eb",
      "price": 110,
      "location": "Tuscany",
      "country": "Italy"
    },
    {
      "title": "Modern Loft",
      "description": "A trendy loft with industrial decor.",
      "image": "",
      "price": 190,
      "location": "Berlin",
      "country": "Germany"
    },
    {
      "title": "Castle Stay",
      "description": "Experience royal living in this historic castle.",
      "image": "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
      "price": 600,
      "location": "Edinburgh",
      "country": "Scotland"
    },
    {
      "title": "Lakehouse Cabin",
      "description": "A peaceful cabin with stunning lake views.",
      "image": "",
      "price": 130,
      "location": "Lake Tahoe",
      "country": "USA"
    },
    {
      "title": "Tropical Paradise Resort",
      "description": "A private resort on a secluded island.",
      "image": "https://images.unsplash.com/photo-1564507592333-5fe57a71975e",
      "price": 800,
      "location": "Maldives",
      "country": "Maldives"
    },
    {
      "title": "Quaint Village Home",
      "description": "A traditional home in a quiet village.",
      "image": "",
      "price": 95,
      "location": "Bruges",
      "country": "Belgium"
    },
    {
      "title": "Skyscraper Apartment",
      "description": "A high-rise apartment with city lights view.",
      "image": "https://images.unsplash.com/photo-1505798577917-a65157d3320d",
      "price": 300,
      "location": "Hong Kong",
      "country": "China"
    },
    {
      "title": "Jungle Hideaway",
      "description": "A cabin deep in the jungle, close to nature.",
      "image": "",
      "price": 160,
      "location": "Amazon Rainforest",
      "country": "Brazil"
    },
    {
      "title": "Himalayan Lodge",
      "description": "Stay in a remote lodge with mountain views.",
      "image": "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
      "price": 220,
      "location": "Kathmandu",
      "country": "Nepal"
    },
    {
      "title": "Floating House",
      "description": "A unique house floating on a lake.",
      "image": "",
      "price": 210,
      "location": "Kashmir",
      "country": "India"
    },
    {
      "title": "Rainforest Treehouse",
      "description": "A luxurious treehouse nestled in the rainforest.",
      "image": "https://images.unsplash.com/photo-1572276596232-c87b850211dc",
      "price": 250,
      "location": "Costa Rica",
      "country": "Costa Rica"
    },
    {
      "title": "Cave Home",
      "description": "An exotic home built into a cave.",
      "image": "",
      "price": 180,
      "location": "Matera",
      "country": "Italy"
    },
    {
      "title": "Safari Lodge",
      "description": "Experience wildlife up close in this safari lodge.",
      "image": "https://images.unsplash.com/photo-1571428577639-55c8cd2121e4",
      "price": 350,
      "location": "Serengeti",
      "country": "Tanzania"
    },
    {
      "title": "Snowy Cabin",
      "description": "A cozy cabin surrounded by snow.",
      "image": "",
      "price": 170,
      "location": "Lapland",
      "country": "Finland"
    },
    {
      "title": "Igloo Retreat",
      "description": "Stay in an igloo under the Northern Lights.",
      "image": "https://images.unsplash.com/photo-1521747116042-5a810fda9664",
      "price": 290,
      "location": "Reykjavik",
      "country": "Iceland"
    },
    {
      "title": "Cliffside Retreat",
      "description": "A home built on the edge of a stunning cliff.",
      "image": "",
      "price": 320,
      "location": "Amalfi Coast",
      "country": "Italy"
    }
  ];
  
  module.exports = { data: sampleListings };
  