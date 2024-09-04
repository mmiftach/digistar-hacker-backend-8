const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    password: {type :String,required: true},
    username: {type :String,required: true,unique: true},
});

module.exports = {
    userSchema
}