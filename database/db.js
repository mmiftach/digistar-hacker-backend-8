
const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/digistar";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

//function to test connection mongodb
async function connectDB(){
    try{
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }catch(err){
        console.log("MongoDB connection failed",err);
        process.exit(1);
    }
}

async function closeDB(){
    try{
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }catch(err){
        console.log("MongoDB connection failed",err);
        process.exit(1);
    }
}
module.exports ={
    connectDB,
    closeDB
};