// Migration script to add wishlists field to existing users
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const User = require("./models/user");

const dbUrl = process.env.ATLASDB_URL;

async function migrateUsers() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log("Connected to database");
    
    // Update all users to have wishlists field if they don't have it
    const result = await User.updateMany(
      { wishlists: { $exists: false } },
      { $set: { wishlists: [] } }
    );
    
    console.log(`Updated ${result.modifiedCount} users with wishlists field`);
    
    // Verify the update
    const users = await User.find({});
    console.log("All users now have wishlists field:");
    users.forEach(user => {
      console.log(`User: ${user.username}, Wishlists: ${user.wishlists}`);
    });
    
    mongoose.connection.close();
    console.log("Migration completed successfully");
    
  } catch (error) {
    console.error("Migration failed:", error);
    mongoose.connection.close();
  }
}

migrateUsers();