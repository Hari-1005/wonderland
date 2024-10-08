const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main()
.then(()=>{
    console.log("connected to DB");
    })
.catch((err)=>{
    console.log(err);
    });

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderland');
}
async function initDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj,owner:"66e52e8d9cd6c621dc3b884f"}));
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
    
}

initDB();