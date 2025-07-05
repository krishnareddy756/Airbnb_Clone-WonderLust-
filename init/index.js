const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');

const MONGO_URL='mongodb://localhost:27017/wanderlust';

main()
   .then(() => console.log('Database connected'))
   .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}  
const initDB = async () => {
    await Listing.deleteMany({});
    
    initData.data = initData.data.map((obj) => {
        return { ...obj, owner: '68611d7616b0e55498529457' };
    });

    await Listing.insertMany(initData.data);
    console.log('Data was inserted');
};

initDB();

