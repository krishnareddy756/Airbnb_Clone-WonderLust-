const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; // Import ObjectId

const sampleListings = [
  {
    _id: new ObjectId(), // Generates a new unique ObjectId
    title: 'Luxury Beachfront Villa',
    description: 'A stunning villa with a private beach and infinity pool.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    price: 1500,
    location: 'Maui',
    country: 'USA'
  },
  {
    _id: new ObjectId(),
    title: 'Charming Cottage in the Woods',
    description: 'A peaceful retreat surrounded by nature and hiking trails.',
    image: 'https://images.unsplash.com/photo-1598228723793-52759c1f9e34',
    price: 300,
    location: 'Banff',
    country: 'Canada'
  },
  {
    _id: new ObjectId(),
    title: 'Modern Penthouse in New York',
    description: 'A stylish penthouse with city skyline views.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    price: 2500,
    location: 'New York',
    country: 'USA'
  },
  {
    _id: new ObjectId(),
    title: 'Traditional Ryokan in Kyoto',
    description: 'Experience authentic Japanese culture with an onsen bath.',
    image: 'https://images.unsplash.com/photo-1534412712727-805a7f26f3d5',
    price: 500,
    location: 'Kyoto',
    country: 'Japan'
  },
  {
    _id: new ObjectId(),
    title: 'Glass Igloo in Lapland',
    description: 'A unique stay with a glass roof for watching the Northern Lights.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    price: 800,
    location: 'Rovaniemi',
    country: 'Finland'
  }
];

module.exports = { data: sampleListings };
