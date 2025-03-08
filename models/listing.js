const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1741087562365-d0bf6e6fd7ef?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
        set: (v)=>
            v=="" 
        ?"https://images.unsplash.com/photo-1741087562365-d0bf6e6fd7ef?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
         :v,
    },
    price:{
        type:Number ,
        default:1000},
    location:String,
    country:String,
});
    
const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;