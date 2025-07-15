const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name:{
        type:String,
        required: true,
    },

    email:{
        type:String,
        required: false,
    },

    message:{
        type:String,
        required: true,
    }
})

module.exports=mongoose.model(
        "feedbackModel",  //filename
        feedbackSchema 
)