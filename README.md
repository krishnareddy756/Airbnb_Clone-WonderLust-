# Wanderlust - Full Stack Property Rental Platform

A production-ready full-stack property listing and booking platform with secure authentication, real-time payments, and cloud-based infrastructure.

## 🚀 Live Demo
**[View Live Application](https://airbnb-clone-wonderlust.onrender.com/listings)**

## 🛠 Tech Stack

### Frontend
- **EJS** - Templating engine
- **Bootstrap 5** - Responsive UI
- **Mapbox GL JS** - Interactive geolocation mapping
- **HTML5/CSS3/Vanilla JavaScript**

### Backend
- **Node.js & Express.js** - Server runtime & web framework
- **MVC Architecture** - Clean code separation
- **MongoDB & Mongoose** - NoSQL database with ODM
- **Passport.js** - Multi-strategy authentication
- **PayPal Checkout SDK** - Secure payment processing

### Cloud Services
- **Cloudinary** - Image hosting & optimization CDN
- **MongoDB Atlas** - Managed database-as-a-service
- **Render** - Application deployment platform

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless API authentication
- **Google OAuth 2.0** - Social login integration
- **Local Passport Strategy** - Username/password auth
- **Passport-Local-Mongoose** - Hashed password management
- **Express Session** - Secure session management (MongoDB store)

---

## 💡 Key Features

### 🔐 Authentication & Authorization
- ✅ **Multi-Strategy Authentication** - Local (username/password), Google OAuth 2.0, JWT
- ✅ **Secure Session Management** - MongoDB-backed Express sessions
- ✅ **Password Hashing** - Passport-Local-Mongoose integration
- ✅ **Protected Routes** - Role-based access control for user-specific actions

### 🏠 Property Listings Management
- ✅ **Complete CRUD Operations** - Create, read, update, delete listings
- ✅ **Advanced Search & Filtering** - By location (case-insensitive), price range, pagination
- ✅ **Geolocation Integration** - Mapbox geocoding for property coordinates
- ✅ **Image Upload & Storage** - Cloudinary CDN with optimization
- ✅ **Listing Ownership** - Users can only edit/delete their own properties

### 📅 Booking & Payment System
- ✅ **PayPal Integration** - Secure payment processing (Sandbox & Live modes)
- ✅ **Smart Date Conflict Prevention** - Prevents double-booking with real-time validation
- ✅ **Multi-Currency Support** - INR to USD conversion for international payments
- ✅ **Booking Management** - View booking history, cancellation, and status tracking
- ✅ **Dynamic Price Calculation** - Real-time pricing based on stay duration and guest count

### ⭐ Reviews & Ratings
- ✅ **Property Reviews** - Verified booking reviews only
- ✅ **Star Ratings** - 1-5 star rating system
- ✅ **Review Deletion** - Users can delete their own reviews

### ❤️ Wishlist Feature
- ✅ **Save Favorites** - Add/remove properties to personal wishlist
- ✅ **Wishlist Management** - View all saved properties in one place
- ✅ **Persistent Storage** - Wishlist saved to database

### 🗺️ Geolocation & Maps
- ✅ **Interactive Mapbox Integration** - Display property locations
- ✅ **Geocoding** - Convert addresses to coordinates automatically
- ✅ **Map Clustering** - Visualize multiple properties efficiently

### 📱 User Experience
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimization
- ✅ **Flash Messages** - Real-time user feedback (success/error notifications)
- ✅ **Error Handling** - Comprehensive error pages and validation

---

## 🏗️ Project Structure

```
Wanderlust/
├── models/                 # Database schemas
│   ├── user.js            # User model with wishlists
│   ├── listing.js         # Property listing model with geolocation
│   ├── booking.js         # Booking model with payment status
│   └── review.js          # Review/rating model
├── controllers/           # Business logic
│   ├── user.js           # Auth, wishlist, profile logic
│   ├── listings.js       # CRUD & search operations
│   ├── booking.js        # Payment & booking management
│   └── review.js         # Review creation/deletion
├── routes/               # API endpoints
│   ├── user.js          # Authentication & user routes
│   ├── listing.js       # Listing routes
│   ├── booking.js       # Booking & payment routes
│   ├── review.js        # Review routes
│   └── api.js           # JWT API routes
├── middleware/          # Custom middleware
├── utils/               # Helper utilities
│   ├── jwt.js          # JWT token generation & verification
│   ├── wrapAsync.js    # Async error wrapper
│   └── ExpressError.js # Custom error class
├── views/              # EJS templates
│   ├── listings/       # Property listing pages
│   ├── users/          # Auth & profile pages
│   ├── bookings/       # Booking confirmation pages
│   └── includes/       # Navbar, footer, flash messages
├── public/            # Static assets
│   ├── css/           # Stylesheets
│   └── js/            # Client-side scripts
├── init/              # Database initialization
├── app.js            # Express app configuration
├── paypalConfig.js   # PayPal SDK setup
├── Dockerfile        # Container configuration
└── package.json      # Dependencies & scripts
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v22.11.0 or higher
- MongoDB Atlas account & connection string
- Cloudinary account & API credentials
- PayPal Developer account (optional for testing)
- Mapbox account & API token (optional for maps)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishnareddy756/Airbnb_Clone-WonderLust-.git
   cd Airbnb_Clone-WonderLust-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the root directory
   ```env
   # Database
   ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust
   
   # Session
   SECRET=your_secret_key_here
   NODE_ENV=development
   PORT=8002
   
   # Cloudinary (Image Storage)
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Mapbox (Geolocation)
   MAP_TOKEN=your_mapbox_token
   
   # PayPal (Payments)
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_client_secret
   PAYPAL_MODE=sandbox
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:8002/auth/google/callback
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
5. **Access the application**
   - Open browser to `http://localhost:8002/listings`

---

## 🧪 Testing

### Manual Testing
1. **Create a test account** - Sign up with email/password or Google
2. **Create listings** - Add sample properties with prices
3. **Test booking flow** - Select dates, complete PayPal payment (Sandbox mode)
4. **Verify features** - Test reviews, wishlist, search filters
5. **Check database** - Verify bookings and payment statuses in MongoDB

### Sample Data
The project includes 25+ sample listings in `init/data.js` for testing. Run initialization to populate the database.

---

## 📊 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - Local login
- `GET /logout` - Logout
- `GET /auth/google` - Google OAuth login
- `POST /api/login` - JWT token generation

### Listings
- `GET /listings` - Get all listings (with search/filter)
- `GET /listings/:id` - Get single listing details
- `POST /listings` - Create new listing
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Bookings
- `POST /bookings` - Create booking & initiate payment
- `GET /bookings/success` - Payment success page
- `GET /bookings/cancel` - Payment cancelled page

### Reviews
- `POST /listings/:id/reviews` - Add review to listing
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Wishlists
- `GET /wishlists` - View user's wishlist
- `POST /wishlists/:id` - Add to wishlist
- `DELETE /wishlists/:id` - Remove from wishlist

---

## 🔒 Security Features

- **Password Security**: Passwords are hashed using bcrypt via Passport
- **CSRF Protection**: Method-override for safe form submissions
- **Session Security**: HTTP-only cookies with 7-day expiration
- **Database Validation**: Joi schema validation for all inputs
- **Error Handling**: Comprehensive error pages prevent information leakage
- **Authentication Middleware**: Protected routes require login
- **Authorization Checks**: Users can only modify their own listings/bookings

---

## 📈 Performance & Scalability

- **Cloud Database**: MongoDB Atlas for automatic scaling
- **CDN**: Cloudinary for optimized image delivery
- **Pagination**: Listings paginated to reduce load (12 per page)
- **Containerization**: Docker setup for consistent deployment
- **Session Persistence**: MongoDB session store for distributed systems

---

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t wanderlust .
docker run -p 8002:8002 --env-file .env wanderlust
```

---

## 📦 Dependencies

**Core:**
- express (v4.21.2)
- mongoose (v8.16.2)
- ejs & ejs-mate (templating)
- passport & passport-google-oauth20 (auth)

**Payment & Storage:**
- @paypal/checkout-server-sdk (PayPal)
- cloudinary & multer-storage-cloudinary (images)

**Utilities:**
- jsonwebtoken (JWT)
- joi (validation)
- connect-mongo (session store)
- dotenv (environment variables)

---

## 🚢 Deployment

### Deployed on Render
The application is live at: **https://airbnb-clone-wonderlust.onrender.com/listings**

**Deployment Stack:**
- **Hosting**: Render (Node.js/Express)
- **Database**: MongoDB Atlas (Cloud)
- **CDN**: Cloudinary (Images)
- **Maps**: Mapbox (Geolocation)

---

## 📋 Resume Highlights

- **Built a full-stack MERN application** featuring property listings, bookings, reviews, and secure JWT-based authentication, implementing MVC architecture for clean code separation and maintainability.

- **Developed RESTful APIs with complete CRUD operations** for listings and bookings, integrated PayPal payment processing for secure transactions, and validated all endpoints using Postman to ensure reliability.

- **Deployed on Render with MongoDB Atlas**, integrated **PayPal payment gateway**, **Cloudinary CDN**, and **Google OAuth**, implemented intelligent date-conflict prevention, and achieved production-grade stability with Mapbox geolocation and comprehensive error handling.

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Krishna Reddy**

- GitHub: [krishnareddy756](https://github.com/krishnareddy756)
- Project: [Airbnb Clone - Wanderlust](https://github.com/krishnareddy756/Airbnb_Clone-WonderLust-.git)

---

## 🙏 Acknowledgments

- Mapbox for geolocation APIs
- Cloudinary for image hosting
- PayPal for payment processing
- Bootstrap for responsive design
- MongoDB for scalable database

