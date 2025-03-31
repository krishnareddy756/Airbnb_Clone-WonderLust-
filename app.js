const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing");
const path = require('path');
const { url } = require('inspector');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { listingSchema } = require('./schema.js');

const MONGO_URL='mongodb://localhost:27017/wanderlust';

main()
   .then(() => console.log('Database connected'))
   .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}   
    
app.get('/', (req, res) => {
    res.send('HI I AM ROOT');
});

const validateListing = (req, res, next) => {
    let {error}=listingSchema.validate(req.body);
        let errMsg=error.details.map(el=>el.message).join(',')
        if(error) {
            throw new ExpressError(400,errMsg); // ✅ Use ExpressError for validation errors
        }
        else{
            next(); // ✅ Call next() if validation passes
        }
    };


// index route
app.get('/listings', wrapAsync( async(req, res) => {
    const allListings=await Listing.find({})
    res.render('listings/index',{allListings});
}));
//new route
app.get('/listings/new', (req, res) => {
    res.render('listings/new');
});
//create route
app.post('/listings',
    validateListing, // ✅ Use the validation middleware here
     wrapAsync(async (req, res,next) => {  
        
        // ✅ Validate the request body
        const newListing = new Listing(req.body.listing);  // ✅ Extract 'listing' from req.body
        console.log(newListing);
        await newListing.save();
        res.redirect('/listings');
    
    
    
}));

//show route
app.get('/listings/:id',wrapAsync( async(req, res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/show',{listing});
}));
    
//edit route
app.get('/listings/:id/edit',wrapAsync( async(req, res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('listings/edit',{listing});
}));

//update route
app.put('/listings/:id'
, validateListing // ✅ Use the validation middleware here
    ,wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);  // ✅ Corrected redirect
}));

//delete route
app.delete('/listings/:id',wrapAsync( async(req, res) => {
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// app.get('/testListings',  async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'Test Listing',
//         description: 'This is a test listing',
//         image: 'https://images.unsplash.com/photo-1741087562365-d0bf6e6fd7ef?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8',
//         price: 100,
//         location: 'Test Location',
//         country: 'Test Country',
//     });
    // await sampleListing.save();
    // console.log('Test listing created');
    // res.send('Test listing created');
app.all('*', (req, res,next) => {
    next (new ExpressError(404,'Page Not Found'));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render('error',{message});
   // res.status(statusCode).send(message);
    //res.send("Something went wrong")
} );
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});  