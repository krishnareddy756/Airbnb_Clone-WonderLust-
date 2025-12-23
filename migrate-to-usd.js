const mongoose = require("mongoose");
require("dotenv").config();

// Import the Listing model
const Listing = require("./models/listing");

const migrateToUSD = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB Atlas");

    // Get all listings
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings to migrate`);

    let migratedCount = 0;

    // Convert each listing price from INR to USD
    // Using conversion rate: 1 USD = ~83 INR (adjust as needed)
    const conversionRate = 1 / 83; // INR to USD
    
    for (const listing of listings) {
      const originalPrice = listing.price;
      
      // Convert price: if it's still INR (price > 100), convert to USD
      if (originalPrice > 100) {
        listing.price = Math.round(originalPrice * conversionRate * 100) / 100;
        await listing.save();
        console.log(
          `Migrated: ${originalPrice} INR → ${listing.price} USD`
        );
        migratedCount++;
      } else {
        console.log(`Skipped: ${listing.title} (Already USD: $${originalPrice})`);
      }
    }

    console.log(`\n✅ Migration complete! ${migratedCount} listings converted to USD`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateToUSD();
