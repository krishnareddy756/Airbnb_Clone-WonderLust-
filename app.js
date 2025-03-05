const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing");
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



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
// index route
app.get('/listings', async(req, res) => {
    const allListings=await Listing.find({})
    res.render('listings/index',{allListings});
});
    
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

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});  