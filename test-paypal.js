/**
 * DEBUG SCRIPT: Test PayPal Integration
 * This script logs detailed information about the PayPal order being created
 */

const mongoose = require("mongoose");
require("dotenv").config();

const Listing = require("./models/listing");
const { client, orders } = require("./paypalConfig");

const dbUrl = process.env.ATLASDB_URL;

async function testPayPalOrder() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✓ Database connected\n");

    // Get a test listing
    const listing = await Listing.findOne();
    if (!listing) {
      console.error("✗ No listings found in database");
      process.exit(1);
    }

    console.log("Test Listing Details:");
    console.log(`- Title: ${listing.title}`);
    console.log(`- Price: $${listing.price} USD`);
    console.log(`- Location: ${listing.location}, ${listing.country}\n`);

    // Simulate booking parameters
    const checkInDate = new Date();
    const checkOutDate = new Date(checkInDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 nights
    const numberOfNights = 3;
    const totalPriceUSD = listing.price * numberOfNights;

    console.log("Simulated Booking:");
    console.log(`- Check-in: ${checkInDate.toLocaleDateString()}`);
    console.log(`- Check-out: ${checkOutDate.toLocaleDateString()}`);
    console.log(`- Nights: ${numberOfNights}`);
    console.log(`- Price per night: $${listing.price} USD`);
    console.log(`- Total: $${totalPriceUSD} USD\n`);

    // Create PayPal order
    console.log("Creating PayPal Order...\n");

    let paypalRequest = new orders.OrdersCreateRequest();
    paypalRequest.prefer("return=representation");

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalPriceUSD.toString(),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalPriceUSD.toString(),
              },
            },
          },
          items: [
            {
              name: listing.title,
              description: `${numberOfNights} night(s) - ${listing.location}, ${listing.country}`,
              quantity: "1",
              unit_amount: {
                currency_code: "USD",
                value: totalPriceUSD.toString(),
              },
            },
          ],
        },
      ],
      application_context: {
        brand_name: "WonderLust",
        locale: "en-US",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.APP_URL || "http://localhost:8002"}/bookings/success`,
        cancel_url: `${process.env.APP_URL || "http://localhost:8002"}/bookings/cancel`,
      },
    };

    console.log("Order Payload:");
    console.log(JSON.stringify(orderPayload, null, 2));
    console.log("\n");

    paypalRequest.requestBody(orderPayload);

    // Execute request
    const order = await client().execute(paypalRequest);

    console.log("✓ PayPal Order Created Successfully!\n");
    console.log("Order Details:");
    console.log(`- Order ID: ${order.result.id}`);
    console.log(`- Status: ${order.result.status}`);
    console.log(`- Intent: ${order.result.intent}`);
    console.log(`- Amount: $${order.result.purchase_units[0].amount.value} ${order.result.purchase_units[0].amount.currency_code}\n`);

    // Get approval link
    const approvalLink = order.result.links.find((link) => link.rel === "approve");
    if (approvalLink) {
      console.log("✓ Approval Link Found:");
      console.log(approvalLink.href);
    } else {
      console.error("✗ Approval link not found");
    }

    console.log("\n✓ PayPal Integration Test PASSED!");
    console.log("\nNow test in browser:");
    console.log("1. Start server: node app.js");
    console.log("2. Go to: http://localhost:8002/listings");
    console.log("3. Click a listing");
    console.log("4. Select dates and click 'Reserve'");
    console.log("5. You should be redirected to PayPal Sandbox");
    console.log("6. Log in with your PERSONAL test account (buyer)");
    console.log("7. Approve the payment");

    process.exit(0);
  } catch (error) {
    console.error("✗ Error:", error.message);
    if (error.details) {
      console.error("\nPayPal Details:");
      console.error(JSON.stringify(error.details, null, 2));
    }
    console.error("\nTroubleshooting:");
    console.error("1. Check .env file has correct PayPal credentials");
    console.error("2. Verify APP_URL matches your server port");
    console.error("3. Check PayPal Sandbox account has USD currency enabled");
    console.error("4. Make sure you have internet connection for PayPal API calls");
    process.exit(1);
  }
}

testPayPalOrder();
